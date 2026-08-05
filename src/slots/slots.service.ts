import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { INTERNAL_SERVER_ERROR, NOT_EXISTED_SLOT_ERROR, NOT_EXISTED_USER_ERROR, SLOT_OVERLAP_ERROR } from 'src/constants/error-code';
import { PrismaService } from 'src/prisma/prisma.service';
import { SlotCreationDto } from './dto/slot-creation.dto';
import { SlotDeletionDto } from './dto/slot-deletion.dto';
import { SlotStatus } from 'src/generated/prisma/enums';
import { SlotExchangeUpdationDto } from './dto/slot-exchange-updation.dto';
import { Prisma } from 'src/generated/prisma/client';
import { RoomServiceClient } from 'livekit-server-sdk';
import { livekitApiKey, livekitApiSecret, livekitUrl } from 'src/utils/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PaginationDto } from 'src/helpers/pagination/dto/pagination.dto';
import { SlotPaginationDto } from './dto/slot-pagination.dto';
import { getPaginationParams } from 'src/helpers/pagination/parsing-pagination-query';
import { paginate } from 'src/helpers/pagination/parseing-pagination-result';
import { SlotCreateInput } from 'src/generated/prisma/models';
import { UserLanguagesService } from 'src/user_languages/user_languages.service';

@Injectable()
export class SlotsService {
    private roomService: RoomServiceClient;
    private readonly apiKey = livekitApiKey;
    private readonly apiSecret = livekitApiSecret;
    private readonly url = livekitUrl;
    constructor(private readonly prisma: PrismaService, @InjectQueue('meeting-timeout') private timeoutQueue: Queue,
        private readonly userLanguageService: UserLanguagesService
    ) {
        this.roomService = new RoomServiceClient(
            this.url,
            this.apiKey,
            this.apiSecret,
        );
    }

    async getAllSlotsByUserId(userId: string, query: SlotPaginationDto) {
        const { page, limit, skip } = getPaginationParams(query)
        const { status, order } = query;

        try {
            const [slots, total] = await this.prisma.$transaction([
                this.prisma.slot.findMany({
                    where: {
                        OR: [
                            { ownerId: userId },
                            { exchangeUserId: userId },
                        ],
                        ...(status && { status }),
                    },
                    include: {
                        slotRatings: true,
                        owner: true,
                        exchangeUser: true,
                        provideLanguage: true,
                        exchangeLanguage: true
                    },
                    orderBy: {
                        startTime: order ?? 'asc',
                    },
                    skip,
                    take: limit,
                }),
                this.prisma.slot.count({
                    where: {
                        OR: [
                            { ownerId: userId },
                            { exchangeUserId: userId },
                        ],
                        ...(status && { status }),
                    },
                }),
            ]);
            return paginate(slots, total, page, limit)
        } catch {

            throw new InternalServerErrorException({
                message: 'Failed to find all of the user slots',
                code: INTERNAL_SERVER_ERROR,
            });
        }

    }
    async getDbNow(): Promise<Date> {
        const result = await this.prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`;
        return result[0].now;
    }

    async createSlot(body: SlotCreationDto) {
        try {
            const overlappedSlot = await this.prisma.slot.findFirst({
                where: {
                    OR: [
                        { ownerId: body.ownerId },
                        { exchangeUserId: body.ownerId }
                    ],
                    status: { not: SlotStatus.CANCELLED },
                    startTime: { lt: body.endTime },
                    endTime: { gt: body.startTime }
                }
            });

            if (overlappedSlot) {
                throw new BadRequestException({
                    message: 'Slot time overlaps with an existing slot',
                    code: SLOT_OVERLAP_ERROR,
                });
            }

            const slot = await this.prisma.slot.create({
                data: body
            })
            await this.scheduleTimeoutJob(slot.id, slot.endTime);

            return slot;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException({
                message: 'Failed to create a new slot',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }
    async scheduleTimeoutJob(slotId: string, endTime: Date) {
        const dbNow = await this.getDbNow();
        const delay = endTime.getTime() - dbNow.getTime();
        console.log(`${endTime.getTime()} - ${dbNow.getTime()} = ${delay}`)
        if (delay <= 0) {
            console.warn(`Slot ${slotId} have negative endtime, ignore`);
            return;
        }
        console.log('Send to bullMQ')
        await this.timeoutQueue.add(
            'end-meeting',
            { slotId }, // roomName = slotId, nên chỉ cần truyền slotId
            {
                delay,
                jobId: `timeout-${slotId}`,
                removeOnComplete: true,
                removeOnFail: 1000,
            },
        );

    }


    async deleteSlotById(body: SlotDeletionDto, userId: string) {
        try {
            const slot = await this.prisma.slot.delete({
                where: { id: body.id, ownerId: userId, status: SlotStatus.OPEN }
            })
            await this.timeoutQueue.remove(`timeout-${body.id}`);

            return slot;
        } catch {
            throw new InternalServerErrorException({
                message: 'Failed to delete the slot',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }

    async isSlotParticipatedByUser(slotId: string, userId: string, status: SlotStatus) {
        try {
            const slot = await this.prisma.slot.findFirst({
                where: {
                    id: slotId,
                    OR: [
                        { ownerId: userId },
                        { exchangeUserId: userId }
                    ],
                    status
                }
            })
            return slot;
        } catch {
            throw new InternalServerErrorException({
                message: 'Failed to check if the slot is participated by the user',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }

    async getSingleSlotBySlotAndUserId(slotId: string, userId: string) {
        try {
            const slot = await this.prisma.slot.findFirst({
                where: {
                    id: slotId,
                    OR: [
                        { ownerId: userId },
                        { exchangeUserId: userId }
                    ],
                    status: SlotStatus.BOOKED
                },
                include: {
                    exchangeLanguage: true,
                    provideLanguage: true
                }
            })
            return slot;
        } catch {
            throw new InternalServerErrorException({
                message: 'Failed to check if the slot is participated by the user',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }

    async updateSlotStatus(slotId: string, status: SlotStatus) {
        try {
            if (status == SlotStatus.CANCELLED || status == SlotStatus.COMPLETED) {
                await this.timeoutQueue.remove(`timeout-${slotId}`);
            }
            const slot = await this.prisma.slot.update({
                where: { id: slotId },
                data: { status }
            })

            return slot;
        } catch {
            throw new InternalServerErrorException({
                message: 'Failed to update the slot status',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }

    async updateSlotExchangeUser(body: SlotExchangeUpdationDto) {
        const userLanguages = await this.userLanguageService.getUserAdvancedLevelLanguage(body.exchangeUserId)
        try {

            const userLanguagesIds = userLanguages.map((lang) => lang.languageId)
            const slot = await this.prisma.slot.update({
                where: {
                    id: body.slotId,
                    status: 'OPEN',
                    ownerId: { not: body.exchangeUserId },
                    exchangeLanguageId: { in: userLanguagesIds }
                },
                include: {
                    provideLanguage: true,
                    exchangeLanguage: true,
                    owner: true,
                    exchangeUser: true,
                },
                data: { status: SlotStatus.BOOKED, exchangeUserId: body.exchangeUserId }
            })
            return slot
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException({
                        message: 'Slot is unavailable or you are not allowed to book this slot',
                        code: NOT_EXISTED_SLOT_ERROR,
                    });
                }
            }
            throw new InternalServerErrorException({
                message: 'Fail to book user slot',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }


    async checkSlotStatus(slotId: string, status: SlotStatus) {
        try {
            const result = await this.prisma.slot.findUnique({
                where: { id: slotId, status: status }
            })
            return !!result;
        } catch {
            throw new InternalServerErrorException({
                message: 'Fail to find slot with status',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }
    async forceEndMeeting(roomName: string) {
        try {
            await this.roomService.deleteRoom(roomName);
            await this.timeoutQueue.remove(`timeout-${roomName}`);

        } catch (err: any) {
            const isRoomNotFound = err?.code === 'not_found' || err?.status === 404;
            const isRoomCompleted = await this.checkSlotStatus(roomName, SlotStatus.COMPLETED);
            if (!isRoomCompleted) {
                if (isRoomNotFound) {
                    console.warn(`Room ${roomName} was never opened, closing slot directly`);
                    await this.updateSlotStatus(roomName, SlotStatus.CANCELLED);
                } else {
                    console.error(`Failed to delete room ${roomName}: ${err?.message}`);
                    throw err;
                }
            }
            console.warn(`Room ${roomName} already closed: ${err instanceof Error && err.message}`);
        }
    }
    async recoverPendingTimeouts() {
        const activeSlots = await this.prisma.slot.findMany({
            where: { status: SlotStatus.OPEN }, // tùy enum SlotStatus của bạn
        });

        for (const slot of activeSlots) {
            await this.scheduleTimeoutJob(slot.id, slot.endTime);
        }

        console.log(`Recovered ${activeSlots.length} pending timeout jobs`);
    }
}