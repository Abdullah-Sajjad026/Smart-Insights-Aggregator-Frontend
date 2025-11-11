// @ts-check
import { useQuery } from "react-query";
import { MY_INPUTS_STALE_TIME } from "../../input.config";
import apiClient from "pages/api/AxiosInstance";

/**
 * @typedef {import("../../../../types/api").InputDto} InputDto
 */

/**
 * @typedef {import("../../../../types/api").PaginatedResult} PaginatedResult
 */

/**
 * Get current user's inputs (student's own feedback)
 * Maps to: GET /api/inputs/my-inputs
 * @param {Object} params
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.pageSize=25] - Items per page
 * @returns {Promise<PaginatedResult<InputDto>>}
 */
export function getMyInputs({ page = 1, pageSize = 25 } = {}) {
	return apiClient.get("/inputs/my-inputs", {
		params: { page, pageSize },
	});
}

/**
 * Get query key for my inputs
 */
export const getMyInputsQueryKey = (params) => ["my-inputs", params];

/**
 * Select/transform query data
 * Note: Backend returns simple array, not paginated result
 */
export const selectMyInputsQueryData = (response) => {
	// Backend returns array directly in response (after axios interceptor extracts it)
	const items = Array.isArray(response) ? response : [];

	return {
		data: items,
		pagination: {
			totalItems: items.length,
			pageNumber: 1,
			pageSize: items.length,
			totalPages: 1,
		},
	};
};

/**
 * React Query hook for getting user's inputs
 * @param {Object} params
 * @param {number} [params.page=1]
 * @param {number} [params.pageSize=25]
 * @param {Object} queryProps - Additional query options
 */
export function useGetMyInputs(params = {}, queryProps = {}) {
	return useQuery({
		queryFn: () => getMyInputs(params),
		queryKey: getMyInputsQueryKey(params),
		select: selectMyInputsQueryData,
		staleTime: MY_INPUTS_STALE_TIME,
		...queryProps,
	});
}
