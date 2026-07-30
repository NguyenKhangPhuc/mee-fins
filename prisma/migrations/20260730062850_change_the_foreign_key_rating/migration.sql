-- DropForeignKey
ALTER TABLE "slot_ratings" DROP CONSTRAINT "slot_ratings_rated_user_id_fkey";

-- DropForeignKey
ALTER TABLE "slot_ratings" DROP CONSTRAINT "slot_ratings_rater_id_fkey";

-- AddForeignKey
ALTER TABLE "slot_ratings" ADD CONSTRAINT "slot_ratings_rater_id_fkey" FOREIGN KEY ("rater_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_ratings" ADD CONSTRAINT "slot_ratings_rated_user_id_fkey" FOREIGN KEY ("rated_user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
