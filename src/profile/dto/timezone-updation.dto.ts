import { createZodDto } from "nestjs-zod";
import z from "zod";

export const TimeZoneUpdationSchema = z.object({
    id: z.string().uuid({ message: "Invalid profile ID" }),
    timezone: z
        .string()
        .refine(
            (tz) => {
                try {
                    Intl.DateTimeFormat(undefined, { timeZone: tz });
                    return true;
                } catch {
                    return false;
                }
            },
            { message: 'Invalid timezone' },
        ),
});

export class TimeZoneUpdationDto extends createZodDto(TimeZoneUpdationSchema) { }