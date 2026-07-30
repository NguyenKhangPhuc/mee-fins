import { createZodDto } from "nestjs-zod";
import z from "zod";

export const PaginationSchema = z.object({
    limit: z.coerce.number().int().min(1, { message: "Limit have to be bigger than 1" }).default(1),
    page: z.coerce.number().int().min(1, { message: "Page have to be bigger than 1" }).default(10),
})
export class PaginationDto extends createZodDto(PaginationSchema) { }