import { useQuery } from "react-query";
import apiClient from "pages/api/AxiosInstance";

export const getAiCostTodayQueryKey = () => ["monitoring", "ai", "cost", "today"];

export const useGetAiCostToday = (options = {}) => {
	return useQuery({
		queryKey: getAiCostTodayQueryKey(),
		queryFn: async () => {
			const response = await apiClient.get("/monitoring/ai/cost/today");
			return response;
		},
		...options,
	});
};
