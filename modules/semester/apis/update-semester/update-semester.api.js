// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

export function updateSemester({ semesterId, data }) {
	return apiClient.put(`/semesters/${semesterId}`, data);
}

export const getUpdateSemesterMutationKey = () => ["update-semester"];

export function useUpdateSemesterMutation(options = {}) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateSemester,
		mutationKey: getUpdateSemesterMutationKey(),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["semesters"] });
			queryClient.invalidateQueries({ queryKey: ["semester", variables.semesterId] });
			toast.success("Semester updated successfully!");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to update semester."));
		},
		...options,
	});
}
