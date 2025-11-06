import { createContext, useContext } from "react";

/**
 * @typedef {Object} AuthUser
 * @property {string} userId
 * @property {string} email
 * @property {string} fullName
 * @property {import('../../types/api').Role} role
 * @property {string} expiresAt
 */

/**
 * @type { import('react').Context<{
 * 	auth: AuthUser | null,
 * 	setAuth: (auth: AuthUser | null) => void,
 * 	isAuthenticated: boolean,
 * 	isAdmin: boolean,
 * 	isStudent: boolean,
 * }> }
 */
export const AuthContext = createContext({
	auth: null,
	setAuth: () => {},
	isAuthenticated: false,
	isAdmin: false,
	isStudent: false,
});

export function useAuthContext() {
	return useContext(AuthContext);
}
