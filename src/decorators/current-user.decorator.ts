import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/generated/prisma/client';
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (request.user) {
      // Bóc tách password ra ngoài, phần còn lại gom vào userWithoutPassword
      const user = request.user as User;
      const { passwordHash, ...userWithoutPassword } = user;

      // Trả về object user đã bỏ password
      return userWithoutPassword;
    }
    return
  },
);
