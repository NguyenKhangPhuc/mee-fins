import { createZodDto } from "nestjs-zod";
import z from "zod";

export const CollectionCreationSchema = z.object({
    ownerId: z.uuid({ message: 'Invalid user ID' }),
    name: z.string({ message: "Collection name is required" }),
    languageId: z.uuid({ message: 'Invalid language ID' }),
    description: z.string({ message: "Collection description is required" })
})

export class CollectionCreationDto extends createZodDto(CollectionCreationSchema) { }