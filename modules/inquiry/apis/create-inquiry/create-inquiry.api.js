// @ts-check
import { useMutation } from "react-query";
import { delay } from "modules/shared/shared.mock-data";

/**
 * Create a new inquiry (mock API)
 * @param {Object} data
 * @param {string} data.title
 * @param {string} data.description
 * @param {string} data.status
 * @param {string[]} data.targetDepartments
 * @param {string[]} data.targetPrograms
 * @param {string[]} data.targetSemesters
 * @param {string} data.startDate
 * @param {string} data.endDate
 * @returns {Promise<Object>}
 */
export async function createInquiry(data) {
	// Simulate API delay
	await delay(1200);

	// Mock successful response
	const mockResponse = {
		success: true,
		data: {
			id: `inq-${Date.now()}`,
			...data,
			totalInputs: 0,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			createdBy: "admin@kfueit.edu.pk",
		},
		message: "Inquiry created successfully!",
	};

	// Simulate occasional errors (5% chance)
	if (Math.random() < 0.05) {
		throw new Error("Failed to create inquiry. Please try again.");
	}

	return mockResponse;
}

/**
 * Get mutation key for create inquiry
 */
export const getCreateInquiryMutationKey = () => ["create-inquiry"];

/**
 * React Query mutation hook for creating inquiry
 * @param {Object} props - Mutation options
 */
export function useCreateInquiryMutation(props = {}) {
	return useMutation({
		mutationFn: createInquiry,
		mutationKey: getCreateInquiryMutationKey(),
		...props,
	});
}
