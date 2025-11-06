// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").UpdateInputRequest} UpdateInputRequest
 */

/**
 * @typedef {import("../../../../types/api").InputDto} InputDto
 */

/**
 * @typedef {Object} UpdateInputParams
 * @property {string} inputId
 * @property {UpdateInputRequest} data
 */

/**
 * Update an input (admin can update status, assign topic, etc.)
 * Maps to: PUT /api/inputs/{id}
 * @param {UpdateInputParams} params
 * @returns {Promise<InputDto>}
 */
export function updateInput({ inputId, data }) {
	return apiClient.put(`/inputs/${inputId}`, data);
}

/**
 * Get mutation key for update input
 */
export const getUpdateInputMutationKey = () => ["update-input"];

/**
 * React Query mutation hook for updating input
 * @param {import("react-query").UseMutationOptions<InputDto, import("axios").AxiosError, UpdateInputParams>} [options]
 */
export function useUpdateInputMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateInput,
		mutationKey: getUpdateInputMutationKey(),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["inputs"] });
			queryClient.invalidateQueries({ queryKey: ["input", variables.inputId] });
			toast.success("Input updated successfully!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to update input. Please try again."),
			);
		},
		...options,
	});
}
