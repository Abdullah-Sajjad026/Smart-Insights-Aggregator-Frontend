// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").CreateReplyRequest} CreateReplyRequest
 */

/**
 * @typedef {import("../../../../types/api").InputReplyDto} InputReplyDto
 */

/**
 * @typedef {Object} CreateInputReplyParams
 * @property {string} inputId
 * @property {CreateReplyRequest} data
 */

/**
 * Create a reply to an input (admin or student can reply)
 * Maps to: POST /api/inputs/{id}/replies
 * @param {CreateInputReplyParams} params
 * @returns {Promise<InputReplyDto>}
 */
export function createInputReply({ inputId, data }) {
	return apiClient.post(`/inputs/${inputId}/replies`, data);
}

/**
 * Get mutation key for create input reply
 */
export const getCreateInputReplyMutationKey = () => ["create-input-reply"];

/**
 * React Query mutation hook for creating input reply
 * @param {import("react-query").UseMutationOptions<InputReplyDto, import("axios").AxiosError, CreateInputReplyParams>} [options]
 */
export function useCreateInputReplyMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createInputReply,
		mutationKey: getCreateInputReplyMutationKey(),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["input-replies", variables.inputId],
			});
			queryClient.invalidateQueries({ queryKey: ["input", variables.inputId] });
			toast.success("Reply sent successfully!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to send reply. Please try again."),
			);
		},
		...options,
	});
}
