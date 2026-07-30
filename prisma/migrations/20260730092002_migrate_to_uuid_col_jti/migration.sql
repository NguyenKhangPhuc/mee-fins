-- Step 1: Drop Foreign Key constraint before changing type
ALTER TABLE "auth"."refresh_tokens" 
  DROP CONSTRAINT IF EXISTS "refresh_tokens_session_id_fkey";

-- Step 2: Safely convert `jti` to UUID without dropping data or column
ALTER TABLE "auth"."refresh_tokens" 
  ALTER COLUMN "jti" SET DATA TYPE UUID USING "jti"::uuid;

-- Step 3: Ensure session_id remains UUID (DO NOT change back to TEXT)
ALTER TABLE "auth"."refresh_tokens" 
  ALTER COLUMN "session_id" SET DATA TYPE UUID USING "session_id"::uuid;

-- Step 4: Re-create unique index on `jti`
CREATE UNIQUE INDEX IF NOT EXISTS "refresh_tokens_jti_key" 
  ON "auth"."refresh_tokens"("jti");

-- Step 5: Re-create Foreign Key constraint pointing to auth.sessions(id)
ALTER TABLE "auth"."refresh_tokens" 
  ADD CONSTRAINT "refresh_tokens_session_id_fkey" 
  FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;