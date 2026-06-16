import { Injectable } from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class GroupMembersService {
  constructor() {}
  async createGroupMember({
    tx,
    groupMember,
  }: {
    tx: Prisma.TransactionClient;
    groupMember: Prisma.GroupMemberUncheckedCreateInput;
  }) {
    const result = await tx.groupMember.create({ data: groupMember });
    return result;
  }
}
