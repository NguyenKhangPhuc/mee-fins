import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  EXISTED_SESSION_ERROR,
  INTERNAL_SERVER_ERROR,
  NOT_EXISTED_SESSION_ERROR,
} from 'src/constants/error-code';
import { Prisma } from 'src/generated/prisma/client';
import { SessionWhereUniqueInput } from 'src/generated/prisma/models';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prismaService: PrismaService) {}

  async createSession(session: Prisma.SessionUncheckedCreateInput) {
    try {
      const result = await this.prismaService.session.create({
        data: session,
      });
      return result;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code == 'P2002'
      ) {
        throw new ConflictException({
          message: 'Session already exist',
          code: EXISTED_SESSION_ERROR,
        });
      }
      throw new InternalServerErrorException({
        message: 'Fail to create a session',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }

  async removeSession(sessionWhereUniqueInput: SessionWhereUniqueInput) {
    try {
      const result = await this.prismaService.session.delete({
        where: sessionWhereUniqueInput,
      });
      return result;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code == 'P2025'
      ) {
        throw new NotFoundException({
          message: 'Session not found',
          code: NOT_EXISTED_SESSION_ERROR,
        });
      }
      throw new InternalServerErrorException({
        message: 'Fail to find session',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }
}
