import { createZodDto } from 'nestjs-zod';
import { AWARD_TYPE } from 'src/generated/prisma/enums';
import z from 'zod';

export const EventCreationSchema = z.object({
  event: z.object({
    title: z.string(),
    shortDescription: z.string(),
    content: z.string(),
    location: z.string(),
    maxGroupMembers: z.number(),
    startDate: z.date(),
    enđate: z.date(),
    organizedDate: z.date(),
  }),
  challenges: z.array(z.object({ title: z.string(), companyName: z.string() })),
  criteria: z.array(
    z.object({
      criteriaName: z.string(),
      criteriaDescription: z.string(),
      percentage: z.number(),
      type: z.enum(['normal', 'specific']),
    }),
  ),
  awards: z.array(
    z.object({
      awardType: z.enum(AWARD_TYPE),
      awardTitle: z.string(),
      awardPriority: z.number(),
    }),
  ),
});

export class EventCreationDto extends createZodDto(EventCreationSchema) {}
