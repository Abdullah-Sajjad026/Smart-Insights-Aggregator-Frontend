// @ts-check
import { useQuery } from "react-query";
import {
	delay,
	paginateData,
	mockInputs,
} from "modules/shared/shared.mock-data";
import { MY_INPUTS_STALE_TIME } from "../../input.config";

/**
 * Get current user's inputs (mock API)
 * @param {Object} params
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.pageSize=25] - Items per page
 * @returns {Promise<Object>}
 */
export async function getMyInputs({ page = 1, pageSize = 25 } = {}) {
	// Simulate API delay
	await delay(800);

	// Mock: Filter inputs for current user (in real app, backend handles this)
	const userInputs = mockInputs.slice(0, 3); // Mock: show first 3 as user's inputs

	const paginatedData = paginateData(userInputs, page, pageSize);

	return {
		success: true,
		...paginatedData,
	};
}

/**
 * Get query key for my inputs
 */
export const getMyInputsQueryKey = ({ page, pageSize } = {}) => [
	"my-inputs",
	{ page, pageSize },
];

/**
 * Select/transform query data
 */
export const selectMyInputsQueryData = response => {
	return response;
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
