import { createZodDto } from "nestjs-zod";
import z from "zod";

export const UserLanguagesUserIdSchema = z.object({
    userId: z.uuid({ message: 'Invalid user ID' }),
});

export class UserLanguagesUserIdDto extends createZodDto(UserLanguagesUserIdSchema) { }