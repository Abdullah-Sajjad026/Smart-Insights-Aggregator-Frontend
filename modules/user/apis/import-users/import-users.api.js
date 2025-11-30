import { useMutation, useQueryClient } from "react-query";
import AxiosInstance from "pages/api/AxiosInstance";
import { getGetAllUsersQueryKey } from "../get-all-users/get-all-users.api";

export const useImportUsersMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (file) => {
			const formData = new FormData();
			formData.append("file", file);

			const response = await AxiosInstance.post(
				"/users/import-csv",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);
			return response;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getGetAllUsersQueryKey() });
		},
	});
};
