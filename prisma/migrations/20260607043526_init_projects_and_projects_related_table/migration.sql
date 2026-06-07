-- CreateEnum
CREATE TYPE "PROJECT_STATUS" AS ENUM ('pending', 'rejected', 'accepted');

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "project_title" TEXT NOT NULL,
    "github_link" TEXT NOT NULL,
    "project_status" "PROJECT_STATUS" NOT NULL,
    "short_description" TEXT NOT NULL,
    "youtube_link" TEXT,
    "group_challenge_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_awards" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "award_id" TEXT NOT NULL,

    CONSTRAINT "project_awards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_files" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "storage_path" TEXT NOT NULL,
    "original_file_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "group_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_group_challenge_id_fkey" FOREIGN KEY ("group_challenge_id") REFERENCES "group_challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_awards" ADD CONSTRAINT "project_awards_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_awards" ADD CONSTRAINT "project_awards_award_id_fkey" FOREIGN KEY ("award_id") REFERENCES "event_awards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_files" ADD CONSTRAINT "project_files_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_files" ADD CONSTRAINT "project_files_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
