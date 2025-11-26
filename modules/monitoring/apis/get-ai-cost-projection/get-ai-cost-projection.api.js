import { useQuery } from "react-query";
import apiClient from "pages/api/AxiosInstance";

export const getAiCostProjectionQueryKey = () => ["monitoring", "ai", "cost", "projection"];

export const useGetAiCostProjection = (options = {}) => {
	return useQuery({
		queryKey: getAiCostProjectionQueryKey(),
		queryFn: async () => {
			const response = await apiClient.get("/monitoring/ai/cost/projection");
			return response;
		},
		...options,
	});
};
