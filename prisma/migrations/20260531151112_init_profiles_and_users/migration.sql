-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateEnum
CREATE TYPE "PROFILE_ROLE" AS ENUM ('admin', 'student', 'judge');

-- CreateEnum
CREATE TYPE "UNIVERSITY" AS ENUM ('Oulu University of Applied Science', 'University of Oulu');

-- CreateEnum
CREATE TYPE "PROGRAMME" AS ENUM ('Computer Science and Engineering', 'Information Processing Science', 'Electronics and Communications Engineering', 'Biomedical Engineering');

-- CreateEnum
CREATE TYPE "DEGREE" AS ENUM ('Bachelor', 'Master', 'Ph.D');

-- CreateEnum
CREATE TYPE "YEAR" AS ENUM ('First Year', 'Second Year', 'Third Year', 'Other');

-- CreateTable
CREATE TABLE "auth"."users" (
    "id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "confirmation_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth"."refresh_tokens" (
    "id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "user_id" TEXT NOT NULL,
    "fullName" TEXT,
    "email" TEXT NOT NULL,
    "avatar_url" TEXT,
    "role" "PROFILE_ROLE" NOT NULL,
    "company_name" TEXT,
    "programme" "PROGRAMME",
    "university" "UNIVERSITY",
    "degree" "DEGREE",
    "year" "YEAR",
    "company_unit" TEXT,
    "job_title" TEXT,
    "github" TEXT,
    "linkedIn" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "auth"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- AddForeignKey
ALTER TABLE "auth"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
