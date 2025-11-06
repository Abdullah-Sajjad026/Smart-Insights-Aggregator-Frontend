// @ts-check
import { useQuery } from "react-query";
import { THEME_STALE_TIME } from "../../theme.config";
import apiClient from "pages/api/AxiosInstance";

export function getAllThemes(params = {}) {
	return apiClient.get("/themes", { params });
}

export const getGetAllThemesQueryKey = (params) => ["themes", "all", params];
export const selectGetAllThemesQueryData = (response) => response;

export function useGetAllThemes(params = {}, queryProps = {}) {
	return useQuery({
		queryFn: () => getAllThemes(params),
		queryKey: getGetAllThemesQueryKey(params),
		select: selectGetAllThemesQueryData,
		staleTime: THEME_STALE_TIME,
		...queryProps,
	});
}
