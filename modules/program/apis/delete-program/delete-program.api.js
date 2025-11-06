// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

export function deleteProgram(programId) {
	return apiClient.delete(`/programs/${programId}`);
}

export const getDeleteProgramMutationKey = () => ["delete-program"];

export function useDeleteProgramMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteProgram,
		mutationKey: getDeleteProgramMutationKey(),
		onSuccess: (data, programId) => {
			queryClient.invalidateQueries({ queryKey: ["programs"] });
			queryClient.invalidateQueries({ queryKey: ["program", programId] });
			toast.success("Program deleted successfully!");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to delete program."));
		},
		...options,
	});
}
