/**
 * HOC helper to require Student role
 * Shorthand for withUser(Component, { userType: Role.Student })
 */

import { Role } from "../../../types/api";
import { withUser } from "./user/user.hoc";

/**
 * Wraps a component to require Student authentication
 * @param {React.ComponentType} Component
 * @returns {React.ComponentType}
 *
 * @example
 * export default withStudent(StudentDashboard);
 */
export function withStudent(Component) {
	return withUser(Component, { userType: Role.Student });
}
