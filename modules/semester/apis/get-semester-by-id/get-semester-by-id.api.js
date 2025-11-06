// @ts-check
import { useQuery } from "react-query";
import { SEMESTER_STALE_TIME } from "../../semester.config";
import apiClient from "pages/api/AxiosInstance";

export function getSemesterById(semesterId) {
	return apiClient.get(`/semesters/${semesterId}`);
}

export const getSemesterByIdQueryKey = (semesterId) => ["semester", semesterId];
export const selectSemesterByIdQueryData = (response) => response;

export function useGetSemesterById(semesterId, queryProps = {}) {
	return useQuery({
		queryFn: () => getSemesterById(semesterId),
		queryKey: getSemesterByIdQueryKey(semesterId),
		select: selectSemesterByIdQueryData,
		staleTime: SEMESTER_STALE_TIME,
		enabled: !!semesterId,
		...queryProps,
	});
}
