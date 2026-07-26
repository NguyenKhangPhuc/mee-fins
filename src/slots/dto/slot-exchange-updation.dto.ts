import { createZodDto } from "nestjs-zod";
import z from "zod";

export const SlotExchangeUpdationSchema = z.object({
    slotId: z.uuid(),
    exchangeUserId: z.uuid()
})

export class SlotExchangeUpdationDto extends createZodDto(SlotExchangeUpdationSchema) { }