// @ts-check
import { useQuery } from "react-query";
import { DEPARTMENT_STALE_TIME } from "../../department.config";
import apiClient from "pages/api/AxiosInstance";

/**
 * @typedef {import("../../../../types/api").DepartmentDto} DepartmentDto
 */

export function getDepartmentById(departmentId) {
	return apiClient.get(`/departments/${departmentId}`);
}

export const getDepartmentByIdQueryKey = (departmentId) => ["department", departmentId];
export const selectDepartmentByIdQueryData = (response) => response;

export function useGetDepartmentById(departmentId, queryProps = {}) {
	return useQuery({
		queryFn: () => getDepartmentById(departmentId),
		queryKey: getDepartmentByIdQueryKey(departmentId),
		select: selectDepartmentByIdQueryData,
		staleTime: DEPARTMENT_STALE_TIME,
		enabled: !!departmentId,
		...queryProps,
	});
}
