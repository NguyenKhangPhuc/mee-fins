import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const ProfileRoleUpdation = z.object({
  id: z.string(),
});

export class ProfileRoleDto extends createZodDto(ProfileRoleUpdation) { }
