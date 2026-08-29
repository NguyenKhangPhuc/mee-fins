import { Body, Controller, Delete, Get, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { SlotRatingService } from './slot_rating.service';
import { SlotsService } from 'src/slots/slots.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtAdminAuthGuard } from 'src/auth/guards/jwt-admin-auth.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { SafeUser } from 'src/types/safe-user';
import { RatingCreationDto } from './dto/rating-creation.dto';
import { SLOT_NOT_PARTICIPATED_ERROR } from 'src/constants/error-code';
import { RatingDeletionDto } from './dto/rating-deletion.dto';
import { RatingUpdationDto } from './dto/rating-updation.dto';
import { SlotStatus } from 'src/generated/prisma/enums';

@Controller('slot-rating')
export class SlotRatingController {
    constructor(private readonly ratingService: SlotRatingService, private readonly slotService: SlotsService) { }

    @Get('rater')
    @UseGuards(JwtAuthGuard)
    async getUserGivenRatings(@CurrentUser() user: SafeUser) {
        const result = await this.ratingService.getUserGivenRatingsByUserId(user.id)
        return result;
    }


    @Post('rated')
    @UseGuards(JwtAuthGuard)
    async getUserReceivedRatings(@CurrentUser() user: SafeUser) {
        const result = await this.ratingService.getUserReceivedRatingsByUserId(user.id)
        return result;
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createSlotRating(@CurrentUser() user: SafeUser, @Body() body: RatingCreationDto) {
        const isOwned = await this.slotService.isSlotParticipatedByUser(body.slotId, user.id, SlotStatus.COMPLETED)
        if (!isOwned) {
            throw new UnauthorizedException({ message: "You are not allowed to do this", code: SLOT_NOT_PARTICIPATED_ERROR })
        }
        const result = await this.ratingService.createSlotRating(body)
        return result;
    }

    @Post('update')
    @UseGuards(JwtAuthGuard)
    async updateRating(@CurrentUser() user: SafeUser, @Body() body: RatingUpdationDto) {
        const isOwned = await this.slotService.isSlotParticipatedByUser(body.slotId, user.id, SlotStatus.COMPLETED)
        if (!isOwned) {
            throw new UnauthorizedException({ message: "You are not allowed to do this", code: SLOT_NOT_PARTICIPATED_ERROR })
        }
        const result = await this.ratingService.updateSlotRating(body)
        return result;
    }

    @Delete('delete')
    @UseGuards(JwtAuthGuard)
    async deleteSlotRating(@CurrentUser() user: SafeUser, @Body() body: RatingDeletionDto) {
        const isOwned = await this.slotService.isSlotParticipatedByUser(body.slotId, user.id, SlotStatus.COMPLETED)
        if (!isOwned) {
            throw new UnauthorizedException({ message: "You are not allowed to do this", code: SLOT_NOT_PARTICIPATED_ERROR })
        }

        const result = await this.ratingService.deleteSlotRating(body.id, user.id)
        return result
    }

    @Post('admin/delete')
    @UseGuards(JwtAdminAuthGuard)
    async deleteRatingByIdAdmin(@Body() body: RatingDeletionDto) {
        return this.ratingService.deleteRatingByIdAdmin(body.id);
    }
}
