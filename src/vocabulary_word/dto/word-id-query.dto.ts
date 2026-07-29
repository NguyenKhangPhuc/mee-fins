import { createZodDto } from "nestjs-zod";
import z from "zod";

export const WordDeletionSchema = z.object({
    id: z.uuid({ message: "Invalid word id" }),
    collectionId: z.uuid({ message: "Invalid collection id" })
})

export class WordDeletionDto extends createZodDto(WordDeletionSchema) { }