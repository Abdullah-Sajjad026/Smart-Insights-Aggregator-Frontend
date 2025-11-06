// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

export function createSemester(data) {
	return apiClient.post("/semesters", data);
}

export const getCreateSemesterMutationKey = () => ["create-semester"];

export function useCreateSemesterMutation(options = {}) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createSemester,
		mutationKey: getCreateSemesterMutationKey(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["semesters"] });
			toast.success("Semester created successfully!");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to create semester."));
		},
		...options,
	});
}
