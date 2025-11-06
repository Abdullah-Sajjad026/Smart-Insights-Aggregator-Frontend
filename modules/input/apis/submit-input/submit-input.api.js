// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").CreateInputRequest} CreateInputRequest
 */

/**
 * @typedef {import("../../../../types/api").InputDto} InputDto
 */

/**
 * Submit a new input (feedback)
 * Maps to: POST /api/inputs
 * Anonymous submission is allowed (userId is optional)
 * @param {CreateInputRequest} params
 * @returns {Promise<InputDto>}
 */
export function submitInput(params) {
	return apiClient.post("/inputs", params);
}

/**
 * Get mutation key for submit input
 */
export const getSubmitInputMutationKey = () => ["submit-input"];

/**
 * React Query mutation hook for submitting input
 * @param {import("react-query").UseMutationOptions<InputDto, import("axios").AxiosError, CreateInputRequest>} [options]
 */
export function useSubmitInputMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: submitInput,
		mutationKey: getSubmitInputMutationKey(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inputs"] });
			queryClient.invalidateQueries({ queryKey: ["my-inputs"] });
			toast.success("Your feedback has been submitted successfully!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to submit feedback. Please try again."),
			);
		},
		...options,
	});
}
