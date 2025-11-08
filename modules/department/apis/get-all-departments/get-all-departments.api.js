// @ts-check
import { useQuery } from "react-query";
import { DEPARTMENT_STALE_TIME } from "../../department.config";
import apiClient from "pages/api/AxiosInstance";

/**
 * @typedef {import("../../../../types/api").DepartmentDto} DepartmentDto
 */

/**
 * @typedef {import("../../../../types/api").PaginatedResult} PaginatedResult
 */

export function getAllDepartments(params = {}) {
	return apiClient.get("/departments", { params });
}

export const getGetAllDepartmentsQueryKey = (params) => ["departments", "all", params];
export const selectGetAllDepartmentsQueryData = (response) => ({
	data: response.items,
	pagination: {
		totalItems: response.totalCount,
		pageNumber: response.pageNumber,
		pageSize: response.pageSize,
		totalPages: response.totalPages,
	},
});

export function useGetAllDepartments(params = {}, queryProps = {}) {
	return useQuery({
		queryFn: () => getAllDepartments(params),
		queryKey: getGetAllDepartmentsQueryKey(params),
		select: selectGetAllDepartmentsQueryData,
		staleTime: DEPARTMENT_STALE_TIME,
		...queryProps,
	});
}
