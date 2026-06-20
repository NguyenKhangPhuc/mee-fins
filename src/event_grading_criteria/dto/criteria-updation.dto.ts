import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const CriteriaUpdationSchema = z.object({
  id: z.string(),
  criteriaName: z.string(),
  criteraDescription: z.string(),
  percentage: z.number(),
  type: z.enum(['normal', 'specific']),
});

export class CriteriaUpdationDto extends createZodDto(CriteriaUpdationSchema) {}
