import { createZodDto } from "nestjs-zod";
import z from "zod";

export const UserLanguagesCreationSchema = z.object({
    userId: z.string().uuid({ message: 'Invalid user ID' }),
    languageId: z.uuid({ message: 'Invalid language ID' }),
    proficiency: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], { message: 'Invalid proficiency level' }),
});

export class UserLanguagesCreationDto extends createZodDto(UserLanguagesCreationSchema) { }
