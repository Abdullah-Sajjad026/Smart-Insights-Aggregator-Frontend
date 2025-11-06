// @ts-check
import { useQuery } from "react-query";
import { PROGRAM_STALE_TIME } from "../../program.config";
import apiClient from "pages/api/AxiosInstance";

/**
 * @typedef {import("../../../../types/api").ProgramDto} ProgramDto
 */

export function getProgramById(programId) {
	return apiClient.get(`/programs/${programId}`);
}

export const getProgramByIdQueryKey = (programId) => ["program", programId];
export const selectProgramByIdQueryData = (response) => response;

export function useGetProgramById(programId, queryProps = {}) {
	return useQuery({
		queryFn: () => getProgramById(programId),
		queryKey: getProgramByIdQueryKey(programId),
		select: selectProgramByIdQueryData,
		staleTime: PROGRAM_STALE_TIME,
		enabled: !!programId,
		...queryProps,
	});
}
