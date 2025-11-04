// @ts-check
import { useQuery } from "react-query";
import {
	delay,
	paginateData,
	mockInputs,
} from "modules/shared/shared.mock-data";
import { INPUT_STALE_TIME } from "../../input.config";

/**
 * Get all inputs for admin (mock API)
 * @param {Object} params
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.pageSize=25] - Items per page
 * @param {string} [params.inquiryId] - Filter by inquiry
 * @param {string} [params.sentiment] - Filter by sentiment
 * @param {string} [params.importance] - Filter by importance
 * @returns {Promise<Object>}
 */
export async function getAllInputs({
	page = 1,
	pageSize = 25,
	inquiryId,
	sentiment,
	importance,
} = {}) {
	// Simulate API delay
	await delay(900);

	// Filter inputs
	let filteredInputs = [...mockInputs];

	if (inquiryId) {
		filteredInputs = filteredInputs.filter(input => input.inquiryId === inquiryId);
	}

	if (sentiment) {
		filteredInputs = filteredInputs.filter(
			input => input.aiAnalysis?.sentiment === sentiment,
		);
	}

	if (importance) {
		filteredInputs = filteredInputs.filter(
			input => input.aiAnalysis?.importance === importance,
		);
	}

	const paginatedData = paginateData(filteredInputs, page, pageSize);

	return {
		success: true,
		...paginatedData,
	};
}

/**
 * Get query key for all inputs
 */
export const getAllInputsQueryKey = ({
	page,
	pageSize,
	inquiryId,
	sentiment,
	importance,
} = {}) => ["all-inputs", { page, pageSize, inquiryId, sentiment, importance }];

/**
 * Select/transform query data
 */
export const selectAllInputsQueryData = response => {
	return response;
};

/**
 * React Query hook for getting all inputs (admin)
 * @param {Object} params
 * @param {number} [params.page=1]
 * @param {number} [params.pageSize=25]
 * @param {string} [params.inquiryId]
 * @param {string} [params.sentiment]
 * @param {string} [params.importance]
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
