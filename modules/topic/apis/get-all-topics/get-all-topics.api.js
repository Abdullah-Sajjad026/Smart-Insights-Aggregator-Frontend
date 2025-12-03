// @ts-check
import { useQuery } from "react-query";
import { TOPIC_STALE_TIME } from "../../topic.config";
import apiClient from "pages/api/AxiosInstance";

/**
 * @typedef {import("../../../../types/api").TopicDto} TopicDto
 */

/**
 * @typedef {import("../../../../types/api").PaginatedResult} PaginatedResult
 */

/**
 * Get all topics
 * Maps to: GET /api/topics
 * @param {Object} params
 * @param {number} [params.page]
 * @param {number} [params.pageSize]
 * @param {boolean} [params.includeArchived]
 * @returns {Promise<Object>}
 */
export function getAllTopics({ page = 1, pageSize = 20, includeArchived = false } = {}) {
	return apiClient.get("/topics", {
		params: { page, pageSize, includeArchived },
	});
}

export const getAllTopicsQueryKey = (params) => ["topics", params];

export function useGetAllTopics(params = {}, queryOptions = {}) {
	return useQuery({
		queryKey: getAllTopicsQueryKey(params),
		queryFn: () => getAllTopics(params),
		select: (response) => ({
			data: response.items,
			pagination: {
				totalItems: response.totalCount,
				pageNumber: response.currentPage,
				pageSize: response.pageSize,
				totalPages: response.totalPages,
			},
		}),
		staleTime: TOPIC_STALE_TIME,
		...queryOptions,
	});
}
