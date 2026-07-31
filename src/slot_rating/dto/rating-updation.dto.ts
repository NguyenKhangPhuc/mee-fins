import { createZodDto } from "nestjs-zod";
import z from "zod";

export const RatingUpdationSchema = z.object({
    id: z.uuid({ message: "Invalid rating id" }),
    slotId: z.uuid({ message: "Invalid slot id" }),
    raterId: z.uuid({ message: "Invalid user id" }),
    ratedUserId: z.uuid({ message: "Invalid rated user id" }),
    rating: z.number().int({ message: "Invalid rating 1-5" }).min(1, { message: "Min rating is 1" }).max(5, { message: "Max rating is 5" }),
    feedback: z.string({ message: "Feed back is required" })
})

export class RatingUpdationDto extends createZodDto(RatingUpdationSchema) { }