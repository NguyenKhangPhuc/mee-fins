import { PaginationResponse } from "src/types/pagination-response";

export function paginate<T>(data: T[],
    total: number,
    page: number,
    limit: number,): PaginationResponse<T> {
    const totalPages = Math.ceil(total / limit);
    console.log("this is total page", totalPages, total, limit)
    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    };
}