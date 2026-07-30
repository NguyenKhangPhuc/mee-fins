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
    (0.7 * COALESCE(r.rating_avg, 0) + 0.3 * COALESCE(s.open_slots_count, 0)) as "score",
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
          'createdAt', created_at
        )
      ) as ratings_received
    FROM slot_ratings
    GROUP BY rated_user_id
    HAVING COUNT(*) > 2
  ) r ON r.rated_user_id = p.id
  LEFT JOIN (
    SELECT
      owner_id,
      COUNT(*) as open_slots_count,
      json_agg(
        json_build_object(
          'id', id,
          'title', title,
          'startTime', start_time,
          'endTime', end_time,
          'durationMinutes', duration_minutes,
          'status', status,
          'provideLanguageId', provide_language_id,
          'exchangeLanguageId', exchange_language_id,
          'ownerId', owner_id,
          'exchangeUserId', exchange_user_id
        )
      ) as provide_slots
    FROM slots
    WHERE status = ${SlotStatus.OPEN}
      AND start_time >= ${today}
    GROUP BY owner_id
  ) s ON s.owner_id = p.id
  WHERE p.id != ${currentUserId}
  ORDER BY "score" DESC
  LIMIT ${limit} OFFSET ${skip}
`;
}