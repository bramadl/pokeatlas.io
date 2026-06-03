export interface InfinitePagination {
	pagination: {
		limit: number;
		page?: number;
		cursor?: string | null;
	};
}

export interface InfinitePaginationReturns {
	hasMore: boolean;
	nextCursor?: string | null;
	totalEntries?: number;
}
