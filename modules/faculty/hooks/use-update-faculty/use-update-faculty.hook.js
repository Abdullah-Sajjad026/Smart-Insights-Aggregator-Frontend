// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").UpdateFacultyRequest} UpdateFacultyRequest
 */

/**
 * @typedef {import("../../../../types/api").FacultyDto} FacultyDto
 */

/**
 * @typedef {Object} UpdateFacultyParams
 * @property {string} facultyId
 * @property {UpdateFacultyRequest} data
 */

export function updateFaculty({ facultyId, data }) {
	return apiClient.put(`/faculties/${facultyId}`, data);
}

export const getUpdateFacultyMutationKey = () => ["update-faculty"];

export function useUpdateFacultyMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateFaculty,
		mutationKey: getUpdateFacultyMutationKey(),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["faculties"] });
			queryClient.invalidateQueries({ queryKey: ["faculty", variables.facultyId] });
			toast.success("Faculty updated successfully!");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to update faculty."));
		},
		...options,
	});
}
