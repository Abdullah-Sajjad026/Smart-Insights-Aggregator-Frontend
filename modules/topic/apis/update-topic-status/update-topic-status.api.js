// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * Update a topic's status
 * Maps to: PUT /api/topics/{id}/status
 * @param {{ topicId: string, data: { status: string, message: string } }} params
 */
export function updateTopicStatus({ topicId, data }) {
	return apiClient.put(`/topics/${topicId}/status`, data);
}

export const getUpdateTopicStatusMutationKey = () => ["update-topic-status"];

export function useUpdateTopicStatusMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateTopicStatus,
		mutationKey: getUpdateTopicStatusMutationKey(),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["topics"] });
			queryClient.invalidateQueries({ queryKey: ["topic", variables.topicId] });
			toast.success("Topic status updated successfully!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to update topic status. Please try again."),
			);
		},
		...options,
	});
}
