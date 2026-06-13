/*
  Warnings:

  - You are about to drop the column `expires_at` on the `refresh_tokens` table. All the data in the column will be lost.
  - Added the required column `session_id` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auth"."refresh_tokens" DROP COLUMN "expires_at",
ADD COLUMN     "is_revoked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "session_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "auth"."sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "auth"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
