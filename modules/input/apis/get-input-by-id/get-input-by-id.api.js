// @ts-check
import { useQuery } from "react-query";
import { INPUT_STALE_TIME } from "../../input.config";
import apiClient from "pages/api/AxiosInstance";

/**
 * @typedef {import("../../../../types/api").InputDto} InputDto
 */

/**
 * Get input by ID with full details
 * Maps to: GET /api/inputs/{id}
 * @param {string} inputId
 * @returns {Promise<InputDto>}
 */
export function getInputById(inputId) {
	return apiClient.get(`/inputs/${inputId}`);
}

/**
 * Get query key for input by ID
 */
export const getInputByIdQueryKey = (inputId) => ["input", inputId];

/**
 * Select/transform query data
 */
export const selectInputByIdQueryData = (response) => response;

/**
 * React Query hook for getting input by ID
 * @param {string} inputId
 * @param {Object} [queryProps]
 */
export function useGetInputById(inputId, queryProps = {}) {
	return useQuery({
		queryFn: () => getInputById(inputId),
		queryKey: getInputByIdQueryKey(inputId),
		select: selectInputByIdQueryData,
		staleTime: INPUT_STALE_TIME,
		enabled: !!inputId,
		...queryProps,
	});
}
