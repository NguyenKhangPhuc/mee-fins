/*
  Warnings:

  - You are about to drop the column `token_hash` on the `refresh_tokens` table. All the data in the column will be lost.
  - Added the required column `jti` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auth"."refresh_tokens" DROP COLUMN "token_hash",
ADD COLUMN     "jti" TEXT NOT NULL;
