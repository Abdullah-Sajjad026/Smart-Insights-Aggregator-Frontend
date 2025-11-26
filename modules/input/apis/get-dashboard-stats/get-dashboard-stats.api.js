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

	const { ByType = {}, ByStatus = {}, BySentiment = {}, AverageQualityScore = 0 } = response;

	// Calculate totals
	const totalInputs = Object.values(ByType).reduce((a, b) => a + b, 0);

	return {
		totalInputs,
		generalInputs: ByType.General || 0,
		inquiryLinkedInputs: ByType.InquiryResponse || 0,

		// Status counts
		pendingInputs: ByStatus.Pending || 0,
		reviewedInputs: ByStatus.UnderReview || 0,
		resolvedInputs: ByStatus.Resolved || 0,

		// Sentiment counts
		positiveCount: BySentiment.Positive || 0,
		neutralCount: BySentiment.Neutral || 0,
		negativeCount: BySentiment.Negative || 0,

		// Average quality score
		averageQualityScore: AverageQualityScore
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
