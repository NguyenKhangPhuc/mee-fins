import { createZodDto } from "nestjs-zod";
import z from "zod";

export const SlotCreationSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    ownerId: z.uuid({ message: 'Invalid owner ID' }),
    exchangeUserId: z.uuid({ message: 'Invalid exchange user ID' }).optional(),
    provideLanguageId: z.uuid({ message: 'Invalid provide language ID' }),
    exchangeLanguageId: z.uuid({ message: 'Invalid exchange language ID' }),
    startTime: z.coerce.date({ message: 'Start time is required' }),
    endTime: z.coerce.date({ message: 'End time is required' }),
    durationMinutes: z.number().int().positive({ message: 'Duration must be a positive integer' }).min(15, { message: 'Duration must be at least 1 minute' }).max(60, { message: 'Duration cannot exceed 60 minutes' }),
});

export class SlotCreationDto extends createZodDto(SlotCreationSchema) { }