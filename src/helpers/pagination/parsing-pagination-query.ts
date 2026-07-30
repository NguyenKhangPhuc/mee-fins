import { PaginationDto } from "./dto/pagination.dto";

export function getPaginationParams(query: PaginationDto) {
    const page = query.page
    const limit = query.limit
    const skip = (page - 1) * limit;
    return { page, limit, skip }
}