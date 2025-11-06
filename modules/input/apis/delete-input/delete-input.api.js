// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * Delete an input
 * Maps to: DELETE /api/inputs/{id}
 * @param {string} inputId
 * @returns {Promise<void>}
 */
export function deleteInput(inputId) {
	return apiClient.delete(`/inputs/${inputId}`);
}

/**
 * Get mutation key for delete input
 */
export const getDeleteInputMutationKey = () => ["delete-input"];

/**
 * React Query mutation hook for deleting input
 * @param {import("react-query").UseMutationOptions<void, import("axios").AxiosError, string>} [options]
 */
export function useDeleteInputMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteInput,
		mutationKey: getDeleteInputMutationKey(),
		onSuccess: (data, inputId) => {
			queryClient.invalidateQueries({ queryKey: ["inputs"] });
			queryClient.invalidateQueries({ queryKey: ["input", inputId] });
			toast.success("Input deleted successfully!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to delete input. Please try again."),
			);
		},
		...options,
	});
}
