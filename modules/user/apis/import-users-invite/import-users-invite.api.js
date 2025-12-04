// @ts-check

import apiClient from "pages/api/AxiosInstance";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

/**
 * @typedef {Object} BulkImportResult
 * @property {number} successCount
 * @property {number} failureCount
 * @property {Array<{rowNumber: number, email: string, status: string, errorMessage?: string}>} results
 */

/**
 * Import users from CSV and send invitations
 * Maps to: POST /api/users/import-csv-invite
 * @param {File} file
 * @returns {Promise<BulkImportResult>}
 */
export function importUsersAndInvite(file) {
	const formData = new FormData();
	formData.append("file", file);

	return apiClient.post("/users/import-csv-invite", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
}

/**
 * Generate a mutation key for the API
 */
export const getImportUsersInviteMutationKey = () => ["users", "import-invite"];

/**
 * Import users and invite mutation
 * @param {import("react-query").UseMutationOptions<BulkImportResult, import("axios").AxiosError, File>} [options]
 */
export function useImportUsersInviteMutation(options = {}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: importUsersAndInvite,
		mutationKey: getImportUsersInviteMutationKey(),
		onSuccess: (data) => {
			// Invalidate users list
			queryClient.invalidateQueries({ queryKey: ["users"] });

			if (data.failureCount > 0) {
				toast.warning(
					`${data.successCount} invitations sent successfully. ${data.failureCount} failed.`
				);
			} else {
				toast.success(`${data.successCount} user invitations sent successfully`);
			}
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to import users. Please try again."),
			);
		},
		...options,
	});
}
