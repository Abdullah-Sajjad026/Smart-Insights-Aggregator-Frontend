// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").CreateDepartmentRequest} CreateDepartmentRequest
 */

/**
 * @typedef {import("../../../../types/api").DepartmentDto} DepartmentDto
 */

export function createDepartment(data) {
	return apiClient.post("/departments", data);
}

export const getCreateDepartmentMutationKey = () => ["create-department"];

export function useCreateDepartmentMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createDepartment,
		mutationKey: getCreateDepartmentMutationKey(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["departments"] });
			toast.success("Department created successfully!");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to create department."));
		},
		...options,
	});
}
