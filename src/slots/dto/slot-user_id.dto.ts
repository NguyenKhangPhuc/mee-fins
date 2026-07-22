import { createZodDto } from "nestjs-zod";
import z from "zod";

export const SlotUserIdSchema = z.object({
    userId: z.string().uuid({ message: 'Invalid user ID' }),
});

export class SlotUserIdDto extends createZodDto(SlotUserIdSchema) { }