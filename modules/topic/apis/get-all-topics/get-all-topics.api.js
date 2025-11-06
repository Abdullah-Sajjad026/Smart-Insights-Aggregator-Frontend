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
 * @param {number} [params.page=1]
 * @param {number} [params.pageSize=25]
 * @param {boolean} [params.isActive]
 * @returns {Promise<PaginatedResult<TopicDto>>}
 */
export function getAllTopics(params = {}) {
	return apiClient.get("/topics", { params });
}

export const getGetAllTopicsQueryKey = (params) => ["topics", "all", params];

export const selectGetAllTopicsQueryData = (response) => response;

export function useGetAllTopics(params = {}, queryProps = {}) {
	return useQuery({
		queryFn: () => getAllTopics(params),
		queryKey: getGetAllTopicsQueryKey(params),
		select: selectGetAllTopicsQueryData,
		staleTime: TOPIC_STALE_TIME,
		...queryProps,
	});
}
