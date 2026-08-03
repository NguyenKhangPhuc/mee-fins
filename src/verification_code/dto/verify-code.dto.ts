import { createZodDto } from "nestjs-zod";
import z from "zod";

export const VerifyCodeSchema = z.object({
    code: z
        .string()
        .length(8, { message: "Code must be exactly 8 number" })
        .regex(/^\d{8}$/, { message: "Code can only be number" }),
    email: z.email({ message: "Must be email" })
})

export class VerifyCodeDto extends createZodDto(VerifyCodeSchema) { }