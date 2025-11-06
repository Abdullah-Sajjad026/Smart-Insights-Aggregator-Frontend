// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").UpdateTopicRequest} UpdateTopicRequest
 */

/**
 * @typedef {import("../../../../types/api").TopicDto} TopicDto
 */

/**
 * @typedef {Object} UpdateTopicParams
 * @property {string} topicId
 * @property {UpdateTopicRequest} data
 */

/**
 * Update a topic
 * Maps to: PUT /api/topics/{id}
 * @param {UpdateTopicParams} params
 * @returns {Promise<TopicDto>}
 */
export function updateTopic({ topicId, data }) {
	return apiClient.put(`/topics/${topicId}`, data);
}

export const getUpdateTopicMutationKey = () => ["update-topic"];

export function useUpdateTopicMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateTopic,
		mutationKey: getUpdateTopicMutationKey(),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["topics"] });
			queryClient.invalidateQueries({ queryKey: ["topic", variables.topicId] });
			toast.success("Topic updated successfully!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to update topic. Please try again."),
			);
		},
		...options,
	});
}
