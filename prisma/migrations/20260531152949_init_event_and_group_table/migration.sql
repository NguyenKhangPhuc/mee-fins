-- CreateEnum
CREATE TYPE "EVENT_STATUS" AS ENUM ('finished', 'ongoing');

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "poster_path" TEXT,
    "title" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "status" "EVENT_STATUS" NOT NULL DEFAULT 'ongoing',
    "content" TEXT,
    "location" TEXT,
    "max_group_members" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organized_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "group_name" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "short_description" TEXT NOT NULL,
    "poster_path" TEXT,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
