import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class InvitationsService {
  constructor(private prismaService: PrismaService) {}

  async createManyInvitations({
    tx,
    invitations,
  }: {
    tx: Prisma.TransactionClient;
    invitations: Prisma.InvitationCreateManyInput[];
  }) {
    const result = await tx.invitation.createMany({ data: invitations });
    return result;
  }
}
