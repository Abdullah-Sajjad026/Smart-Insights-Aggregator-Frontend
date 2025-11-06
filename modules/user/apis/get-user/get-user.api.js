// @ts-check

import { userStaleTime } from "modules/user/user.config";
import { saveUser } from "modules/user/user.utils";
import apiClient from "pages/api/AxiosInstance";
import { useQuery } from "react-query";

/**
 * @typedef { import("modules/user/models").User } GetUserResponse
 */

/**
 * @typedef { import("axios").AxiosResponse<GetUserResponse> } GetUserAxiosResponse
 */

/**
 * Get the logged-in user.
 * Maps to: GET /api/users/{id} using userId from localStorage
 * Or falls back to user data from localStorage if API fails
 */
export function getUser() {
  // Try to get user from localStorage first
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      // If we have user data in localStorage, return it as a resolved promise
      // This allows the app to work even if the backend is unavailable
      return Promise.resolve(user);
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }

  // If no user in localStorage, try to fetch from backend
  // Note: This endpoint may not exist on backend, adjust if needed
  return apiClient.get("/auth/me").catch((error) => {
    console.error("Failed to fetch user from backend", error);
    throw error;
  });
}

/**
 * Generate a query key for the API
 */
export const getUserQueryKey = () => ["user"];

/**
 * Generate the original response from the data
 * @param { GetUserResponse } data
 * @returns { { data: GetUserAxiosResponse['data'] } }
 */
export const generateUserQueryData = (data) => ({ data: data });

/**
 * Select the data from the response
 * @param { GetUserAxiosResponse } response
 */
export const selectUserQueryData = (response) => {
  const user = response.data;
  saveUser(user);

  return user;
};

/**
 * Get the logged-in user.
 * @param { import("react-query").UseQueryOptions<GetUserResponse, import("axios").AxiosError> & {
 * 	select: (data: GetUserAxiosResponse) => GetUserResponse
 * } } [queryProps]
 */
export function useGetUser(props = {}, queryProps = {}) {
  return useQuery({
    queryFn: getUser,
    queryKey: getUserQueryKey(),
    select: selectUserQueryData,
    staleTime: userStaleTime,
    ...queryProps,
  });
}
