// @ts-check
import { useQuery } from "react-query";
import { TOPIC_STALE_TIME } from "../../topic.config";
import apiClient from "pages/api/AxiosInstance";

/**
 * @typedef {import("../../../../types/api").TopicStatsDto} TopicStatsDto
 */

/**
 * Get topic statistics
 * Maps to: GET /api/topics/stats
 * @returns {Promise<TopicStatsDto>}
 */
export function getTopicStats() {
	return apiClient.get("/topics/stats");
}

export const getTopicStatsQueryKey = () => ["topics", "stats"];

export const selectTopicStatsQueryData = (response) => response;

export function useGetTopicStats(queryProps = {}) {
	return useQuery({
		queryFn: getTopicStats,
		queryKey: getTopicStatsQueryKey(),
		select: selectTopicStatsQueryData,
		staleTime: TOPIC_STALE_TIME,
		...queryProps,
	});
}
