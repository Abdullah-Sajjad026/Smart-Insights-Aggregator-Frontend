// @ts-check
import { useQuery } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { getApiErrorMessage } from "modules/shared";
import { toast } from "react-toastify";

/**
 * @typedef {import("../../../../types/api").TopicDto} TopicDto
 */

/**
 * Get topics contributed to by the current user
 * Maps to: GET /api/topics/my-contributions
 * @returns {Promise<TopicDto[]>}
 */
export function getMyContributions() {
	return apiClient.get("/topics/my-contributions");
}

export const getMyContributionsQueryKey = () => ["my-contributions"];

export function useGetMyContributions(options = {}) {
	return useQuery({
		queryFn: getMyContributions,
		queryKey: getMyContributionsQueryKey(),
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Failed to fetch your contributions"),
			);
		},
		...options,
	});
}
