import { createZodDto } from "nestjs-zod";
import z from "zod";

export const LanguageUpdationSchema = z.object({
    id: z.uuid({ message: "Invalid uuid" }),
    name: z.string().min(1, { message: 'Name is required' }),
    logoUrl: z.string().optional()
});

export class LanguageUpdationDto extends createZodDto(LanguageUpdationSchema) { }