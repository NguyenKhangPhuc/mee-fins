import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const EventChallengeUpdationSchema = z.object({
  id: z.string(),
  title: z.string(),
  companyName: z.string(),
});

export class EventChallengeUpdationDto extends createZodDto(
  EventChallengeUpdationSchema,
) {}
