// @ts-check

/**
 * Inquiry module route definitions
 * @param {string} path - Base path for inquiry routes
 */
export function getInquiryRoutes(path = "inquiries") {
	return {
		// Admin routes
		list: {
			path: `/admin/${path}`,
		},
		detail: {
			path: `/admin/${path}/:inquiryId`,
			getPath: inquiryId => `/admin/${path}/${inquiryId}`,
		},
	};
}

export const inquiryRoutes = getInquiryRoutes("inquiries");
