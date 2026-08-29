import { createZodDto } from "nestjs-zod";
import z from "zod";

export const UpdateUserRoleSchema = z.object({
    userId: z.string().uuid({ message: "Invalid user ID" }),
    role: z.enum(["USER", "ADMIN"], { message: "Invalid user role" }),
});

export class UpdateUserRoleDto extends createZodDto(UpdateUserRoleSchema) { }
