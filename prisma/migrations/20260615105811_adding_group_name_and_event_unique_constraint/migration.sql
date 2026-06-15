/*
  Warnings:

  - A unique constraint covering the columns `[group_name,event_id]` on the table `groups` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "groups_group_name_event_id_key" ON "groups"("group_name", "event_id");
