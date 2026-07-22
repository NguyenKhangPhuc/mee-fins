import { createZodDto } from "nestjs-zod";
import z from "zod";

export const LanguageCreationSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
});

export class LanguageCreationDto extends createZodDto(LanguageCreationSchema) { }