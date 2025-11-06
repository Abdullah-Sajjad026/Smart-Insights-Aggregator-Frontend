// @ts-check

import apiClient from "pages/api/AxiosInstance";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").UpdateUserRequest} UpdateUserRequest
 */

/**
 * @typedef {import("../../../../types/api").UserDto} UserDto
 */

/**
 * @typedef {Object} UpdateUserParams
 * @property {string} id - User ID
 * @property {UpdateUserRequest} data - Update data
 */

/**
 * Update a user
 * Maps to: PUT /api/users/{id}
 * @param {UpdateUserParams} params
 * @returns {Promise<UserDto>}
 */
export function updateUser({ id, data }) {
	return apiClient.put(`/users/${id}`, data);
}

/**
 * Generate a mutation key for the API
 */
export const getUpdateUserMutationKey = () => ["users", "update"];

/**
 * Update user mutation
 * @param {import("react-query").UseMutationOptions<UserDto, import("axios").AxiosError, UpdateUserParams>} [options]
 */
export function useUpdateUserMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateUser,
		mutationKey: getUpdateUserMutationKey(),
		onSuccess: (data, variables) => {
			// Invalidate users list and specific user query
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
			toast.success("User updated successfully");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to update user. Please try again."),
			);
		},
		...options,
	});
}
