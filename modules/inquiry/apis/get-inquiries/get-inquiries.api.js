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
 * Get all inquiries
 * Maps to: GET /api/inquiries
 * @param {Object} params
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.pageSize=25] - Items per page
 * @param {string} [params.status] - Filter by status
 * @param {string} [params.departmentId] - Filter by department
 * @param {string} [params.createdById] - Filter by creator
 * @returns {Promise<PaginatedResult<InquiryDto>>}
 */
export function getInquiries({
	page = 1,
	pageSize = 25,
	status,
	departmentId,
	createdById,
} = {}) {
	return apiClient.get("/inquiries", {
		params: { page, pageSize, status, departmentId, createdById },
	});
}

/**
 * Get query key for inquiries
 */
export const getInquiriesQueryKey = ({ page, pageSize, status } = {}) => [
	"inquiries",
	{ page, pageSize, status },
];

/**
 * Select/transform query data
 * Transform PaginatedResult to match frontend expectations
 */
export const selectInquiriesQueryData = response => ({
	data: response.items,
	pagination: {
		totalItems: response.totalCount,
		pageNumber: response.pageNumber,
		pageSize: response.pageSize,
		totalPages: response.totalPages,
	},
});

/**
 * React Query hook for getting inquiries
 * @param {Object} params
 * @param {number} [params.page=1]
 * @param {number} [params.pageSize=25]
 * @param {string} [params.status]
 * @param {Object} queryProps - Additional query options
 */
export function useGetInquiries(params = {}, queryProps = {}) {
	return useQuery({
		queryFn: () => getInquiries(params),
		queryKey: getInquiriesQueryKey(params),
		select: selectInquiriesQueryData,
		staleTime: INQUIRY_STALE_TIME,
		...queryProps,
	});
}
