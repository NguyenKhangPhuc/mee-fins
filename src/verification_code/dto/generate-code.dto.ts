import { createZodDto } from "nestjs-zod";
import z from "zod";

export const GenerateCodeSchema = z.object({
    email: z.email({ message: "Must be email" })
})

export class GenerateCodeDto extends createZodDto(GenerateCodeSchema) { }