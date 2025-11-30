import { useMutation } from "react-query";
import apiClient from "pages/api/AxiosInstance";

export const useGenerateInquirySummaryMutation = (options = {}) => {
	return useMutation(async (inquiryId) => {
		return await apiClient.post(`/inquiries/${inquiryId}/generate-summary`);
	}, options);
};
