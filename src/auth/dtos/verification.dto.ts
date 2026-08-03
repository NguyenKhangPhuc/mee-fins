import { createZodDto } from "nestjs-zod";
import z from "zod";

export const VerificationSchema = z.object({
    code: z
        .string()
        .length(8, { message: "Code must be exactly 8 number" })
        .regex(/^\d{8}$/, { message: "Code can only be number" }),
    to: z.email({ message: "To address must be email" })
})

export class VerificationDto extends createZodDto(VerificationSchema) { }