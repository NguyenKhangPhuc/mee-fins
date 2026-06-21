/*
  Warnings:

  - Added the required column `key` to the `submission_files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "submission_files" ADD COLUMN     "key" TEXT NOT NULL;
