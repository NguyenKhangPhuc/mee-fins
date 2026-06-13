import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { SessionWhereUniqueInput } from 'src/generated/prisma/models';
import { NotFoundError } from 'rxjs';
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
        throw new ConflictException('Session already exist');
      }
      throw new InternalServerErrorException('Fail to create a session');
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
        throw new NotFoundError('Session not found');
      }
      throw new InternalServerErrorException('Fail to find session');
    }
  }
}
