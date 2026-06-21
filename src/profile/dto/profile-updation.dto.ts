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
  companyName: z.string(),
  programme: z.enum(PROGRAMME),
  university: z.enum(UNIVERSITY),
  degree: z.enum(DEGREE),
  year: z.enum(YEAR),
  companyUnit: z.string(),
  jobTitle: z.string(),
  github: z.string(),
  linkedIn: z.string(),
  description: z.string(),
});

export class ProfileUpdationDto extends createZodDto(ProfileUpdationSchema) {}
