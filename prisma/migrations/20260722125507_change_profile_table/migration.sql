/*
  Warnings:

  - You are about to drop the column `company_unit` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `github` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `job_title` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "company_unit",
DROP COLUMN "github",
DROP COLUMN "job_title",
DROP COLUMN "role",
DROP COLUMN "year",
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "instagram" TEXT;
