// @ts-check

import apiClient from "pages/api/AxiosInstance";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {Object} AcceptInvitationRequest
 * @property {string} invitationToken
 * @property {string} password
 * @property {string} confirmPassword
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} userId
 * @property {string} token
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} fullName
 * @property {string} role
 * @property {string} expiresAt
 */

/**
 * Accept invitation and set password
 * Maps to: POST /api/auth/accept-invitation
 * @param {AcceptInvitationRequest} data
 * @returns {Promise<LoginResponse>}
 */
export function acceptInvitation(data) {
	return apiClient.post("/auth/accept-invitation", data);
}

/**
 * Generate a mutation key for the API
 */
export const getAcceptInvitationMutationKey = () => ["auth", "accept-invitation"];

/**
 * Accept invitation mutation
 * @param {import("react-query").UseMutationOptions<LoginResponse, import("axios").AxiosError, AcceptInvitationRequest>} [options]
 */
export function useAcceptInvitationMutation(options = {}) {
	return useMutation({
		mutationFn: acceptInvitation,
		mutationKey: getAcceptInvitationMutationKey(),
		onSuccess: () => {
			toast.success("Welcome to SmartInsights!");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to accept invitation. Please try again."),
			);
		},
		...options,
	});
}
