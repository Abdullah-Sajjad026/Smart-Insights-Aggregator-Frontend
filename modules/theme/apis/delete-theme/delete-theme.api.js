// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

export function deleteTheme(themeId) {
	return apiClient.delete(`/themes/${themeId}`);
}

export const getDeleteThemeMutationKey = () => ["delete-theme"];

export function useDeleteThemeMutation(options = {}) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteTheme,
		mutationKey: getDeleteThemeMutationKey(),
		onSuccess: (data, themeId) => {
			queryClient.invalidateQueries({ queryKey: ["themes"] });
			queryClient.invalidateQueries({ queryKey: ["theme", themeId] });
			toast.success("Theme deleted successfully!");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to delete theme."));
		},
		...options,
	});
}
