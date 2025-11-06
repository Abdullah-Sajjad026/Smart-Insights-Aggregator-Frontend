// @ts-check
import { useQuery } from "react-query";
import { THEME_STALE_TIME } from "../../theme.config";
import apiClient from "pages/api/AxiosInstance";

export function getThemeById(themeId) {
	return apiClient.get(`/themes/${themeId}`);
}

export const getThemeByIdQueryKey = (themeId) => ["theme", themeId];
export const selectThemeByIdQueryData = (response) => response;

export function useGetThemeById(themeId, queryProps = {}) {
	return useQuery({
		queryFn: () => getThemeById(themeId),
		queryKey: getThemeByIdQueryKey(themeId),
		select: selectThemeByIdQueryData,
		staleTime: THEME_STALE_TIME,
		enabled: !!themeId,
		...queryProps,
	});
}
