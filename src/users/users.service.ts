import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  EXISTED_USER_ERROR,
  INTERNAL_SERVER_ERROR,
  NOT_EXISTED_USER_ERROR,
} from 'src/constants/error-code';
import { User, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    const result = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    if (result == null) {
      throw new NotFoundException({
        message: 'User not found',
        code: NOT_EXISTED_USER_ERROR,
      });
    }
    return result;
  }

  async createUser({ user }: { user: Prisma.UserUncheckedCreateInput }) {
    try {
      await this.prisma.user.create({ data: user });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException({
            message: 'User already exists',
            code: EXISTED_USER_ERROR,
          });
        }
      }
      throw new InternalServerErrorException({
        message: 'Failed to create user',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }
}
