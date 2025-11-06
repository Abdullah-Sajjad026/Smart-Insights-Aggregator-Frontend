// @ts-check
import { useMutation, useQueryClient } from "react-query";
import apiClient from "pages/api/AxiosInstance";
import { toast } from "react-toastify";
import { getApiErrorMessage } from "modules/shared";

export function createTheme(data) {
	return apiClient.post("/themes", data);
}

export const getCreateThemeMutationKey = () => ["create-theme"];

export function useCreateThemeMutation(options = {}) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createTheme,
		mutationKey: getCreateThemeMutationKey(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["themes"] });
			toast.success("Theme created successfully!");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to create theme."));
		},
		...options,
	});
}
