import { createZodDto } from 'nestjs-zod';
import { FileSchema } from 'src/file/dto/file.dto';
import z from 'zod';

export const SubmissionCreationSchema = z.object({
  submission: z.object({
    title: z.string(),
    githubLink: z.string(),
    youtubeLink: z.string().optional(),
    shortDescription: z.string(),
    description: z.string(),
    groupId: z.uuid(),
    groupChallengeId: z.uuid(),
  }),
  submissionFiles: z.array(FileSchema).optional(),
  funFacts: z.array(z.object({ fact: z.string() })),
});

export class SubmissionCreationDto extends createZodDto(
  SubmissionCreationSchema,
) {}
