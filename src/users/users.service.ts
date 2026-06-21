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
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private profileService: ProfileService,
  ) {}
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
      await this.prisma.$transaction(async (tx) => {
        const createdUser = await tx.user.create({ data: user });
        const profile: Prisma.ProfileUncheckedCreateInput = {
          id: createdUser.id,
          fullName: user.displayName,
          email: user.email,
        };
        await this.profileService.createProfile({ tx, profile });
      });
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

  async handleOauthLogin({
    email,
    displayName,
  }: {
    email: string;
    displayName: string | undefined;
  }) {
    const foundUser = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (foundUser) {
      const { passwordHash: _passwordHash, ...result } = foundUser;
      return result;
    }
    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          displayName,
          confirmationAt: new Date(),
        },
      });
      const { passwordHash: _passwordHash, ...result } = user;
      return result;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        const user = await this.prisma.user.findUniqueOrThrow({
          where: { email },
        });
        const { passwordHash: _passwordHash, ...result } = user;
        return result;
      }
      throw new InternalServerErrorException({
        message: 'Failed to create user',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }
}
