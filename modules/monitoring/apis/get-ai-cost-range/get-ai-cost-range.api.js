import { useQuery } from "react-query";
import apiClient from "pages/api/AxiosInstance";

export const getAiCostRangeQueryKey = (startDate, endDate) => ["monitoring", "ai", "cost", "range", startDate, endDate];

export const useGetAiCostRange = (startDate, endDate, options = {}) => {
	return useQuery({
		queryKey: getAiCostRangeQueryKey(startDate, endDate),
		queryFn: async () => {
			const params = {};
			if (startDate) params.startDate = startDate;
			if (endDate) params.endDate = endDate;

			const response = await apiClient.get("/monitoring/ai/cost", { params });
			return response;
		},
		enabled: !!startDate && !!endDate,
		...options,
	});
};
