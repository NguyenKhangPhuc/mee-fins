import { createZodDto } from 'nestjs-zod';
import {
  DEGREE,
  PROGRAMME,
  UNIVERSITY,
  YEAR,
} from 'src/generated/prisma/enums';
import z from 'zod';

export const ProfileUpdationSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  programme: z.enum(PROGRAMME),
  university: z.enum(UNIVERSITY),
  degree: z.enum(DEGREE),
  facebook: z.string(),
  instagram: z.string(),
  linkedIn: z.string(),
  description: z.string(),
  age: z.number().int().positive(),
});

export class ProfileUpdationDto extends createZodDto(ProfileUpdationSchema) { }
