/*
  Warnings:

  - You are about to drop the `Slot` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_exchangeLanguageId_fkey";

-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_exchangeUserId_fkey";

-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_provideLanguageId_fkey";

-- DropTable
DROP TABLE "Slot";

-- DropEnum
DROP TYPE "AWARD_TYPE";

-- DropEnum
DROP TYPE "CRITERIA_TYPE";

-- DropEnum
DROP TYPE "DEGREE";

-- DropEnum
DROP TYPE "EVENT_STATUS";

-- DropEnum
DROP TYPE "INVITATION_STATUS";

-- DropEnum
DROP TYPE "PROFILE_ROLE";

-- DropEnum
DROP TYPE "PROGRAMME";

-- DropEnum
DROP TYPE "PROJECT_STATUS";

-- DropEnum
DROP TYPE "UNIVERSITY";

-- DropEnum
DROP TYPE "YEAR";

-- CreateTable
CREATE TABLE "slots" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "status" "SlotStatus" NOT NULL DEFAULT 'OPEN',
    "provideLanguageId" TEXT NOT NULL,
    "exchangeLanguageId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "exchangeUserId" TEXT,
    "bookedAt" TIMESTAMP(3),
    "roomId" TEXT NOT NULL,
    "videoRecordUrl" TEXT,
    "videoExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "slots_roomId_key" ON "slots"("roomId");

-- CreateIndex
CREATE INDEX "slots_startTime_status_idx" ON "slots"("startTime", "status");

-- AddForeignKey
ALTER TABLE "slots" ADD CONSTRAINT "slots_provideLanguageId_fkey" FOREIGN KEY ("provideLanguageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slots" ADD CONSTRAINT "slots_exchangeLanguageId_fkey" FOREIGN KEY ("exchangeLanguageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slots" ADD CONSTRAINT "slots_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slots" ADD CONSTRAINT "slots_exchangeUserId_fkey" FOREIGN KEY ("exchangeUserId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
