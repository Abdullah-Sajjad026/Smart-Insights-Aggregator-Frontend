// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

export function deleteDepartment(departmentId) {
	return apiClient.delete(`/departments/${departmentId}`);
}

export const getDeleteDepartmentMutationKey = () => ["delete-department"];

export function useDeleteDepartmentMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteDepartment,
		mutationKey: getDeleteDepartmentMutationKey(),
		onSuccess: (data, departmentId) => {
			queryClient.invalidateQueries({ queryKey: ["departments"] });
			queryClient.invalidateQueries({ queryKey: ["department", departmentId] });
			toast.success("Department deleted successfully!");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to delete department."));
		},
		...options,
	});
}
