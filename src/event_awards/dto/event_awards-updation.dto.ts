import { createZodDto } from 'nestjs-zod';
import { AWARD_TYPE } from 'src/generated/prisma/enums';
import z from 'zod';

export const EventAwardUpdationSchema = z.object({
  id: z.string(),
  eventId: z.uuid(),
  awardType: z.enum(AWARD_TYPE),
  awardTitle: z.string(),
  awardPriority: z.number(),
});

export class EventAwardUpdationDto extends createZodDto(
  EventAwardUpdationSchema,
) {}
