import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
      throw new NotFoundException('User not found');
    }
    return result;
  }

  async createUser({ user }: { user: Prisma.UserUncheckedCreateInput }) {
    try {
      await this.prisma.user.create({ data: user });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('User already exists');
        }
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }
}
