import { createZodDto } from "nestjs-zod";
import { PaginationDto, PaginationSchema } from "src/helpers/pagination/dto/pagination.dto";
import z from "zod";

export const SlotPaginationSchema = PaginationSchema.extend({
    status: z.enum(['OPEN', 'BOOKED', 'COMPLETED', 'CANCELLED'], { message: 'Invalid status' }).optional(),
    order: z.enum(['asc', 'desc'], { message: 'Invalid order' }).optional(),
});

export class SlotPaginationDto extends createZodDto(SlotPaginationSchema) { }