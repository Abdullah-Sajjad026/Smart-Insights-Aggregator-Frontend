// @ts-check
import { useQuery } from "react-query";
import { TOPIC_STALE_TIME } from "../../topic.config";
import apiClient from "pages/api/AxiosInstance";

/**
 * @typedef {import("../../../../types/api").TopicDto} TopicDto
 */

/**
 * Get topic by ID
 * Maps to: GET /api/topics/{id}
 * @param {string} topicId
 * @returns {Promise<TopicDto>}
 */
export function getTopicById(topicId) {
	return apiClient.get(`/topics/${topicId}`);
}

export const getTopicByIdQueryKey = (topicId) => ["topic", topicId];

export const selectTopicByIdQueryData = (response) => response;

export function useGetTopicById(topicId, queryProps = {}) {
	return useQuery({
		queryFn: () => getTopicById(topicId),
		queryKey: getTopicByIdQueryKey(topicId),
		select: selectTopicByIdQueryData,
		staleTime: TOPIC_STALE_TIME,
		enabled: !!topicId,
		...queryProps,
	});
}
