// @ts-check
import { useQuery } from "react-query";
import { delay, mockInquiries } from "modules/shared/shared.mock-data";
import { INPUT_STALE_TIME } from "../../input.config";

/**
 * Get active inquiries available to current user (mock API)
 * @returns {Promise<Object>}
 */
export async function getActiveInquiries() {
	// Simulate API delay
	await delay(600);

	// Mock: Filter only active inquiries
	const activeInquiries = mockInquiries.filter(
		inquiry => inquiry.status === "ACTIVE",
	);

	return {
		success: true,
		data: activeInquiries,
		total: activeInquiries.length,
	};
}

/**
 * Get query key for active inquiries
 */
export const getActiveInquiriesQueryKey = () => ["active-inquiries"];

/**
 * Select/transform query data
 */
export const selectActiveInquiriesQueryData = response => {
	return response.data;
};

/**
 * React Query hook for getting active inquiries
 * @param {Object} props
 * @param {Object} queryProps - Additional query options
 */
export function useGetActiveInquiries(props = {}, queryProps = {}) {
	return useQuery({
		queryFn: getActiveInquiries,
		queryKey: getActiveInquiriesQueryKey(),
		select: selectActiveInquiriesQueryData,
		staleTime: INPUT_STALE_TIME,
		...queryProps,
	});
}
