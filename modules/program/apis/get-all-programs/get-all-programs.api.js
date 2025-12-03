// @ts-check
import { useQuery } from "react-query";
import { PROGRAM_STALE_TIME } from "../../program.config";
import apiClient from "pages/api/AxiosInstance";

/**
 * @typedef {import("../../../../types/api").ProgramDto} ProgramDto
 */

/**
 * @typedef {import("../../../../types/api").PaginatedResult} PaginatedResult
 */

export function getAllPrograms(params = {}) {
	return apiClient.get("/programs", { params });
}

export const getAllProgramsQueryKey = (params) => ["programs", "all", params];
export const selectGetAllProgramsQueryData = (response) => ({
	data: response || [],
	pagination: {
		totalItems: response?.length || 0,
		pageNumber: 1,
		pageSize: response?.length || 0,
		totalPages: 1,
	},
});

export function useGetAllPrograms(params = {}, queryProps = {}) {
	return useQuery({
		queryFn: () => getAllPrograms(params),
		queryKey: getAllProgramsQueryKey(params),
		select: selectGetAllProgramsQueryData,
		staleTime: PROGRAM_STALE_TIME,
		...queryProps,
	});
}
