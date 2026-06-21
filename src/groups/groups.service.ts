import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupQueryDto } from './dto/groups-query.dto';
import { QueryService } from 'src/query/query.service';
import { Prisma } from 'src/generated/prisma/client';
import {
  DUPLICATE_GROUP_ERROR,
  EXISTED_GROUP_ERROR,
  INTERNAL_SERVER_ERROR,
  INVALID_INCLUDE_ERROR,
  NOT_EXISTED_GROUP_ERROR,
  NOT_EXISTED_USER_ERROR,
} from 'src/constants/error-code';
import { GroupCreationDto } from './dto/group.dto';
import { GroupChallengesService } from 'src/group_challenges/group_challenges.service';
import { GroupMembersService } from 'src/group_members/group_members.service';
import { InvitationsService } from 'src/invitations/invitations.service';
import { FileService } from 'src/file/file.service';

@Injectable()
export class GroupsService {
  constructor(
    private prismaService: PrismaService,
    private queryService: QueryService,
    private groupChallengesService: GroupChallengesService,
    private groupMembersService: GroupMembersService,
    private invitationsService: InvitationsService,
    private fileService: FileService,
  ) {}

  async getSingleGroup(query: GroupQueryDto) {
    try {
      const result = await this.prismaService.group.findFirst({
        where: {
          ...(query.id && { id: query.id }),
          ...(query.eventId && { eventId: query.eventId }),
        },
        include: this.queryService.buildInclude(query.includes),
      });

      if (!result) {
        throw new NotFoundException({
          message: 'Group not found',
          code: NOT_EXISTED_GROUP_ERROR,
        });
      }

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException({
          message: 'Invalid include relation',
          code: INVALID_INCLUDE_ERROR,
        });
      }
      throw new InternalServerErrorException({
        message: 'Failed to get group',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }

  async getGroups(query: GroupQueryDto) {
    try {
      const result = await this.prismaService.group.findMany({
        where: {
          ...(query.id && { id: query.id }),
          ...(query.eventId && { eventId: query.eventId }),
        },
        include: this.queryService.buildInclude(query.includes),
      });
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException({
          message: 'Invalid include relation',
          code: INVALID_INCLUDE_ERROR,
        });
      }
      throw new InternalServerErrorException({
        message: 'Fail to get the group',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateSingleGroup({
    query,
    body,
  }: {
    query: GroupQueryDto;
    body: Prisma.GroupUpdateInput;
  }) {
    try {
      const result = await this.prismaService.group.update({
        where: {
          id: query.id,
          ...(query.eventId && { eventId: query.eventId }),
        },
        data: body,
        include: this.queryService.buildInclude(query.includes),
      });
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException({
            message: 'Group not found',
            code: NOT_EXISTED_GROUP_ERROR,
          });
        }
        if (error.code === 'P2002') {
          throw new ConflictException({
            message: 'Group already exists',
            code: DUPLICATE_GROUP_ERROR,
          });
        }
      }
      if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Invalid include relation');
      }
      throw new InternalServerErrorException('Failed to update group');
    }
  }

  async createGroup({
    tx,
    groupInfo,
  }: {
    tx: Prisma.TransactionClient;
    groupInfo: Prisma.GroupUncheckedCreateInput;
  }) {
    const result = await tx.group.create({ data: groupInfo });
    return result;
  }

  async createGroupMemberAndChallengeTransaction(body: GroupCreationDto) {
    try {
      await this.prismaService.$transaction(async (tx) => {
        const createdGroup = await this.createGroup({ tx, groupInfo: body });
        const groupChallenges: Prisma.GroupChallengeCreateManyInput[] =
          body.challengesId.map((challengeId) => {
            return { groupId: createdGroup.id, challengeId };
          });

        await this.groupChallengesService.createManyGroupChallenges({
          tx,
          groupChallenges,
        });
        const groupMember: Prisma.GroupMemberUncheckedCreateInput = {
          memberId: body.userId,
          groupId: createdGroup.id,
        };
        await this.groupMembersService.createGroupMember({
          tx,
          groupMember,
        });
        const invitations: Prisma.InvitationCreateManyInput[] =
          body.memberEmails.map((memberEmail) => {
            return {
              memberEmail,
              groupId: createdGroup.id,
            };
          });
        await this.invitationsService.createManyInvitations({
          tx,
          invitations,
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException({
            message: 'Group name already exists in this event',
            code: EXISTED_GROUP_ERROR,
          });
        }
        if (error.code === 'P2003') {
          throw new BadRequestException({
            message: 'One or more member emails not found',
            code: NOT_EXISTED_USER_ERROR,
          });
        }
      }
      throw new InternalServerErrorException({
        message: 'Failed to create group',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }
  async updateGroupPoster({
    poster,
    groupId,
    oldPosterKey,
  }: {
    poster: Express.Multer.File | undefined;
    oldPosterKey: string;
    groupId: string;
  }) {
    await this.fileService.deleteFile(oldPosterKey);
    if (!poster) {
      try {
        await this.prismaService.group.update({
          data: { posterKey: null, posterPath: null },
          where: { id: groupId },
        });
        return { success: true };
      } catch (error) {
        if (error instanceof InternalServerErrorException) {
          throw error;
        }
        throw new InternalServerErrorException({
          message: 'Fail to update group poster',
          code: INTERNAL_SERVER_ERROR,
        });
      }
    } else {
      const result = await this.fileService.uploadFile(poster, groupId);
      try {
        await this.prismaService.group.update({
          data: { posterKey: result.key, posterPath: result.publicUrl },
          where: { id: groupId },
        });
        return { success: true };
      } catch {
        await this.fileService.deleteFile(result.key);
        throw new InternalServerErrorException({
          message: 'Fail to update group poster',
          code: INTERNAL_SERVER_ERROR,
        });
      }
    }
  }
}
