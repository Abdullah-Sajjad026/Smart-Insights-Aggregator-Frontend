// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").InputDto} InputDto
 */

/**
 * @typedef {Object} RespondToRevealParams
 * @property {string} inputId
 * @property {boolean} approved
 */

/**
 * Respond to identity reveal request (Student only)
 * Maps to: POST /api/inputs/{id}/reveal-respond
 * @param {RespondToRevealParams} params
 * @returns {Promise<InputDto>}
 */
export function respondToReveal({ inputId, approved }) {
	return apiClient.post(`/inputs/${inputId}/reveal-respond`, { approved });
}

/**
 * Get mutation key for respond to reveal
 */
export const getRespondToRevealMutationKey = () => ["respond-to-reveal"];

/**
 * React Query mutation hook for responding to identity reveal request
 * @param {import("react-query").UseMutationOptions<InputDto, import("axios").AxiosError, RespondToRevealParams>} [options]
 */
export function useRespondToRevealMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: respondToReveal,
		mutationKey: getRespondToRevealMutationKey(),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["inputs"] });
			queryClient.invalidateQueries({ queryKey: ["my-inputs"] });
			queryClient.invalidateQueries({ queryKey: ["input", variables.inputId] });

			const message = variables.approved
				? "Identity revealed to admin!"
				: "Identity reveal request denied.";
			toast.success(message);
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(
					error,
					"Failed to respond to reveal request. Please try again.",
				),
			);
		},
		...options,
	});
}
