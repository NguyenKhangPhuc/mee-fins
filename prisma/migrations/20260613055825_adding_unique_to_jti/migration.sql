/*
  Warnings:

  - A unique constraint covering the columns `[jti]` on the table `refresh_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refreshed_at` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auth"."sessions" ADD COLUMN     "refreshed_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_jti_key" ON "auth"."refresh_tokens"("jti");
