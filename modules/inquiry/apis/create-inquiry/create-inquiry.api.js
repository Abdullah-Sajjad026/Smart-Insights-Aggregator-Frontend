// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").CreateInquiryRequest} CreateInquiryRequest
 */

/**
 * @typedef {import("../../../../types/api").InquiryDto} InquiryDto
 */

/**
 * Create a new inquiry
 * Maps to: POST /api/inquiries
 * @param {CreateInquiryRequest} data
 * @returns {Promise<InquiryDto>}
 */
export function createInquiry(data) {
	return apiClient.post("/inquiries", data);
}

/**
 * Get mutation key for create inquiry
 */
export const getCreateInquiryMutationKey = () => ["create-inquiry"];

/**
 * React Query mutation hook for creating inquiry
 * @param {import("react-query").UseMutationOptions<InquiryDto, import("axios").AxiosError, CreateInquiryRequest>} [options]
 */
export function useCreateInquiryMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createInquiry,
		mutationKey: getCreateInquiryMutationKey(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["inquiries"] });
			toast.success("Inquiry created successfully!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to create inquiry. Please try again."),
			);
		},
		...options,
	});
}
