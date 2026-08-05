/*
  Warnings:

  - The `proficiency` column on the `user_languages` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PROFICIENCY" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- AlterTable
ALTER TABLE "user_languages" DROP COLUMN "proficiency",
ADD COLUMN     "proficiency" "PROFICIENCY" NOT NULL DEFAULT 'ADVANCED';
