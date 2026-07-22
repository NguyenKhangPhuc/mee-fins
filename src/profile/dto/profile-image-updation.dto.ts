import { createZodDto } from "nestjs-zod";
import { FileSchema } from "src/file/dto/file.dto";
import z from "zod";

export const ProfileImageUpdationSchema = z.object({
    poster: FileSchema,
    oldPosterKey: z.string(),
});

export class ProfileImageUpdationDto extends createZodDto(ProfileImageUpdationSchema) { }