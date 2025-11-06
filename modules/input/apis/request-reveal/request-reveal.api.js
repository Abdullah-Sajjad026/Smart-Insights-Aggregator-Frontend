// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").InputDto} InputDto
 */

/**
 * Request identity reveal for an anonymous input (Admin only)
 * Maps to: POST /api/inputs/{id}/reveal-request
 * @param {string} inputId
 * @returns {Promise<InputDto>}
 */
export function requestReveal(inputId) {
	return apiClient.post(`/inputs/${inputId}/reveal-request`);
}

/**
 * Get mutation key for request reveal
 */
export const getRequestRevealMutationKey = () => ["request-reveal"];

/**
 * React Query mutation hook for requesting identity reveal
 * @param {import("react-query").UseMutationOptions<InputDto, import("axios").AxiosError, string>} [options]
 */
export function useRequestRevealMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: requestReveal,
		mutationKey: getRequestRevealMutationKey(),
		onSuccess: (data, inputId) => {
			queryClient.invalidateQueries({ queryKey: ["inputs"] });
			queryClient.invalidateQueries({ queryKey: ["input", inputId] });
			toast.success("Identity reveal request sent to student!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(
					error,
					"Failed to request identity reveal. Please try again.",
				),
			);
		},
		...options,
	});
}
