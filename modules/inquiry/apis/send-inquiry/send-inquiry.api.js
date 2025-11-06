// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").InquiryDto} InquiryDto
 */

/**
 * Send an inquiry (change status to Sent)
 * Maps to: POST /api/inquiries/{id}/send
 * @param {string} inquiryId
 * @returns {Promise<InquiryDto>}
 */
export function sendInquiry(inquiryId) {
	return apiClient.post(`/inquiries/${inquiryId}/send`);
}

/**
 * Get mutation key for send inquiry
 */
export const getSendInquiryMutationKey = () => ["send-inquiry"];

/**
 * React Query mutation hook for sending inquiry
 * @param {import("react-query").UseMutationOptions<InquiryDto, import("axios").AxiosError, string>} [options]
 */
export function useSendInquiryMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: sendInquiry,
		mutationKey: getSendInquiryMutationKey(),
		onSuccess: (data, inquiryId) => {
			queryClient.invalidateQueries({ queryKey: ["inquiries"] });
			queryClient.invalidateQueries({ queryKey: ["inquiry", inquiryId] });
			toast.success("Inquiry sent successfully!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to send inquiry. Please try again."),
			);
		},
		...options,
	});
}
