// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * Post an update to a topic
 * Maps to: POST /api/topics/{id}/updates
 * @param {{ topicId: string, data: { message: string } }} params
 */
export function postTopicUpdate({ topicId, data }) {
	return apiClient.post(`/topics/${topicId}/updates`, data);
}

export const getPostTopicUpdateMutationKey = () => ["post-topic-update"];

export function usePostTopicUpdateMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: postTopicUpdate,
		mutationKey: getPostTopicUpdateMutationKey(),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["topic", variables.topicId] });
			toast.success("Update posted successfully!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to post update. Please try again."),
			);
		},
		...options,
	});
}
