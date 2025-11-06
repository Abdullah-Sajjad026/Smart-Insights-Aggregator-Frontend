// @ts-check
import { useQuery } from "react-query";
import { INQUIRY_STALE_TIME } from "../../inquiry.config";
import apiClient from "pages/api/AxiosInstance";

/**
 * @typedef {import("../../../../types/api").InquiryDto} InquiryDto
 */

/**
 * Get inquiry by ID
 * Maps to: GET /api/inquiries/{id}
 * @param {string} inquiryId
 * @returns {Promise<InquiryDto>}
 */
export function getInquiryById(inquiryId) {
	return apiClient.get(`/inquiries/${inquiryId}`);
}

/**
 * Get query key for inquiry by ID
 */
export const getInquiryByIdQueryKey = (inquiryId) => ["inquiry", inquiryId];

/**
 * Select/transform query data
 */
export const selectInquiryByIdQueryData = (response) => response;

/**
 * React Query hook for getting inquiry by ID
 * @param {string} inquiryId
 * @param {Object} [queryProps]
 */
export function useGetInquiryById(inquiryId, queryProps = {}) {
	return useQuery({
		queryFn: () => getInquiryById(inquiryId),
		queryKey: getInquiryByIdQueryKey(inquiryId),
		select: selectInquiryByIdQueryData,
		staleTime: INQUIRY_STALE_TIME,
		enabled: !!inquiryId,
		...queryProps,
	});
}
