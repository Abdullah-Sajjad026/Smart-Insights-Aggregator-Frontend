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

export const getGetAllProgramsQueryKey = (params) => ["programs", "all", params];
export const selectGetAllProgramsQueryData = (response) => ({
	data: response.items,
	pagination: {
		totalItems: response.totalCount,
		pageNumber: response.pageNumber,
		pageSize: response.pageSize,
		totalPages: response.totalPages,
	},
});

export function useGetAllPrograms(params = {}, queryProps = {}) {
	return useQuery({
		queryFn: () => getAllPrograms(params),
		queryKey: getGetAllProgramsQueryKey(params),
		select: selectGetAllProgramsQueryData,
		staleTime: PROGRAM_STALE_TIME,
		...queryProps,
	});
}
