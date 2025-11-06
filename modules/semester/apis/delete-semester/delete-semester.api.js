// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

export function deleteSemester(semesterId) {
	return apiClient.delete(`/semesters/${semesterId}`);
}

export const getDeleteSemesterMutationKey = () => ["delete-semester"];

export function useDeleteSemesterMutation(options = {}) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteSemester,
		mutationKey: getDeleteSemesterMutationKey(),
		onSuccess: (data, semesterId) => {
			queryClient.invalidateQueries({ queryKey: ["semesters"] });
			queryClient.invalidateQueries({ queryKey: ["semester", semesterId] });
			toast.success("Semester deleted successfully!");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to delete semester."));
		},
		...options,
	});
}
