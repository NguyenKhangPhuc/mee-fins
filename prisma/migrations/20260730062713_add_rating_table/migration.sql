-- CreateTable
CREATE TABLE "slot_ratings" (
    "id" TEXT NOT NULL,
    "slot_id" TEXT NOT NULL,
    "rater_id" TEXT NOT NULL,
    "rated_user_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "feedback" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "slot_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "slot_ratings_rated_user_id_idx" ON "slot_ratings"("rated_user_id");

-- CreateIndex
CREATE INDEX "slot_ratings_rater_id_idx" ON "slot_ratings"("rater_id");

-- CreateIndex
CREATE UNIQUE INDEX "slot_ratings_slot_id_rater_id_rated_user_id_key" ON "slot_ratings"("slot_id", "rater_id", "rated_user_id");

-- AddForeignKey
ALTER TABLE "slot_ratings" ADD CONSTRAINT "slot_ratings_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_ratings" ADD CONSTRAINT "slot_ratings_rater_id_fkey" FOREIGN KEY ("rater_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_ratings" ADD CONSTRAINT "slot_ratings_rated_user_id_fkey" FOREIGN KEY ("rated_user_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
