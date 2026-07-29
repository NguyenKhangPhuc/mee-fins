import { createZodDto } from "nestjs-zod";
import z from "zod";

export const CollectionUpdationSchema = z.object({
    id: z.uuid({ message: "Invalid collection id" }),
    ownerId: z.uuid({ message: 'Invalid user ID' }),
    name: z.string({ message: "Collection name is required" }),
    languageId: z.uuid({ message: 'Invalid language ID' }),
    description: z.string({ message: "Collection description is required" })
})

export class CollectionUpdationDto extends createZodDto(CollectionUpdationSchema) { }