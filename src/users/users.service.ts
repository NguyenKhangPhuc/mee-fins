import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  EXISTED_USER_ERROR,
  INTERNAL_SERVER_ERROR,
  NOT_EXISTED_USER_ERROR,
  USER_NOT_ADMIN,
} from 'src/constants/error-code';
import { User, Prisma, USER_ROLE } from 'src/generated/prisma/client';
import { generateCode } from 'src/helpers/email/generate-code';
import { paginate } from 'src/helpers/pagination/parseing-pagination-result';
import { getPaginationParams } from 'src/helpers/pagination/parsing-pagination-query';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfileService } from 'src/profile/profile.service';
import { SafeUser } from 'src/types/safe-user';
import { VerificationCodeService } from 'src/verification_code/verification_code.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private profileService: ProfileService,
  ) { }
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

  async findOneWithAdminRole(userId: string) {
    try {
      const result = await this.prisma.user.findUnique({ where: { id: userId, role: USER_ROLE.ADMIN } })
      return result;
    } catch {
      throw new UnauthorizedException({ message: "User not admin", code: USER_NOT_ADMIN })
    }
  }

  async createUser({ user, timezone }: { user: Prisma.UserUncheckedCreateInput, timezone: string }) {
    try {
      const { verificationCode } = await this.prisma.$transaction(async (tx) => {
        const createdUser = await tx.user.create({ data: user });
        const profile: Prisma.ProfileUncheckedCreateInput = {
          id: createdUser.id,
          fullName: user.displayName,
          email: user.email,
          timezone,
        };
        await this.profileService.createProfile({ tx, profile });
        const code: Prisma.VerificationCodeUncheckedCreateInput = {
          code: generateCode(),
          userId: createdUser.id,
          expiredAt: new Date(Date.now() + 1 * 60 * 1000),
          isVerified: false,
        }
        const verificationCode = await tx.verificationCode.create({ data: code })
        return { verificationCode }
      });
      return verificationCode
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
      const result = await this.prisma.$transaction(async (tx) => {
        const createdUser = await tx.user.create({
          data: {
            email,
            displayName,
            confirmationAt: new Date(),
          }
        });
        const { passwordHash: _passwordHash, ...result } = createdUser;
        const profile: Prisma.ProfileUncheckedCreateInput = {
          id: createdUser.id,
          fullName: createdUser.displayName,
          email: createdUser.email,
        };
        await this.profileService.createProfile({ tx, profile });
        return result;
      });
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

  async updatePassword(email: string, newPassword: string) {
    try {
      await this.prisma.user.update({ where: { email }, data: { passwordHash: newPassword } })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code == 'P2025') {
          throw new NotFoundException({ message: "User not found", code: NOT_EXISTED_USER_ERROR })
        }
      }
      throw new InternalServerErrorException({ message: "Failed to update user password", code: INTERNAL_SERVER_ERROR })
    }
  }

  async getAllUsers(query: any) {

    const { page, limit, skip } = getPaginationParams(query);

    try {
      const [users, total] = await this.prisma.$transaction([
        this.prisma.user.findMany({
          include: {
            profile: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        this.prisma.user.count(),
      ]);

      const safeUsers = users.map((u) => {
        const { passwordHash: _passwordHash, ...safeUser } = u;
        return safeUser;
      });

      return paginate(safeUsers, total, page, limit);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Failed to fetch users',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }

  async updateRoleByUserId(dto: { userId: string; role: USER_ROLE }) {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: dto.userId },
        data: { role: dto.role },
        include: {
          profile: true,
        },
      });
      const { passwordHash: _passwordHash, ...safeUser } = updatedUser;
      return safeUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException({
          message: 'User not found',
          code: NOT_EXISTED_USER_ERROR,
        });
      }
      throw new InternalServerErrorException({
        message: 'Failed to update user role',
        code: INTERNAL_SERVER_ERROR,
      });
    }
  }
}
