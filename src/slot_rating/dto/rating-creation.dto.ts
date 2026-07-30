import { createZodDto } from "nestjs-zod";
import z from "zod";

export const RatingCreationSchema = z.object({
    slotId: z.uuid({ message: "Invalid slot id" }),
    raterId: z.uuid({ message: "Invalid user id" }),
    ratedUserId: z.uuid({ message: "Invalid rated user id" }),
    rating: z.number().int({ message: "Invalid rating 1-5" }).min(1, { message: "Min rating is 1" }).max(5, { message: "Max rating is 5" })
})

export class RatingCreationDto extends createZodDto(RatingCreationSchema) { }
