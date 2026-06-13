import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const SignUpSchema = z.object({
  displayName: z.string().min(2).max(35),
  email: z.email(),
  password: z.string().min(8).max(100),
});

export class SignUpDto extends createZodDto(SignUpSchema) {}
