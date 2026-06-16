import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const GroupQuerySchema = z.object({
  id: z.uuid().optional(),
  eventId: z.string().optional(),
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

export class GroupQueryDto extends createZodDto(GroupQuerySchema) {}
