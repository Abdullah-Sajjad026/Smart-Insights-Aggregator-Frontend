// @ts-check
import { useQuery } from "react-query";
import { delay, mockInquiries } from "modules/shared/shared.mock-data";
import { INPUT_STALE_TIME } from "../../input.config";

/**
 * Get inquiry by ID (mock API)
 * @param {string} inquiryId
 * @returns {Promise<Object>}
 */
export async function getInquiryById(inquiryId) {
	// Simulate API delay
	await delay(500);

	// Mock: Find inquiry by ID
	const inquiry = mockInquiries.find(inq => inq.id === inquiryId);

	if (!inquiry) {
		throw new Error("Inquiry not found");
	}

	return {
		success: true,
		data: inquiry,
	};
}

/**
 * Get query key for inquiry by ID
 */
export const getInquiryByIdQueryKey = inquiryId => ["inquiry", inquiryId];

/**
 * Select/transform query data
 */
export const selectInquiryByIdQueryData = response => {
	return response.data;
};

/**
 * React Query hook for getting inquiry by ID
 * @param {string} inquiryId
 * @param {Object} queryProps - Additional query options
 */
export function useGetInquiryById(inquiryId, queryProps = {}) {
	return useQuery({
		queryFn: () => getInquiryById(inquiryId),
		queryKey: getInquiryByIdQueryKey(inquiryId),
		select: selectInquiryByIdQueryData,
		staleTime: INPUT_STALE_TIME,
		enabled: !!inquiryId, // Only run if inquiryId is provided
		...queryProps,
	});
}
