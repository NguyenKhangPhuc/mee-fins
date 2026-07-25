import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const ProfileUpdationSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  programme: z.string().optional(),
  university: z.string().optional(),
  degree: z.string().optional(),
  facebook: z.string(),
  instagram: z.string(),
  linkedIn: z.string(),
  description: z.string(),
  age: z.number().int().positive(),
});

export class ProfileUpdationDto extends createZodDto(ProfileUpdationSchema) { }
