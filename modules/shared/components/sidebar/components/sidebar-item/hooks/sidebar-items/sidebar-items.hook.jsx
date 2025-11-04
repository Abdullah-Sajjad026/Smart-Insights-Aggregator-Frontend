import {
	DashboardOutlined,
	FeedbackOutlined,
	AssignmentOutlined,
	TopicOutlined,
	AddCommentOutlined,
	HistoryOutlined,
	SearchOutlined,
} from "@mui/icons-material";
import HeadphonesIcon from "modules/shared/icons/HeadphonesIcon";
import {
	userTypeAdmin,
	userTypeStaff,
	userTypeStudent,
	useUserContext,
} from "modules/user";

/**
 * @returns { import("modules/shared").SidebarItemProps[] } Sidebar items for admin users
 */
function useAdminSidebarItems() {
	return [
		{
			label: "Dashboard",
			icon: DashboardOutlined,
			buttonProps: {
				href: "/admin/dashboard",
			},
		},
		{
			label: "Inquiries",
			icon: AssignmentOutlined,
			buttonProps: {
				href: "/admin/inquiries",
			},
		},
		{
			label: "Topics",
			icon: TopicOutlined,
			buttonProps: {
				href: "/admin/topics",
			},
		},
	];
}

/**
 * @returns { import("modules/shared").SidebarItemProps[] } Sidebar items for student users
 */
function useStudentSidebarItems() {
	return [
		{
			label: "Home",
			icon: HistoryOutlined,
			buttonProps: {
				href: "/student/home",
			},
		},
		{
			label: "Active Inquiries",
			icon: SearchOutlined,
			buttonProps: {
				href: "/student/inquiries",
			},
		},
	];
}

/**
 * @returns { import("modules/shared").SidebarItemProps[] } Sidebar items for staff users
 */
function useStaffSidebarItems() {
	return [];
}

/**
 * Get yourself a list of sidebar items for the sidebar navigation.
 *
 * @param { object } options
 */
export function useSidebarItems({ user = {} }) {
	const { role } = user;

	/**
	 * Sidebar items for the main sidebar navigation
	 */
	const sidebarItems =
		{
			[userTypeAdmin]: useAdminSidebarItems(),
			[userTypeStudent]: useStudentSidebarItems(user),
			[userTypeStaff]: useStaffSidebarItems(user),
		}[role] || [];

	/**
	 * Sidebar items for the secondary sidebar navigation
	 */
	const secondarySidebarItems = [
		{
			label: "Help",
			icon: HeadphonesIcon,
			buttonProps: {
				// onClick: openHelpDialog,
			},
		},
	];

	// if (role === userTypeStudent) {
	// } else if (role === userTypeStaff) {
	// }

	return {
		sidebarItems,
		secondarySidebarItems,
	};
}

/**
 * @param { Omit<Parameters<typeof useSidebarItems>[0], 'user'> } options
 */
export function useContextualizedSidebarItems(options) {
	const { user } = useUserContext();

	return useSidebarItems({ user, ...options });
}
