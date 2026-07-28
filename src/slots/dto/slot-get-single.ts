import { createZodDto } from "nestjs-zod";
import z from "zod";

export const SingleSlotSchema = z.object({
    slotId: z.uuid({ message: 'Invalid slot ID' }),
});

export class SingleSlotDto extends createZodDto(SingleSlotSchema) { }