import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const FileSchema = z.custom<Express.Multer.File>();
export class FileDto extends createZodDto(FileSchema) {}
