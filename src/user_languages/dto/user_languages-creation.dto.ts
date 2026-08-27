import { createZodDto } from "nestjs-zod";
import z from "zod";

export const UserLanguagesCreationSchema = z.object({
    userId: z.string().uuid({ message: 'Invalid user ID' }),
    languageId: z.string().uuid({ message: 'Invalid language ID' }),
    proficiency: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], { message: 'Invalid proficiency level' }),
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
        .optional(),
});

export class UserLanguagesCreationDto extends createZodDto(UserLanguagesCreationSchema) { }
