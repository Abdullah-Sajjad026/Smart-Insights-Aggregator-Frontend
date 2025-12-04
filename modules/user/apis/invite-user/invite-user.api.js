// @ts-check

import apiClient from "pages/api/AxiosInstance";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {Object} InviteUserRequest
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} role - "Admin" or "Student"
 * @property {string} [departmentId] - Required for Students
 * @property {string} [programId] - Required for Students
 * @property {string} [semesterId] - Required for Students
 */

/**
 * @typedef {import("../../../../types/api").UserDto} UserDto
 */

/**
 * Invite a new user (sends invitation email)
 * Maps to: POST /api/users/invite
 * @param {InviteUserRequest} data
 * @returns {Promise<UserDto>}
 */
export function inviteUser(data) {
	return apiClient.post("/users/invite", data);
}

/**
 * Generate a mutation key for the API
 */
export const getInviteUserMutationKey = () => ["users", "invite"];

/**
 * Invite a new user mutation
 * @param {import("react-query").UseMutationOptions<UserDto, import("axios").AxiosError, InviteUserRequest>} [options]
 */
export function useInviteUserMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: inviteUser,
		mutationKey: getInviteUserMutationKey(),
		onSuccess: (data) => {
			// Invalidate users list
			queryClient.invalidateQueries({ queryKey: ["users"] });
			toast.success("User invitation sent successfully");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to invite user. Please try again."),
			);
		},
		...options,
	});
}
