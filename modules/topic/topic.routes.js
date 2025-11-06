// Topic Module Routes

export const topicRoutes = {
	list: {
		path: "/admin/topics",
		getPath: () => "/admin/topics",
	},
	detail: {
		path: "/admin/topics/[topicId]",
		getPath: ({ topicId }) => `/admin/topics/${topicId}`,
	},
};
