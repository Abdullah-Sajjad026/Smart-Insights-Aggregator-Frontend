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
export const selectDashboardStatsQueryData = (response) => response;

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
