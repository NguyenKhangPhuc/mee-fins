/*
  Warnings:

  - The `programme` column on the `profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `university` column on the `profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `degree` column on the `profiles` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "programme",
ADD COLUMN     "programme" TEXT,
DROP COLUMN "university",
ADD COLUMN     "university" TEXT,
DROP COLUMN "degree",
ADD COLUMN     "degree" TEXT;
