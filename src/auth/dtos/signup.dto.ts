import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const SignUpSchema = z.object({
  displayName: z.string().min(2).max(35),
  email: z.email(),
  password: z.string().min(8).max(100),
  timezone: z
    .string()
    .refine(
      (tz) => {
        try {
          Intl.DateTimeFormat(undefined, { timeZone: tz });
          return true;
        } catch {
          return false;
        }
      },
      { message: 'Invalid timezone' },
    )
});

export class SignUpDto extends createZodDto(SignUpSchema) { }
