// @ts-check
import { useQuery } from "react-query";
import { SEMESTER_STALE_TIME } from "../../semester.config";
import apiClient from "pages/api/AxiosInstance";

export function getAllSemesters(params = {}) {
	return apiClient.get("/semesters", { params });
}

export const getGetAllSemestersQueryKey = (params) => ["semesters", "all", params];
export const selectGetAllSemestersQueryData = (response) => response;

export function useGetAllSemesters(params = {}, queryProps = {}) {
	return useQuery({
		queryFn: () => getAllSemesters(params),
		queryKey: getGetAllSemestersQueryKey(params),
		select: selectGetAllSemestersQueryData,
		staleTime: SEMESTER_STALE_TIME,
		...queryProps,
	});
}
