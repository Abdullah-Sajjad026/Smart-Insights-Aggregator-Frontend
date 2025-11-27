import { useQuery } from "react-query";
import apiClient from "pages/api/AxiosInstance";

export const getAllFacultiesQueryKey = () => ["faculties"];

export const useGetAllFaculties = (options = {}) => {
	return useQuery(
		getAllFacultiesQueryKey(),
		async () => {
			const response = await apiClient.get("/faculties");
			return { data: response };
		},
		options,
	);
};
