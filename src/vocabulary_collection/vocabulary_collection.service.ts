import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CollectionCreationDto } from './dto/collection-creation.dto';
import { INTERNAL_SERVER_ERROR, NOT_EXISTED_COLLECTION_ERROR, NOT_EXISTED_USER_ERROR } from 'src/constants/error-code';
import { CollectionUpdationDto } from './dto/collection-updation.dto';
import { Prisma } from 'src/generated/prisma/client';
import { CollectionIdQueryDto } from './dto/collection-deletion.dto';

@Injectable()
export class VocabularyCollectionService {
    constructor(private readonly prismaService: PrismaService) { }

    async createCollection(body: CollectionCreationDto) {
        try {
            const result = await this.prismaService.vocabularyCollection.create({
                data: body
            })

            return result
        } catch {
            throw new InternalServerErrorException({
                message: "Failed to create the collection", code: INTERNAL_SERVER_ERROR
            })
        }
    }

    async updateCollection(body: CollectionUpdationDto) {
        try {
            const result = await this.prismaService.vocabularyCollection.update({
                data: body,
                where: { id: body.id }
            })
            return result
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException({
                        message: 'Collection not found',
                        code: NOT_EXISTED_COLLECTION_ERROR,
                    });
                }
            }

            throw new InternalServerErrorException({ message: "Fail to update the collection", code: INTERNAL_SERVER_ERROR })
        }
    }

    async deleteCollectionById(body: CollectionIdQueryDto, userId: string) {
        try {
            const result = await this.prismaService.vocabularyCollection.delete({
                where: { id: body.id, ownerId: userId }
            })
            return result;
        } catch {
            throw new InternalServerErrorException({ message: "Fail to delete the collection", code: INTERNAL_SERVER_ERROR })

        }
    }

    async getSingleCollectionWithWords(body: CollectionIdQueryDto, userId: string) {
        try {
            const result = await this.prismaService.vocabularyCollection.findUnique({
                where: { id: body.id, ownerId: userId },
                include: { language: true }
            })
            return result
        } catch {
            throw new InternalServerErrorException({ message: "Fail to get single collection information" })
        }
    }
}
