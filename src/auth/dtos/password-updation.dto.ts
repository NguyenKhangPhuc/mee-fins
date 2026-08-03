import { createZodDto } from "nestjs-zod";
import z from "zod";

export const PasswordUpdationSchema = z.object({
    oldPassword: z.string().min(8).max(100),
    newPassword: z.string().min(8).max(100),
    email: z.email(),
    code: z
        .string()
        .length(8, { message: "Code must be exactly 8 number" })
        .regex(/^\d{8}$/, { message: "Code can only be number" }),
})

export class PasswordUpdationDto extends createZodDto(PasswordUpdationSchema) { }