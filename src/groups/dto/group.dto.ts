import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const GroupCreationSchema = z.object({
  groupName: z.string(),
  shortDescription: z.string(),
  userId: z.uuid(),
  eventId: z.uuid(),
  memberEmails: z.array(z.email()),
  challengesId: z.array(z.uuid()),
});

export class GroupCreationDto extends createZodDto(GroupCreationSchema) {}
