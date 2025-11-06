/**
 * HOC helper to require Admin role
 * Shorthand for withUser(Component, { userType: Role.Admin })
 */

import { Role } from "../../../types/api";
import { withUser } from "./user/user.hoc";

/**
 * Wraps a component to require Admin authentication
 * @param {React.ComponentType} Component
 * @returns {React.ComponentType}
 *
 * @example
 * export default withAdmin(AdminDashboard);
 */
export function withAdmin(Component) {
	return withUser(Component, { userType: Role.Admin });
}
