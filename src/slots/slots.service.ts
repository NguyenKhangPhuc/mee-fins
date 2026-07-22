import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { INTERNAL_SERVER_ERROR } from 'src/constants/error-code';
import { PrismaService } from 'src/prisma/prisma.service';
import { SlotCreationDto } from './dto/slot-creation.dto';
import { SlotDeletionDto } from './dto/slot-deletion.dto';

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
        } catch {
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
}