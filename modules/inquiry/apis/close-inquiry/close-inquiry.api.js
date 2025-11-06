// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").InquiryDto} InquiryDto
 */

/**
 * Close an inquiry (change status to Closed)
 * Maps to: POST /api/inquiries/{id}/close
 * @param {string} inquiryId
 * @returns {Promise<InquiryDto>}
 */
export function closeInquiry(inquiryId) {
	return apiClient.post(`/inquiries/${inquiryId}/close`);
}

/**
 * Get mutation key for close inquiry
 */
export const getCloseInquiryMutationKey = () => ["close-inquiry"];

/**
 * React Query mutation hook for closing inquiry
 * @param {import("react-query").UseMutationOptions<InquiryDto, import("axios").AxiosError, string>} [options]
 */
export function useCloseInquiryMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: closeInquiry,
		mutationKey: getCloseInquiryMutationKey(),
		onSuccess: (data, inquiryId) => {
			queryClient.invalidateQueries({ queryKey: ["inquiries"] });
			queryClient.invalidateQueries({ queryKey: ["inquiry", inquiryId] });
			toast.success("Inquiry closed successfully!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to close inquiry. Please try again."),
			);
		},
		...options,
	});
}
