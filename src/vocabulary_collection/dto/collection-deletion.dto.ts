import { createZodDto } from "nestjs-zod";
import z from "zod";

export const CollectionIdQuerySchema = z.object({
    id: z.uuid({ message: "Invalid collection id" })
})

export class CollectionIdQueryDto extends createZodDto(CollectionIdQuerySchema) { }