// @ts-check
import { useQuery } from "react-query";
import { INPUT_STALE_TIME } from "../../input.config";
import apiClient from "pages/api/AxiosInstance";

/**
 * @typedef {import("../../../../types/api").InputDto} InputDto
 */

/**
 * @typedef {import("../../../../types/api").PaginatedResult} PaginatedResult
 */

/**
 * @typedef {import("../../../../types/api").InputFilterDto} InputFilterDto
 */

/**
 * Get all inputs with filtering (admin)
 * Maps to: GET /api/inputs/filter
 * @param {InputFilterDto} params - Filter parameters
 * @returns {Promise<PaginatedResult<InputDto>>}
 */
export function getAllInputs(params = {}) {
	return apiClient.get("/inputs/filter", { params });
}

/**
 * Get query key for all inputs
 */
export const getAllInputsQueryKey = (params) => ["all-inputs", params];

/**
 * Select/transform query data
 */
export const selectAllInputsQueryData = (response) => response;

/**
 * React Query hook for getting all inputs (admin)
 * @param {InputFilterDto} params - Filter parameters
 * @param {Object} queryProps - Additional query options
 */
export function useGetAllInputs(params = {}, queryProps = {}) {
	return useQuery({
		queryFn: () => getAllInputs(params),
		queryKey: getAllInputsQueryKey(params),
		select: selectAllInputsQueryData,
		staleTime: INPUT_STALE_TIME,
		...queryProps,
	});
}
