import { createZodDto } from "nestjs-zod";
import z from "zod";

export const SlotDeletionSchema = z.object({
    id: z.uuid({ message: 'Invalid slot ID' }),
});

export class SlotDeletionDto extends createZodDto(SlotDeletionSchema) { }