// @ts-check

/**
 * Input module route definitions
 * @param {string} path - Base path for input routes
 */
export function getInputRoutes(path = "input") {
	return {
		// Student routes
		submit: {
			path: `/${path}/submit`,
		},
		myInputs: {
			path: `/${path}/my-inputs`,
		},
		inquiries: {
			path: `/${path}/inquiries`,
		},
		inquiryDetail: {
			path: `/${path}/inquiries/:inquiryId`,
			getPath: inquiryId => `/${path}/inquiries/${inquiryId}`,
		},

		// Admin routes
		adminInputList: {
			path: `/admin/${path}s`,
		},
		adminInputDetail: {
			path: `/admin/${path}s/:inputId`,
			getPath: inputId => `/admin/${path}s/${inputId}`,
		},
	};
}

export const inputRoutes = getInputRoutes("input");
