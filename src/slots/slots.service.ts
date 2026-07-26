import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { INTERNAL_SERVER_ERROR, NOT_EXISTED_SLOT_ERROR, NOT_EXISTED_USER_ERROR } from 'src/constants/error-code';
import { PrismaService } from 'src/prisma/prisma.service';
import { SlotCreationDto } from './dto/slot-creation.dto';
import { SlotDeletionDto } from './dto/slot-deletion.dto';
import { SlotStatus } from 'src/generated/prisma/enums';
import { SlotExchangeUpdationDto } from './dto/slot-exchange-updation.dto';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class SlotsService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllSlotsByUserId(userId: string) {
        try {
            const slots = await this.prisma.slot.findMany({
                where: {
                    OR: [
                        { ownerId: userId },
                        { exchangeUserId: userId }
                    ]
                },
                orderBy: {
                    startTime: 'asc'
                }
            })
            return slots;
        } catch {

            throw new InternalServerErrorException({
                message: 'Failed to find all of the user slots',
                code: INTERNAL_SERVER_ERROR,
            });
        }

    }

    async createSlot(body: SlotCreationDto) {
        try {
            const slot = await this.prisma.slot.create({
                data: body
            })
            return slot;
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException({
                message: 'Failed to create a new slot',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }

    async deleteSlotById(body: SlotDeletionDto) {
        try {
            const slot = await this.prisma.slot.delete({
                where: body
            })
            return slot;
        } catch {
            throw new InternalServerErrorException({
                message: 'Failed to delete the slot',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }

    async isSlotParticipatedByUser(slotId: string, userId: string): Promise<boolean> {
        try {
            const slot = await this.prisma.slot.findFirst({
                where: {
                    id: slotId,
                    OR: [
                        { ownerId: userId },
                        { exchangeUserId: userId }
                    ]
                }
            })
            return !!slot;
        } catch {
            throw new InternalServerErrorException({
                message: 'Failed to check if the slot is participated by the user',
                code: INTERNAL_SERVER_ERROR,
            });
        }
    }

    async updateSlotStatus(slotId: string, status: SlotStatus) {
        try {
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
        try {
            const slot = await this.prisma.slot.update({
                where: {
                    id: body.slotId,
                    status: 'OPEN',
                    ownerId: { not: body.exchangeUserId },
                },
                data: { status: SlotStatus.BOOKED, exchangeUserId: body.exchangeUserId }
            })
            return slot
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException({
                        message: 'Slot not found',
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
}