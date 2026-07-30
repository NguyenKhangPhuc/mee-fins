import { ProfileUncheckedCreateInput } from "src/generated/prisma/models";

export interface ProfileWithScore extends ProfileUncheckedCreateInput {
    rating_avg: number;
    rating_count: number;
    open_slots_count: number;
    score: number;
};