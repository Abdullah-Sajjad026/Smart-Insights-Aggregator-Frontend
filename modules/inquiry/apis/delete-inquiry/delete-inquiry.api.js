// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * Delete an inquiry
 * Maps to: DELETE /api/inquiries/{id}
 * @param {string} inquiryId
 * @returns {Promise<void>}
 */
export function deleteInquiry(inquiryId) {
	return apiClient.delete(`/inquiries/${inquiryId}`);
}

/**
 * Get mutation key for delete inquiry
 */
export const getDeleteInquiryMutationKey = () => ["delete-inquiry"];

/**
 * React Query mutation hook for deleting inquiry
 * @param {import("react-query").UseMutationOptions<void, import("axios").AxiosError, string>} [options]
 */
export function useDeleteInquiryMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteInquiry,
		mutationKey: getDeleteInquiryMutationKey(),
		onSuccess: (data, inquiryId) => {
			queryClient.invalidateQueries({ queryKey: ["inquiries"] });
			queryClient.invalidateQueries({ queryKey: ["inquiry", inquiryId] });
			toast.success("Inquiry deleted successfully!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to delete inquiry. Please try again."),
			);
		},
		...options,
	});
}
