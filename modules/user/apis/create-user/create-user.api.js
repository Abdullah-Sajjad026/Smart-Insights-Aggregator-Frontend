// @ts-check

import apiClient from "pages/api/AxiosInstance";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {import("../../../../types/api").CreateUserRequest} CreateUserRequest
 */

/**
 * @typedef {import("../../../../types/api").UserDto} UserDto
 */

/**
 * Create a new user
 * Maps to: POST /api/users
 * @param {CreateUserRequest} data
 * @returns {Promise<UserDto>}
 */
export function createUser(data) {
	return apiClient.post("/users", data);
}

/**
 * Generate a mutation key for the API
 */
export const getCreateUserMutationKey = () => ["users", "create"];

/**
 * Create a new user mutation
 * @param {import("react-query").UseMutationOptions<UserDto, import("axios").AxiosError, CreateUserRequest>} [options]
 */
export function useCreateUserMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createUser,
		mutationKey: getCreateUserMutationKey(),
		onSuccess: (data) => {
			// Invalidate users list
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success("User created successfully");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to create user. Please try again."),
			);
		},
		...options,
	});
}
