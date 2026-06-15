import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const EventQuerySchema = z.object({
  id: z.string().optional(),
  includes: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return val.split(',').every((part) => part.trim().length > 0);
      },
      { message: 'Invalid include format' },
    ),
});

export class EventQueryDto extends createZodDto(EventQuerySchema) {}
