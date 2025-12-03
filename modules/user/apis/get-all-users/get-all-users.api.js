// @ts-check

import { userStaleTime } from "modules/user/user.config";
import apiClient from "pages/api/AxiosInstance";
import { useQuery } from "react-query";

/**
 * @typedef {Object} GetAllUsersParams
 * @property {number} [page] - Page number
 * @property {number} [pageSize] - Items per page
 * @property {string} [role] - Filter by role (Admin/Student)
 * @property {string} [departmentId] - Filter by department
 * @property {string} [programId] - Filter by program
 * @property {string} [semesterId] - Filter by semester
 * @property {boolean} [isActive] - Filter by active status
 * @property {string} [searchTerm] - Search in email or fullName
 */

/**
 * @typedef {import("../../../../types/api").PaginatedResult} PaginatedResult
 */

/**
 * @typedef {import("../../../../types/api").UserDto} UserDto
 */

/**
 * Get all users (paginated)
 * Maps to: GET /api/users
 * @param {GetAllUsersParams} [params]
 * @returns {Promise<PaginatedResult<UserDto>>}
 */
export function getAllUsers(params = {}) {
	return apiClient.get("/users", { params });
}

/**
 * Generate a query key for the API
 * @param {GetAllUsersParams} [params]
 */
export const getGetAllUsersQueryKey = (params) => ["users", "all", params];

/**
 * Select the data from the response
 * Transform PaginatedResult to match frontend expectations
 * @param {PaginatedResult<UserDto>} response
 */
export const selectGetAllUsersQueryData = (response) => ({
	data: response?.items || [],
	pagination: {
		totalItems: response?.totalCount || 0,
		pageNumber: response?.pageNumber || 1,
		pageSize: response?.pageSize || 10,
		totalPages: response?.totalPages || 1,
	},
});

/**
 * Get all users (paginated)
 * @param {GetAllUsersParams} [params]
 * @param {import("react-query").UseQueryOptions} [queryProps]
 */
export function useGetAllUsers(params = {}, queryProps = {}) {
	return useQuery({
		queryFn: () => getAllUsers(params),
		queryKey: getGetAllUsersQueryKey(params),
		select: selectGetAllUsersQueryData,
		staleTime: userStaleTime,
		...queryProps,
	});
}
