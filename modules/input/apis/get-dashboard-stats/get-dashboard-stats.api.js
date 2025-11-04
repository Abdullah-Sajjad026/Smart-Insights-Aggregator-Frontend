// @ts-check
import { useQuery } from "react-query";
import { delay, mockDashboardStats } from "modules/shared/shared.mock-data";
import { INPUT_STALE_TIME } from "../../input.config";

/**
 * Get dashboard statistics (mock API)
 * @returns {Promise<Object>}
 */
export async function getDashboardStats() {
	// Simulate API delay
	await delay(700);

	return {
		success: true,
		data: mockDashboardStats,
	};
}

/**
 * Get query key for dashboard stats
 */
export const getDashboardStatsQueryKey = () => ["dashboard-stats"];

/**
 * Select/transform query data
 */
export const selectDashboardStatsQueryData = response => {
	return response.data;
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
