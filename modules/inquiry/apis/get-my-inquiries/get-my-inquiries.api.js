// @ts-check
import { useQuery } from "react-query";
import { INQUIRY_STALE_TIME } from "../../inquiry.config";
import apiClient from "pages/api/AxiosInstance";

/**
 * @typedef {import("../../../../types/api").InquiryDto} InquiryDto
 */

/**
 * @typedef {import("../../../../types/api").PaginatedResult} PaginatedResult
 */

/**
 * Get inquiries for current student (filtered by department/program/semester)
 * Maps to: GET /api/inquiries/my-inquiries
 * @param {Object} params
 * @param {number} [params.page=1]
 * @param {number} [params.pageSize=25]
 * @param {string} [params.status]
 * @returns {Promise<PaginatedResult<InquiryDto>>}
 */
export function getMyInquiries({ page = 1, pageSize = 25, status } = {}) {
	return apiClient.get("/inquiries/my-inquiries", {
		params: { page, pageSize, status },
	});
}

/**
 * Get query key for my inquiries
 */
export const getMyInquiriesQueryKey = (params) => ["my-inquiries", params];

/**
 * Select/transform query data
 */
export const selectMyInquiriesQueryData = (response) => ({
	data: response.items,
	pagination: {
		totalItems: response.totalCount,
		pageNumber: response.pageNumber,
		pageSize: response.pageSize,
		totalPages: response.totalPages,
	},
});

/**
 * React Query hook for getting my inquiries
 * @param {Object} params
 * @param {Object} [queryProps]
 */
export function useGetMyInquiries(params = {}, queryProps = {}) {
	return useQuery({
		queryFn: () => getMyInquiries(params),
		queryKey: getMyInquiriesQueryKey(params),
		select: selectMyInquiriesQueryData,
		staleTime: INQUIRY_STALE_TIME,
		...queryProps,
	});
}
