// @ts-check
import { useMutation } from "react-query";
import { delay } from "modules/shared/shared.mock-data";

/**
 * Delete an inquiry (mock API)
 * @param {string} inquiryId
 * @returns {Promise<Object>}
 */
export async function deleteInquiry(inquiryId) {
	// Simulate API delay
	await delay(800);

	// Mock successful response
	return {
		success: true,
		message: "Inquiry deleted successfully!",
	};
}

/**
 * Get mutation key for delete inquiry
 */
export const getDeleteInquiryMutationKey = () => ["delete-inquiry"];

/**
 * React Query mutation hook for deleting inquiry
 * @param {Object} props - Mutation options
 */
export function useDeleteInquiryMutation(props = {}) {
	return useMutation({
		mutationFn: deleteInquiry,
		mutationKey: getDeleteInquiryMutationKey(),
		...props,
	});
}
