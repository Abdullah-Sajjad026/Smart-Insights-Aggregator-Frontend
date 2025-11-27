import { useMutation } from "react-query";
import apiClient from "pages/api/AxiosInstance";

const generateTopicSummary = async (topicId) => {
	const response = await apiClient.post(`/topics/${topicId}/generate-summary`);
	return response;
};

export const useGenerateTopicSummaryMutation = (options = {}) => {
	return useMutation((topicId) => generateTopicSummary(topicId), options);
};
