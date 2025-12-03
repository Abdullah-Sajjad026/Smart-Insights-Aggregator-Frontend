// @ts-check
import { useQuery } from "react-query";
import { SEMESTER_STALE_TIME } from "../../semester.config";
import apiClient from "pages/api/AxiosInstance";

export function getAllSemesters(params = {}) {
	return apiClient.get("/semesters", { params });
}

export const getAllSemestersQueryKey = (params) => ["semesters", "all", params];
export const selectGetAllSemestersQueryData = (response) => ({
	data: response || [],
	pagination: {
		totalItems: response?.length || 0,
		pageNumber: 1,
		pageSize: response?.length || 0,
		totalPages: 1,
	},
});

export function useGetAllSemesters(params = {}, queryProps = {}) {
	return useQuery({
		queryFn: () => getAllSemesters(params),
		queryKey: getAllSemestersQueryKey(params),
		select: selectGetAllSemestersQueryData,
		staleTime: SEMESTER_STALE_TIME,
		...queryProps,
	});
}
