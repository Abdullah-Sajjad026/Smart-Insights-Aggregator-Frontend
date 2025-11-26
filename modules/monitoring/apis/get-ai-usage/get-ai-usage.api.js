import { useQuery } from "react-query";
import apiClient from "pages/api/AxiosInstance";

export const getAiUsageQueryKey = (startDate, endDate) => ["monitoring", "ai", "usage", startDate, endDate];

export const useGetAiUsage = (startDate, endDate, options = {}) => {
	return useQuery({
		queryKey: getAiUsageQueryKey(startDate, endDate),
		queryFn: async () => {
			const params = {};
			if (startDate) params.startDate = startDate;
			if (endDate) params.endDate = endDate;

			const response = await apiClient.get("/monitoring/ai/usage", { params });
			return response;
		},
		...options,
	});
};
