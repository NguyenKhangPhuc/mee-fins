/*
  Warnings:

  - You are about to drop the `event_awards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event_challenges` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event_grading_criteria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fun_facts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `group_challenges` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `group_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invitations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_awards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_files` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `public` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `submission_comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `submission_feedbacks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `submission_files` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `submission_gradings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `submission_ratings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `submission_reactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "event_awards" DROP CONSTRAINT "event_awards_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_challenges" DROP CONSTRAINT "event_challenges_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_grading_criteria" DROP CONSTRAINT "event_grading_criteria_event_id_fkey";

-- DropForeignKey
ALTER TABLE "fun_facts" DROP CONSTRAINT "fun_facts_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "group_challenges" DROP CONSTRAINT "group_challenges_challenge_id_fkey";

-- DropForeignKey
ALTER TABLE "group_challenges" DROP CONSTRAINT "group_challenges_group_id_fkey";

-- DropForeignKey
ALTER TABLE "group_members" DROP CONSTRAINT "group_members_group_id_fkey";

-- DropForeignKey
ALTER TABLE "group_members" DROP CONSTRAINT "group_members_member_id_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_event_id_fkey";

-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_group_id_fkey";

-- DropForeignKey
ALTER TABLE "invitations" DROP CONSTRAINT "invitations_member_email_fkey";

-- DropForeignKey
ALTER TABLE "project_awards" DROP CONSTRAINT "project_awards_award_id_fkey";

-- DropForeignKey
ALTER TABLE "project_awards" DROP CONSTRAINT "project_awards_project_id_fkey";

-- DropForeignKey
ALTER TABLE "project_files" DROP CONSTRAINT "project_files_group_id_fkey";

-- DropForeignKey
ALTER TABLE "project_files" DROP CONSTRAINT "project_files_project_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_group_challenge_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_group_id_fkey";

-- DropForeignKey
ALTER TABLE "public" DROP CONSTRAINT "public_group_challenge_id_fkey";

-- DropForeignKey
ALTER TABLE "public" DROP CONSTRAINT "public_group_id_fkey";

-- DropForeignKey
ALTER TABLE "submission_comments" DROP CONSTRAINT "submission_comments_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "submission_comments" DROP CONSTRAINT "submission_comments_user_id_fkey";

-- DropForeignKey
ALTER TABLE "submission_feedbacks" DROP CONSTRAINT "submission_feedbacks_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "submission_feedbacks" DROP CONSTRAINT "submission_feedbacks_user_id_fkey";

-- DropForeignKey
ALTER TABLE "submission_files" DROP CONSTRAINT "submission_files_group_id_fkey";

-- DropForeignKey
ALTER TABLE "submission_files" DROP CONSTRAINT "submission_files_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "submission_gradings" DROP CONSTRAINT "submission_gradings_event_criteria_id_fkey";

-- DropForeignKey
ALTER TABLE "submission_gradings" DROP CONSTRAINT "submission_gradings_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "submission_gradings" DROP CONSTRAINT "submission_gradings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "submission_ratings" DROP CONSTRAINT "submission_ratings_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "submission_ratings" DROP CONSTRAINT "submission_ratings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "submission_reactions" DROP CONSTRAINT "submission_reactions_submission_id_fkey";

-- DropForeignKey
ALTER TABLE "submission_reactions" DROP CONSTRAINT "submission_reactions_user_id_fkey";

-- DropTable
DROP TABLE "event_awards";

-- DropTable
DROP TABLE "event_challenges";

-- DropTable
DROP TABLE "event_grading_criteria";

-- DropTable
DROP TABLE "events";

-- DropTable
DROP TABLE "fun_facts";

-- DropTable
DROP TABLE "group_challenges";

-- DropTable
DROP TABLE "group_members";

-- DropTable
DROP TABLE "groups";

-- DropTable
DROP TABLE "invitations";

-- DropTable
DROP TABLE "project_awards";

-- DropTable
DROP TABLE "project_files";

-- DropTable
DROP TABLE "projects";

-- DropTable
DROP TABLE "public";

-- DropTable
DROP TABLE "submission_comments";

-- DropTable
DROP TABLE "submission_feedbacks";

-- DropTable
DROP TABLE "submission_files";

-- DropTable
DROP TABLE "submission_gradings";

-- DropTable
DROP TABLE "submission_ratings";

-- DropTable
DROP TABLE "submission_reactions";
