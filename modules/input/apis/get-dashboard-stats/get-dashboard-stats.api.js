// @ts-check
import { useQuery } from "react-query";
import { INPUT_STALE_TIME } from "../../input.config";
import apiClient from "pages/api/AxiosInstance";

/**
 * @typedef {import("../../../../types/api").InputStatsDto} InputStatsDto
 */

/**
 * Get input statistics for dashboard
 * Maps to: GET /api/inputs/stats
 * @returns {Promise<InputStatsDto>}
 */
export function getDashboardStats() {
	return apiClient.get("/inputs/stats");
}

/**
 * Get query key for dashboard stats
 */
export const getDashboardStatsQueryKey = () => ["dashboard-stats"];

/**
 * Select/transform query data
 */
export const selectDashboardStatsQueryData = (response) => {
	if (!response) return null;

	const { byType = {}, byStatus = {}, bySentiment = {}, averageQualityScore = 0 } = response;

	// Calculate totals
	const totalInputs = Object.values(byType).reduce((a, b) => a + b, 0);

	return {
		totalInputs,
		generalInputs: byType["General"] || 0,
		inquiryLinkedInputs: byType["InquiryLinked"] || 0,

		// Status counts
		pendingInputs: (byStatus["Pending"] || 0) + (byStatus["Processing"] || 0),
		reviewedInputs: byStatus["Reviewed"] || 0,
		resolvedInputs: byStatus["Processed"] || 0,

		// Sentiment counts
		positiveCount: bySentiment["Positive"] || 0,
		neutralCount: bySentiment["Neutral"] || 0,
		negativeCount: bySentiment["Negative"] || 0,

		// Average quality score
		averageQualityScore
	};
};

/**
 * React Query hook for getting dashboard stats
 * @param {Object} props
 * @param {Object} queryProps - Additional query options
 */
export function useGetDashboardStats(props = {}, queryProps = {}) {
	return useQuery({
		queryFn: getDashboardStats,
		queryKey: getDashboardStatsQueryKey(),
		select: selectDashboardStatsQueryData,
		staleTime: INPUT_STALE_TIME,
		...queryProps,
	});
}
