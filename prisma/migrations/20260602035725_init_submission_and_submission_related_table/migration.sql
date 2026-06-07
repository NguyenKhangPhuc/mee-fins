-- CreateEnum
CREATE TYPE "CRITERIA_TYPE" AS ENUM ('normal', 'specific');

-- CreateEnum
CREATE TYPE "AWARD_TYPE" AS ENUM ('general', 'specific', 'participant');

-- CreateTable
CREATE TABLE "event_awards" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "award_type" "AWARD_TYPE" NOT NULL DEFAULT 'participant',
    "award_title" TEXT NOT NULL,
    "award_priority" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_awards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_grading_criteria" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "type" "CRITERIA_TYPE" NOT NULL DEFAULT 'normal',
    "criteria_name" TEXT NOT NULL,
    "criteria_description" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_grading_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fun_facts" (
    "id" TEXT NOT NULL,
    "fact" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,

    CONSTRAINT "fun_facts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public" (
    "id" TEXT NOT NULL,
    "group_challenge_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "github_link" TEXT NOT NULL,
    "youtube_link" TEXT,
    "short_description" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "public_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_comments" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_feedbacks" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_files" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "storage_path" TEXT NOT NULL,
    "original_file_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_gradings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "event_criteria_id" TEXT NOT NULL,
    "grade" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_gradings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_ratings" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submission_reactions" (
    "id" TEXT NOT NULL,
    "submission_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submission_reactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event_awards" ADD CONSTRAINT "event_awards_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_grading_criteria" ADD CONSTRAINT "event_grading_criteria_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fun_facts" ADD CONSTRAINT "fun_facts_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "public"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public" ADD CONSTRAINT "public_group_challenge_id_fkey" FOREIGN KEY ("group_challenge_id") REFERENCES "group_challenges"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public" ADD CONSTRAINT "public_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_comments" ADD CONSTRAINT "submission_comments_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "public"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_comments" ADD CONSTRAINT "submission_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_feedbacks" ADD CONSTRAINT "submission_feedbacks_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "public"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_feedbacks" ADD CONSTRAINT "submission_feedbacks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_files" ADD CONSTRAINT "submission_files_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_files" ADD CONSTRAINT "submission_files_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "public"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_gradings" ADD CONSTRAINT "submission_gradings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_gradings" ADD CONSTRAINT "submission_gradings_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "public"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_gradings" ADD CONSTRAINT "submission_gradings_event_criteria_id_fkey" FOREIGN KEY ("event_criteria_id") REFERENCES "event_grading_criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_ratings" ADD CONSTRAINT "submission_ratings_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "public"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_ratings" ADD CONSTRAINT "submission_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_reactions" ADD CONSTRAINT "submission_reactions_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "public"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission_reactions" ADD CONSTRAINT "submission_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
