// @ts-check

import apiClient from "pages/api/AxiosInstance";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * Delete a user
 * Maps to: DELETE /api/users/{id}
 * @param {string} id - User ID
 * @returns {Promise<void>}
 */
export function deleteUser(id) {
	return apiClient.delete(`/users/${id}`);
}

/**
 * Generate a mutation key for the API
 */
export const getDeleteUserMutationKey = () => ["users", "delete"];

/**
 * Delete user mutation
 * @param {import("react-query").UseMutationOptions<void, import("axios").AxiosError, string>} [options]
 */
export function useDeleteUserMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteUser,
		mutationKey: getDeleteUserMutationKey(),
		onSuccess: (data, id) => {
			// Invalidate users list and specific user query
			queryClient.invalidateQueries({ queryKey: ["users"] });
			queryClient.invalidateQueries({ queryKey: ["user", id] });
			toast.success("User deleted successfully");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to delete user. Please try again."),
			);
		},
		...options,
	});
}
