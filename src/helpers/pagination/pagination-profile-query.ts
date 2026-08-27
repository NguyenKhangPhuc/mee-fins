import { Prisma } from "src/generated/prisma/client";
import { SlotStatus } from "src/generated/prisma/enums";

export const getProfileRawQuery = (today: Date, currentUserId: string, limit: number, skip: number | string): Prisma.Sql => {
  return Prisma.sql`
  SELECT
    p.id,
    p."fullName",
    p.email,
    p.avatar_url as "avatarUrl",
    p.avatar_key as "avatarKey",
    p.company_name as "companyName",
    p.age,
    p.programme,
    p.university,
    p.degree,
    p.instagram,
    p.facebook,
    p."linkedIn",
    p.description,
    p.created_at as "createdAt",
    p.updated_at as "updatedAt",
    COALESCE(r.rating_avg, 0)::float as "ratingAvg",
    COALESCE(r.rating_count, 0)::int as "ratingCount",
    COALESCE(s.open_slots_count, 0)::int as "openSlotsCount",
    (0.2 * COALESCE(r.rating_avg, 0) + 0.8 * COALESCE(s.open_slots_count, 0)) as "score",
    COALESCE(r.ratings_received, '[]'::json) as "ratingsReceived",
    COALESCE(s.provide_slots, '[]'::json) as "provideSlots"
  FROM profiles p
  LEFT JOIN (
    SELECT
      rated_user_id,
      AVG(rating) as rating_avg,
      COUNT(*) as rating_count,
      json_agg(
        json_build_object(
          'id', id,
          'slotId', slot_id,
          'raterId', rater_id,
          'ratedUserId', rated_user_id,
          'rating', rating,
          'feedback', feedback,
          'displayName', display_name,
          'createdAt', created_at
        )
      ) as ratings_received
    FROM slot_ratings
    GROUP BY rated_user_id
    HAVING COUNT(*) > 2
  ) r ON r.rated_user_id = p.id
  LEFT JOIN (
    SELECT
      sl.owner_id,
      COUNT(*) as open_slots_count,
      json_agg(
        json_build_object(
          'id', sl.id,
          'title', sl.title,
          'startTime', sl.start_time,
          'endTime', sl.end_time,
          'durationMinutes', sl.duration_minutes,
          'status', sl.status,
          'provideLanguageId', sl.provide_language_id,
          'exchangeLanguageId', sl.exchange_language_id,
          'ownerId', sl.owner_id,
          'exchangeUserId', sl.exchange_user_id,
          'provideLanguage', CASE 
            WHEN pl.id IS NOT NULL THEN json_build_object(
              'id', pl.id,
              'name', pl.name,
              'createdAt', pl.created_at,
              'updatedAt', pl.updated_at
            ) ELSE NULL END,
          'exchangeLanguage', CASE 
            WHEN el.id IS NOT NULL THEN json_build_object(
              'id', el.id,
              'name', el.name,
              'createdAt', el.created_at,
              'updatedAt', el.updated_at
            ) ELSE NULL END
        )
      ) as provide_slots
    FROM slots sl
    LEFT JOIN languages pl ON sl.provide_language_id = pl.id
    LEFT JOIN languages el ON sl.exchange_language_id = el.id
    WHERE sl.status = ${SlotStatus.OPEN}
      AND sl.start_time >= ${today}
    GROUP BY sl.owner_id
  ) s ON s.owner_id = p.id
  WHERE p.id != ${currentUserId}
  ORDER BY "score" DESC
  LIMIT ${limit} OFFSET ${skip}
`;
}