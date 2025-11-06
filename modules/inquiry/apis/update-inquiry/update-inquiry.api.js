// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").UpdateInquiryRequest} UpdateInquiryRequest
 */

/**
 * @typedef {import("../../../../types/api").InquiryDto} InquiryDto
 */

/**
 * @typedef {Object} UpdateInquiryParams
 * @property {string} inquiryId
 * @property {UpdateInquiryRequest} data
 */

/**
 * Update an inquiry
 * Maps to: PUT /api/inquiries/{id}
 * @param {UpdateInquiryParams} params
 * @returns {Promise<InquiryDto>}
 */
export function updateInquiry({ inquiryId, data }) {
	return apiClient.put(`/inquiries/${inquiryId}`, data);
}

/**
 * Get mutation key for update inquiry
 */
export const getUpdateInquiryMutationKey = () => ["update-inquiry"];

/**
 * React Query mutation hook for updating inquiry
 * @param {import("react-query").UseMutationOptions<InquiryDto, import("axios").AxiosError, UpdateInquiryParams>} [options]
 */
export function useUpdateInquiryMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateInquiry,
		mutationKey: getUpdateInquiryMutationKey(),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["inquiries"] });
			queryClient.invalidateQueries({ queryKey: ["inquiry", variables.inquiryId] });
			toast.success("Inquiry updated successfully!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to update inquiry. Please try again."),
			);
		},
		...options,
	});
}
