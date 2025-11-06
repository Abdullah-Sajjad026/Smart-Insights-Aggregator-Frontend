// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

export function updateTheme({ themeId, data }) {
	return apiClient.put(`/themes/${themeId}`, data);
}

export const getUpdateThemeMutationKey = () => ["update-theme"];

export function useUpdateThemeMutation(options = {}) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: updateTheme,
		mutationKey: getUpdateThemeMutationKey(),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["themes"] });
			queryClient.invalidateQueries({ queryKey: ["theme", variables.themeId] });
			toast.success("Theme updated successfully!");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to update theme."));
		},
		...options,
	});
}
