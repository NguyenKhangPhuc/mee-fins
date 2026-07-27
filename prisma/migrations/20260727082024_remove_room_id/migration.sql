/*
  Warnings:

  - You are about to drop the column `roomId` on the `slots` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "slots_roomId_key";

-- AlterTable
ALTER TABLE "slots" DROP COLUMN "roomId";
