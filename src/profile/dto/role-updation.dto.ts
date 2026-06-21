import { createZodDto } from 'nestjs-zod';
import { PROFILE_ROLE } from 'src/generated/prisma/enums';
import z from 'zod';

export const ProfileRoleUpdation = z.object({
  role: z.enum(PROFILE_ROLE),
  id: z.string(),
});

export class ProfileRoleDto extends createZodDto(ProfileRoleUpdation) {}
