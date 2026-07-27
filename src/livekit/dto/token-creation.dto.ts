import { createZodDto } from "nestjs-zod";
import z from "zod";

export const TokenCreationSchema = z.object({
    roomId: z.uuid({ message: 'Room ID must be a valid UUID' }),
    slotId: z.uuid({ message: 'Slot ID must be a valid UUID' }),
})

export class TokenCreationDto extends createZodDto(TokenCreationSchema) { }