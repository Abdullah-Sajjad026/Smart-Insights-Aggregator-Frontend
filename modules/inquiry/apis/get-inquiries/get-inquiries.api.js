// @ts-check
import { useQuery } from "react-query";
import {
	delay,
	paginateData,
	mockInquiries,
} from "modules/shared/shared.mock-data";
import { INQUIRY_STALE_TIME } from "../../inquiry.config";

/**
 * Get all inquiries (mock API)
 * @param {Object} params
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.pageSize=25] - Items per page
 * @param {string} [params.status] - Filter by status
 * @returns {Promise<Object>}
 */
export async function getInquiries({
	page = 1,
	pageSize = 25,
	status,
} = {}) {
	// Simulate API delay
	await delay(800);

	// Filter by status if provided
	let filteredInquiries = [...mockInquiries];
	if (status) {
		filteredInquiries = filteredInquiries.filter(
			inq => inq.status === status,
		);
	}

	const paginatedData = paginateData(filteredInquiries, page, pageSize);

	return {
		success: true,
		...paginatedData,
	};
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
 */
export const selectInquiriesQueryData = response => {
	return response;
};

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
