// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").CreateProgramRequest} CreateProgramRequest
 */

/**
 * @typedef {import("../../../../types/api").ProgramDto} ProgramDto
 */

export function createProgram(data) {
	return apiClient.post("/programs", data);
}

export const getCreateProgramMutationKey = () => ["create-program"];

export function useCreateProgramMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createProgram,
		mutationKey: getCreateProgramMutationKey(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["programs"] });
			toast.success("Program created successfully!");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to create program."));
		},
		...options,
	});
}
