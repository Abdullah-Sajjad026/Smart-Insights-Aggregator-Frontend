import {
	DashboardOutlined,
	FeedbackOutlined,
	AssignmentOutlined,
	TopicOutlined,
	AddCommentOutlined,
	HistoryOutlined,
	SearchOutlined,
	PeopleOutlined,
	CommentOutlined,
	LogoutOutlined,
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
				path: "/admin/dashboard",
			},
		},
		{
			label: "Inquiries",
			icon: AssignmentOutlined,
			buttonProps: {
				path: "/admin/inquiries",
			},
		},
		{
			label: "Inputs",
			icon: FeedbackOutlined,
			buttonProps: {
				path: "/admin/inputs",
			},
		},
		{
			label: "Users",
			icon: PeopleOutlined,
			buttonProps: {
				path: "/admin/users",
			},
		},
		{
			label: "Topics",
			icon: TopicOutlined,
			buttonProps: {
				path: "/admin/topics",
			},
		},
		{
			label: "Departments",
			icon: TopicOutlined, // Using TopicOutlined as placeholder, could be BusinessOutlined
			buttonProps: {
				path: "/admin/departments",
			},
		},
		{
			label: "Programs",
			icon: TopicOutlined, // Using TopicOutlined as placeholder, could be SchoolOutlined
			buttonProps: {
				path: "/admin/programs",
			},
		},
		{
			label: "Semesters",
			icon: TopicOutlined, // Using TopicOutlined as placeholder, could be CalendarTodayOutlined
			buttonProps: {
				path: "/admin/semesters",
			},
		},
		{
			label: "Monitoring",
			icon: DashboardOutlined,
			buttonProps: {
				path: "/admin/monitoring",
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
			icon: DashboardOutlined,
			buttonProps: {
				path: "/student/home",
			},
		},
		{
			label: "Submit Feedback",
			icon: AddCommentOutlined,
			buttonProps: {
				path: "/input/submit",
			},
		},
		{
			label: "My Submissions",
			icon: HistoryOutlined,
			buttonProps: {
				path: "/input/my-inputs",
			},
		},
		{
			label: "Active Inquiries",
			icon: SearchOutlined,
			buttonProps: {
				path: "/student/inquiries",
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
		// {
		// 	label: "Help",
		// 	icon: HeadphonesIcon,
		// 	buttonProps: {
		// 		// onClick: openHelpDialog,
		// 	},
		// },
		{
			label: "Logout",
			icon: LogoutOutlined,
			buttonProps: {
				onClick: () => {
					localStorage.removeItem("token");
					window.location.href = "/auth/sign-in";
				},
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
