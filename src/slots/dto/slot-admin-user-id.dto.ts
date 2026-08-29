import { createZodDto } from "nestjs-zod";
import z from "zod";

export const SlotAdminUserIdSchema = z.object({
    userId: z.string().uuid({ message: "Invalid user ID" }),
});

export class SlotAdminUserIdDto extends createZodDto(SlotAdminUserIdSchema) { }
