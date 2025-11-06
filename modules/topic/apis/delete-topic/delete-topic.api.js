// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * Delete a topic
 * Maps to: DELETE /api/topics/{id}
 * @param {string} topicId
 * @returns {Promise<void>}
 */
export function deleteTopic(topicId) {
	return apiClient.delete(`/topics/${topicId}`);
}

export const getDeleteTopicMutationKey = () => ["delete-topic"];

export function useDeleteTopicMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteTopic,
		mutationKey: getDeleteTopicMutationKey(),
		onSuccess: (data, topicId) => {
			queryClient.invalidateQueries({ queryKey: ["topics"] });
			queryClient.invalidateQueries({ queryKey: ["topic", topicId] });
			toast.success("Topic deleted successfully!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to delete topic. Please try again."),
			);
		},
		...options,
	});
}
