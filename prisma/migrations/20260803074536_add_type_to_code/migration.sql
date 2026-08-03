-- CreateEnum
CREATE TYPE "CODE_TYPE" AS ENUM ('SIGN_UP', 'FORGET_PASSWORD');

-- AlterTable
ALTER TABLE "auth"."verification_codes" ADD COLUMN     "type" "CODE_TYPE" NOT NULL DEFAULT 'SIGN_UP';
