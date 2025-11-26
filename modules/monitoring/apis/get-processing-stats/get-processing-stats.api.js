import { useQuery } from "react-query";
import apiClient from "pages/api/AxiosInstance";

export const getProcessingStatsQueryKey = () => ["monitoring", "processing", "stats"];

export const useGetProcessingStats = (options = {}) => {
	return useQuery({
		queryKey: getProcessingStatsQueryKey(),
		queryFn: async () => {
			const response = await apiClient.get("/monitoring/processing/stats");
			return response;
		},
		...options,
	});
};
