import { createZodDto } from "nestjs-zod";
import z from "zod";

export const LanguageDeleteSchema = z.object({
    id: z.uuid()
});

export class LanguageDeleteDto extends createZodDto(LanguageDeleteSchema) { }