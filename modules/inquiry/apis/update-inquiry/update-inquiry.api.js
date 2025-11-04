// @ts-check
import { useMutation } from "react-query";
import { delay } from "modules/shared/shared.mock-data";

/**
 * Update an inquiry (mock API)
 * @param {Object} params
 * @param {string} params.inquiryId
 * @param {Object} params.data - Updated inquiry data
 * @returns {Promise<Object>}
 */
export async function updateInquiry({ inquiryId, data }) {
	// Simulate API delay
	await delay(1000);

	// Mock successful response
	const mockResponse = {
		success: true,
		data: {
			id: inquiryId,
			...data,
			updatedAt: new Date().toISOString(),
		},
		message: "Inquiry updated successfully!",
	};

	return mockResponse;
}

/**
 * Get mutation key for update inquiry
 */
export const getUpdateInquiryMutationKey = () => ["update-inquiry"];

/**
 * React Query mutation hook for updating inquiry
 * @param {Object} props - Mutation options
 */
export function useUpdateInquiryMutation(props = {}) {
	return useMutation({
		mutationFn: updateInquiry,
		mutationKey: getUpdateInquiryMutationKey(),
		...props,
	});
}
