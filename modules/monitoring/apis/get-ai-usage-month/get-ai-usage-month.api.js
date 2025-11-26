import { useQuery } from "react-query";
import apiClient from "pages/api/AxiosInstance";

export const getAiUsageMonthQueryKey = () => ["monitoring", "ai", "usage", "month"];

export const useGetAiUsageMonth = (options = {}) => {
	return useQuery({
		queryKey: getAiUsageMonthQueryKey(),
		queryFn: async () => {
			const response = await apiClient.get("/monitoring/ai/usage/month");
			return response;
		},
		...options,
	});
};
