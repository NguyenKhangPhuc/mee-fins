import { createZodDto } from "nestjs-zod";
import z from "zod";

export const userLanguagesDeleteSchema = z.object({
    userId: z.uuid({ message: 'Invalid user ID' }),
    languageId: z.uuid({ message: 'Invalid language ID' }),
});

export class UserLanguagesDeleteDto extends createZodDto(userLanguagesDeleteSchema) { }