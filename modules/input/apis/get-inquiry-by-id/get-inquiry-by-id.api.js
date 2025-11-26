// @ts-check
import { useQuery } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { INPUT_STALE_TIME } from "../../input.config";
export async function getInquiryById(inquiryId) {
	const response = await apiClient.get(`/inquiries/${inquiryId}`);
	return response;
}

/**
 * Get query key for inquiry by ID
 */
export const getInquiryByIdQueryKey = inquiryId => ["inquiry", inquiryId];

/**
 * Select/transform query data
 */
export const selectInquiryByIdQueryData = response => {
	return response;
};

/**
 * React Query hook for getting inquiry by ID
 * @param {string} inquiryId
 * @param {Object} queryProps - Additional query options
 */
export function useGetInquiryById(inquiryId, queryProps = {}) {
	return useQuery({
		queryFn: () => getInquiryById(inquiryId),
		queryKey: getInquiryByIdQueryKey(inquiryId),
		select: selectInquiryByIdQueryData,
		staleTime: INPUT_STALE_TIME,
		enabled: !!inquiryId, // Only run if inquiryId is provided
		...queryProps,
	});
}
