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
	data: response,
	pagination: {
		totalItems: response?.length || 0,
		pageNumber: 1,
		pageSize: response?.length || 0,
		totalPages: 1,
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
