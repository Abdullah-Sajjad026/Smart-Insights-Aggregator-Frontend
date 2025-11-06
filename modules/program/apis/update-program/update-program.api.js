// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").UpdateProgramRequest} UpdateProgramRequest
 */

/**
 * @typedef {import("../../../../types/api").ProgramDto} ProgramDto
 */

/**
 * @typedef {Object} UpdateProgramParams
 * @property {string} programId
 * @property {UpdateProgramRequest} data
 */

export function updateProgram({ programId, data }) {
	return apiClient.put(`/programs/${programId}`, data);
}

export const getUpdateProgramMutationKey = () => ["update-program"];

export function useUpdateProgramMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateProgram,
		mutationKey: getUpdateProgramMutationKey(),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["programs"] });
			queryClient.invalidateQueries({ queryKey: ["program", variables.programId] });
			toast.success("Program updated successfully!");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to update program."));
		},
		...options,
	});
}
