// @ts-check
import { useQuery } from "react-query";
import { INPUT_STALE_TIME } from "../../input.config";
import apiClient from "pages/api/AxiosInstance";

/**
 * @typedef {import("../../../../types/api").InquiryDto} InquiryDto
 */

/**
 * Get active inquiries available to current user
 * Maps to: GET /api/inquiries?status=Active
 * @returns {Promise<InquiryDto[]>}
 */
export function getActiveInquiries() {
	return apiClient.get("/inquiries", {
		params: { status: "Active", pageSize: 100 }
	});
}

/**
 * Get query key for active inquiries
 */
export const getActiveInquiriesQueryKey = () => ["active-inquiries"];

/**
 * Select/transform query data
 * Extract items from paginated response
 */
export const selectActiveInquiriesQueryData = response => {
	return response.items || [];
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
