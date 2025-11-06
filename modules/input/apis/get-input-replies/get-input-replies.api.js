// @ts-check
import { useQuery } from "react-query";
import { INPUT_STALE_TIME } from "../../input.config";
import apiClient from "pages/api/AxiosInstance";

/**
 * @typedef {import("../../../../types/api").InputReplyDto} InputReplyDto
 */

/**
 * Get replies for an input (conversation thread)
 * Maps to: GET /api/inputs/{id}/replies
 * @param {string} inputId
 * @returns {Promise<InputReplyDto[]>}
 */
export function getInputReplies(inputId) {
	return apiClient.get(`/inputs/${inputId}/replies`);
}

/**
 * Get query key for input replies
 */
export const getInputRepliesQueryKey = (inputId) => ["input-replies", inputId];

/**
 * Select/transform query data
 */
export const selectInputRepliesQueryData = (response) => response;

/**
 * React Query hook for getting input replies
 * @param {string} inputId
 * @param {Object} [queryProps]
 */
export function useGetInputReplies(inputId, queryProps = {}) {
	return useQuery({
		queryFn: () => getInputReplies(inputId),
		queryKey: getInputRepliesQueryKey(inputId),
		select: selectInputRepliesQueryData,
		staleTime: INPUT_STALE_TIME,
		enabled: !!inputId,
		...queryProps,
	});
}
