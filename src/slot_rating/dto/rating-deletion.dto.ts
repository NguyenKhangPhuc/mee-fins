import { createZodDto } from "nestjs-zod";
import z from "zod";

export const RatingDeletionSchema = z.object({
    id: z.uuid({ message: "Invalid rating id" }),
    slotId: z.uuid({ message: "Invalid slot id" })
})

export class RatingDeletionDto extends createZodDto(RatingDeletionSchema) { }