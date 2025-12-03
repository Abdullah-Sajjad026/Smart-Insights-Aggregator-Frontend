// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * Archive a topic
 * Maps to: PUT /api/topics/{id}/archive
 * @param {string} topicId
 * @returns {Promise<void>}
 */
export function archiveTopic(topicId) {
	return apiClient.put(`/topics/${topicId}/archive`);
}

export const getArchiveTopicMutationKey = () => ["archive-topic"];

export function useArchiveTopicMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: archiveTopic,
		mutationKey: getArchiveTopicMutationKey(),
		onSuccess: (data, topicId) => {
			queryClient.invalidateQueries({ queryKey: ["topics"] });
			queryClient.invalidateQueries({ queryKey: ["topic", topicId] });
			toast.success("Topic archived successfully!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to archive topic. Please try again."),
			);
		},
		...options,
	});
}

/**
 * Unarchive a topic
 * Maps to: PUT /api/topics/{id}/unarchive
 * @param {string} topicId
 * @returns {Promise<void>}
 */
export function unarchiveTopic(topicId) {
	return apiClient.put(`/topics/${topicId}/unarchive`);
}

export function useUnarchiveTopicMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: unarchiveTopic,
		onSuccess: (data, topicId) => {
			queryClient.invalidateQueries({ queryKey: ["topics"] });
			queryClient.invalidateQueries({ queryKey: ["topic", topicId] });
			toast.success("Topic unarchived successfully!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to unarchive topic. Please try again."),
			);
		},
		...options,
	});
}
