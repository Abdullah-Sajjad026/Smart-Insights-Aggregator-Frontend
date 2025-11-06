// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").CreateTopicRequest} CreateTopicRequest
 */

/**
 * @typedef {import("../../../../types/api").TopicDto} TopicDto
 */

/**
 * Create a new topic
 * Maps to: POST /api/topics
 * @param {CreateTopicRequest} data
 * @returns {Promise<TopicDto>}
 */
export function createTopic(data) {
	return apiClient.post("/topics", data);
}

export const getCreateTopicMutationKey = () => ["create-topic"];

export function useCreateTopicMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createTopic,
		mutationKey: getCreateTopicMutationKey(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["topics"] });
			toast.success("Topic created successfully!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to create topic. Please try again."),
			);
		},
		...options,
	});
}
