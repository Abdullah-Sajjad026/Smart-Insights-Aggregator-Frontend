// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").UpdateDepartmentRequest} UpdateDepartmentRequest
 */

/**
 * @typedef {import("../../../../types/api").DepartmentDto} DepartmentDto
 */

/**
 * @typedef {Object} UpdateDepartmentParams
 * @property {string} departmentId
 * @property {UpdateDepartmentRequest} data
 */

export function updateDepartment({ departmentId, data }) {
	return apiClient.put(`/departments/${departmentId}`, data);
}

export const getUpdateDepartmentMutationKey = () => ["update-department"];

export function useUpdateDepartmentMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateDepartment,
		mutationKey: getUpdateDepartmentMutationKey(),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["departments"] });
			queryClient.invalidateQueries({ queryKey: ["department", variables.departmentId] });
			toast.success("Department updated successfully!");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to update department."));
		},
		...options,
	});
}
