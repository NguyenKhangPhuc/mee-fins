import { createZodDto } from "nestjs-zod";
import z from "zod";

export const WordCreationSchema = z.object({
    collectionId: z.uuid({ message: "Invalid collection id" }),
    slotId: z.uuid().optional(),
    term: z.string({ message: "Term is required" }),
    meaning: z.string({ message: "Meaning is required" }),
    example: z.string().optional(),
    note: z.string().optional(),
})

export class WordCreationDto extends createZodDto(WordCreationSchema) { }