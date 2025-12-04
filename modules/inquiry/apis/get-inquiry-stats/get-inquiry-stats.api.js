// @ts-check
import { useQuery } from "react-query";
import { INQUIRY_STALE_TIME } from "../../inquiry.config";
import apiClient from "pages/api/AxiosInstance";

/**
 * @typedef {import("../../../../types/api").InquiryStatsDto} InquiryStatsDto
 */

/**
 * Get inquiry statistics
 * Maps to: GET /api/inquiries/stats
 * @returns {Promise<InquiryStatsDto>}
 */
export function getInquiryStats() {
	return apiClient.get("/inquiries/stats");
}

/**
 * Get query key for inquiry stats
 */
export const getInquiryStatsQueryKey = () => ["inquiries", "stats"];

/**
 * Select/transform query data
 */
export const selectInquiryStatsQueryData = response => {
	if (!response) return null;
	return {
		totalInquiries: response.total || 0,
		closedInquiries: response.byStatus?.["closed"] || 0,
		activeInquiries: response.byStatus?.["active"] || 0,
	};
};

/**
 * React Query hook for getting inquiry statistics
 * @param {Object} [queryProps]
 */
export function useGetInquiryStats(queryProps = {}) {
	return useQuery({
		queryFn: getInquiryStats,
		queryKey: getInquiryStatsQueryKey(),
		select: selectInquiryStatsQueryData,
		staleTime: INQUIRY_STALE_TIME,
		...queryProps,
	});
}
