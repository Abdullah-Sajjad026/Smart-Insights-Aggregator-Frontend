import { useQuery } from "react-query";
import apiClient from "pages/api/AxiosInstance";

export const getStudentInquiriesQueryKey = () => ["inquiries", "student"];

export const useGetStudentInquiries = (options = {}) => {
	return useQuery({
		queryKey: getStudentInquiriesQueryKey(),
		queryFn: async () => {
			const response = await apiClient.get("/inquiries/for-student");
			return response;
		},
		...options,
	});
};
