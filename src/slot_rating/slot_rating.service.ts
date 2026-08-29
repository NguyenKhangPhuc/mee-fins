import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RatingCreationDto } from './dto/rating-creation.dto';
import { INTERNAL_SERVER_ERROR, NOT_EXISTED_RATING_ERROR } from 'src/constants/error-code';
import { Prisma } from 'src/generated/prisma/client';
import { RatingUpdationDto } from './dto/rating-updation.dto';

@Injectable()
export class SlotRatingService {
    constructor(private readonly prismaService: PrismaService) { }

    async getUserReceivedRatingsByUserId(userId: string) {
        try {
            const result = await this.prismaService.slotRating.findMany({
                where: { ratedUserId: userId },
                include: {
                    slot: true,
                    rater: true,
                }
            })
        } catch {
            throw new InternalServerErrorException({ message: "Fail to get user received ratings" })
        }
    }

    async getUserGivenRatingsByUserId(userId: string) {
        try {
            const result = await this.prismaService.slotRating.findMany({
                where: { raterId: userId },
                include: {
                    slot: true,
                    ratedUser: true
                }
            })
        } catch {
            throw new InternalServerErrorException({ message: "Fail to get user given ratings" })

        }
    }

    async createSlotRating(rating: RatingCreationDto) {
        try {
            const result = await this.prismaService.slotRating.create({ data: rating })
            return result;
        } catch {
            throw new InternalServerErrorException({ message: "Fail to create new slot rating", code: INTERNAL_SERVER_ERROR })
        }
    }
    async deleteSlotRating(ratingId: string, userId: string) {
        try {
            const result = await this.prismaService.slotRating.delete({ where: { id: ratingId, raterId: userId } })
            return result;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code == 'P2025') {
                    throw new NotFoundException({ message: "Rating not found", code: NOT_EXISTED_RATING_ERROR })
                }
            }
            throw new InternalServerErrorException({ message: "Fail to delete the rating", code: INTERNAL_SERVER_ERROR })
        }
    }

    async updateSlotRating(rating: RatingUpdationDto) {
        try {
            const result = await this.prismaService.slotRating.update({ where: { id: rating.id }, data: rating })
            return result;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code == 'P2025') {
                    throw new NotFoundException({ message: "Rating not found", code: NOT_EXISTED_RATING_ERROR })
                }
            }
            throw new InternalServerErrorException({ message: "Fail to update the rating", code: INTERNAL_SERVER_ERROR })
        }
    }

    async deleteRatingByIdAdmin(ratingId: string) {
        try {
            const result = await this.prismaService.slotRating.delete({ where: { id: ratingId } });
            return result;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code == 'P2025') {
                    throw new NotFoundException({ message: "Rating not found", code: NOT_EXISTED_RATING_ERROR });
                }
            }
            throw new InternalServerErrorException({ message: "Fail to delete rating by admin", code: INTERNAL_SERVER_ERROR });
        }
    }
}
