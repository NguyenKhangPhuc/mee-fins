import { createZodDto } from "nestjs-zod";
import z from "zod";

export const RoomCloseSchema = z.object({
    slotId: z.uuid({ message: 'Slot ID must be a valid UUID' }),
});

export class RoomCloseDto extends createZodDto(RoomCloseSchema) { }