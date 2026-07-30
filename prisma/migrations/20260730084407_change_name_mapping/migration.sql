/*
  Warnings:

  - You are about to drop the column `bookedAt` on the `slots` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `slots` table. All the data in the column will be lost.
  - You are about to drop the column `durationMinutes` on the `slots` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `slots` table. All the data in the column will be lost.
  - You are about to drop the column `exchangeLanguageId` on the `slots` table. All the data in the column will be lost.
  - You are about to drop the column `exchangeUserId` on the `slots` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `slots` table. All the data in the column will be lost.
  - You are about to drop the column `provideLanguageId` on the `slots` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `slots` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `slots` table. All the data in the column will be lost.
  - You are about to drop the column `videoExpiresAt` on the `slots` table. All the data in the column will be lost.
  - You are about to drop the column `videoRecordUrl` on the `slots` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `vocabulary_collections` table. All the data in the column will be lost.
  - You are about to drop the column `languageId` on the `vocabulary_collections` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `vocabulary_collections` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `vocabulary_collections` table. All the data in the column will be lost.
  - You are about to drop the column `collectionId` on the `vocabulary_words` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `vocabulary_words` table. All the data in the column will be lost.
  - You are about to drop the column `slotId` on the `vocabulary_words` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `vocabulary_words` table. All the data in the column will be lost.
  - Added the required column `duration_minutes` to the `slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `exchange_language_id` to the `slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provide_language_id` to the `slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language_id` to the `vocabulary_collections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `vocabulary_collections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `vocabulary_collections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collection_id` to the `vocabulary_words` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `vocabulary_words` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "slots" DROP CONSTRAINT "slots_exchangeLanguageId_fkey";

-- DropForeignKey
ALTER TABLE "slots" DROP CONSTRAINT "slots_exchangeUserId_fkey";

-- DropForeignKey
ALTER TABLE "slots" DROP CONSTRAINT "slots_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "slots" DROP CONSTRAINT "slots_provideLanguageId_fkey";

-- DropForeignKey
ALTER TABLE "vocabulary_collections" DROP CONSTRAINT "vocabulary_collections_languageId_fkey";

-- DropForeignKey
ALTER TABLE "vocabulary_collections" DROP CONSTRAINT "vocabulary_collections_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "vocabulary_words" DROP CONSTRAINT "vocabulary_words_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "vocabulary_words" DROP CONSTRAINT "vocabulary_words_slotId_fkey";

-- DropIndex
DROP INDEX "slots_startTime_status_idx";

-- DropIndex
DROP INDEX "vocabulary_collections_ownerId_idx";

-- DropIndex
DROP INDEX "vocabulary_words_collectionId_idx";

-- AlterTable
ALTER TABLE "slots" DROP COLUMN "bookedAt",
DROP COLUMN "createdAt",
DROP COLUMN "durationMinutes",
DROP COLUMN "endTime",
DROP COLUMN "exchangeLanguageId",
DROP COLUMN "exchangeUserId",
DROP COLUMN "ownerId",
DROP COLUMN "provideLanguageId",
DROP COLUMN "startTime",
DROP COLUMN "updatedAt",
DROP COLUMN "videoExpiresAt",
DROP COLUMN "videoRecordUrl",
ADD COLUMN     "booked_at" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "duration_minutes" INTEGER NOT NULL,
ADD COLUMN     "end_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "exchange_language_id" TEXT NOT NULL,
ADD COLUMN     "exchange_user_id" TEXT,
ADD COLUMN     "owner_id" TEXT NOT NULL,
ADD COLUMN     "provide_language_id" TEXT NOT NULL,
ADD COLUMN     "start_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "video_expire_at" TIMESTAMP(3),
ADD COLUMN     "video_record_url" TEXT;

-- AlterTable
ALTER TABLE "vocabulary_collections" DROP COLUMN "createdAt",
DROP COLUMN "languageId",
DROP COLUMN "ownerId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "language_id" TEXT NOT NULL,
ADD COLUMN     "owner_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "vocabulary_words" DROP COLUMN "collectionId",
DROP COLUMN "createdAt",
DROP COLUMN "slotId",
DROP COLUMN "updatedAt",
ADD COLUMN     "collection_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "slot_id" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "slots_start_time_status_idx" ON "slots"("start_time", "status");

-- CreateIndex
CREATE INDEX "vocabulary_collections_owner_id_idx" ON "vocabulary_collections"("owner_id");

-- CreateIndex
CREATE INDEX "vocabulary_words_collection_id_idx" ON "vocabulary_words"("collection_id");

-- AddForeignKey
ALTER TABLE "slots" ADD CONSTRAINT "slots_provide_language_id_fkey" FOREIGN KEY ("provide_language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slots" ADD CONSTRAINT "slots_exchange_language_id_fkey" FOREIGN KEY ("exchange_language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slots" ADD CONSTRAINT "slots_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slots" ADD CONSTRAINT "slots_exchange_user_id_fkey" FOREIGN KEY ("exchange_user_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_collections" ADD CONSTRAINT "vocabulary_collections_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_collections" ADD CONSTRAINT "vocabulary_collections_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_words" ADD CONSTRAINT "vocabulary_words_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "vocabulary_collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_words" ADD CONSTRAINT "vocabulary_words_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
