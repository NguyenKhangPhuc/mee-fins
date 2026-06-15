import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const GroupUpdationSchema = z.object({
  groupName: z.string().optional(),
  shortDescription: z.string().optional(),
  posterPath: z.string().optional(),
});

export class GroupUpdationDto extends createZodDto(GroupUpdationSchema) {}
