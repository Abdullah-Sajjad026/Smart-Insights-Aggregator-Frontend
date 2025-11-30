// @ts-check

import { userStaleTime } from "modules/user/user.config";
import apiClient from "pages/api/AxiosInstance";
import { useQuery } from "react-query";

/**
 * @typedef {import("../../../../types/api").UserStatsDto} UserStatsDto
 */

/**
 * Get user statistics
 * Maps to: GET /api/users/stats
 * @returns {Promise<UserStatsDto>}
 */
export function getUserStats() {
	return apiClient.get("/users/stats");
}

/**
 * Generate a query key for the API
 */
export const getGetUserStatsQueryKey = () => ["users", "stats"];

/**
 * Select the data from the response
 * @param {UserStatsDto} response
 */
export const selectGetUserStatsQueryData = (response) => {
	if (!response) return null;
	return {
		totalUsers: response.totalUsers || 0,
		totalAdmins: response.byRole?.["Admin"] || 0,
		totalStudents: response.byRole?.["Student"] || 0,
	};
};

/**
 * Get user statistics
 * @param {import("react-query").UseQueryOptions} [queryProps]
 */
export function useGetUserStats(queryProps = {}) {
	return useQuery({
		queryFn: getUserStats,
		queryKey: getGetUserStatsQueryKey(),
		select: selectGetUserStatsQueryData,
		staleTime: userStaleTime,
		...queryProps,
	});
}
