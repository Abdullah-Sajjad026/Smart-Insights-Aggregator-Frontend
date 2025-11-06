/**
 * HOC helper to require any authenticated user (Admin or Student)
 * Shorthand for withUser(Component) - no role restriction
 */

import { withUser } from "./user/user.hoc";

/**
 * Wraps a component to require authentication (any role)
 * @param {React.ComponentType} Component
 * @returns {React.ComponentType}
 *
 * @example
 * export default withAuth(ProfilePage);
 */
export function withAuth(Component) {
	return withUser(Component);
}
