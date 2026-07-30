-- Step 1: Drop ALL Foreign Key Constraints that involve transformed columns
ALTER TABLE "auth"."refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_user_id_fkey";
ALTER TABLE "auth"."refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_session_id_fkey"; -- Thêm xóa FK này
ALTER TABLE "auth"."sessions" DROP CONSTRAINT IF EXISTS "sessions_user_id_fkey";
ALTER TABLE "profiles" DROP CONSTRAINT IF EXISTS "profiles_id_fkey";
ALTER TABLE "slot_ratings" DROP CONSTRAINT IF EXISTS "slot_ratings_rated_user_id_fkey";
ALTER TABLE "slot_ratings" DROP CONSTRAINT IF EXISTS "slot_ratings_rater_id_fkey";
ALTER TABLE "slot_ratings" DROP CONSTRAINT IF EXISTS "slot_ratings_slot_id_fkey";
ALTER TABLE "slots" DROP CONSTRAINT IF EXISTS "slots_exchange_language_id_fkey";
ALTER TABLE "slots" DROP CONSTRAINT IF EXISTS "slots_exchange_user_id_fkey";
ALTER TABLE "slots" DROP CONSTRAINT IF EXISTS "slots_owner_id_fkey";
ALTER TABLE "slots" DROP CONSTRAINT IF EXISTS "slots_provide_language_id_fkey";
ALTER TABLE "user_languages" DROP CONSTRAINT IF EXISTS "user_languages_language_id_fkey";
ALTER TABLE "user_languages" DROP CONSTRAINT IF EXISTS "user_languages_user_id_fkey";
ALTER TABLE "vocabulary_collections" DROP CONSTRAINT IF EXISTS "vocabulary_collections_language_id_fkey";
ALTER TABLE "vocabulary_collections" DROP CONSTRAINT IF EXISTS "vocabulary_collections_owner_id_fkey";
ALTER TABLE "vocabulary_words" DROP CONSTRAINT IF EXISTS "vocabulary_words_collection_id_fkey";
ALTER TABLE "vocabulary_words" DROP CONSTRAINT IF EXISTS "vocabulary_words_slot_id_fkey";

-- Step 2: Convert Columns Data Types to UUID safely

-- auth.users
ALTER TABLE "auth"."users" 
  ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid;

-- auth.sessions
ALTER TABLE "auth"."sessions" 
  ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "user_id" SET DATA TYPE UUID USING "user_id"::uuid;

-- auth.refresh_tokens (Đã bổ sung session_id ở đây)
ALTER TABLE "auth"."refresh_tokens" 
  ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "user_id" SET DATA TYPE UUID USING "user_id"::uuid,
  ALTER COLUMN "session_id" SET DATA TYPE UUID USING "session_id"::uuid; 

-- languages
ALTER TABLE "languages" 
  ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid;

-- profiles
ALTER TABLE "profiles" 
  ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid;

-- slots
ALTER TABLE "slots" 
  ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "exchange_language_id" SET DATA TYPE UUID USING "exchange_language_id"::uuid,
  ALTER COLUMN "exchange_user_id" SET DATA TYPE UUID USING "exchange_user_id"::uuid,
  ALTER COLUMN "owner_id" SET DATA TYPE UUID USING "owner_id"::uuid,
  ALTER COLUMN "provide_language_id" SET DATA TYPE UUID USING "provide_language_id"::uuid;

-- slot_ratings
ALTER TABLE "slot_ratings" 
  ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "slot_id" SET DATA TYPE UUID USING "slot_id"::uuid,
  ALTER COLUMN "rater_id" SET DATA TYPE UUID USING "rater_id"::uuid,
  ALTER COLUMN "rated_user_id" SET DATA TYPE UUID USING "rated_user_id"::uuid;

-- user_languages
ALTER TABLE "user_languages" 
  ALTER COLUMN "user_id" SET DATA TYPE UUID USING "user_id"::uuid,
  ALTER COLUMN "language_id" SET DATA TYPE UUID USING "language_id"::uuid;

-- vocabulary_collections
ALTER TABLE "vocabulary_collections" 
  ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "language_id" SET DATA TYPE UUID USING "language_id"::uuid,
  ALTER COLUMN "owner_id" SET DATA TYPE UUID USING "owner_id"::uuid;

-- vocabulary_words
ALTER TABLE "vocabulary_words" 
  ALTER COLUMN "id" SET DATA TYPE UUID USING "id"::uuid,
  ALTER COLUMN "collection_id" SET DATA TYPE UUID USING "collection_id"::uuid,
  ALTER COLUMN "slot_id" SET DATA TYPE UUID USING "slot_id"::uuid;

-- Step 3: Re-create Foreign Key Constraints
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "auth"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "auth"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE; -- Thêm gắn lại FK này

ALTER TABLE "auth"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "slots" ADD CONSTRAINT "slots_provide_language_id_fkey" FOREIGN KEY ("provide_language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "slots" ADD CONSTRAINT "slots_exchange_language_id_fkey" FOREIGN KEY ("exchange_language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "slots" ADD CONSTRAINT "slots_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "slots" ADD CONSTRAINT "slots_exchange_user_id_fkey" FOREIGN KEY ("exchange_user_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "slot_ratings" ADD CONSTRAINT "slot_ratings_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "slot_ratings" ADD CONSTRAINT "slot_ratings_rater_id_fkey" FOREIGN KEY ("rater_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "slot_ratings" ADD CONSTRAINT "slot_ratings_rated_user_id_fkey" FOREIGN KEY ("rated_user_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "user_languages" ADD CONSTRAINT "user_languages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "user_languages" ADD CONSTRAINT "user_languages_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "vocabulary_collections" ADD CONSTRAINT "vocabulary_collections_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "vocabulary_collections" ADD CONSTRAINT "vocabulary_collections_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "vocabulary_words" ADD CONSTRAINT "vocabulary_words_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "vocabulary_collections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "vocabulary_words" ADD CONSTRAINT "vocabulary_words_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;