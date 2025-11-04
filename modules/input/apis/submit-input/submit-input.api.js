// @ts-check
import { useMutation } from "react-query";
import { delay } from "modules/shared/shared.mock-data";

/**
 * Submit a new input (mock API)
 * @param {Object} params
 * @param {string} params.body - Input text content
 * @param {string} [params.inquiryId] - Optional inquiry ID
 * @returns {Promise<Object>}
 */
export async function submitInput({ body, inquiryId }) {
	// Simulate API delay
	await delay(1500);

	// Mock successful response
	const mockResponse = {
		success: true,
		data: {
			id: `inp-${Date.now()}`,
			body,
			type: inquiryId ? "INQUIRY_LINKED" : "GENERAL",
			inquiryId: inquiryId || null,
			status: "PENDING",
			createdAt: new Date().toISOString(),
		},
		message: "Your feedback has been submitted successfully!",
	};

	// Simulate occasional errors (10% chance)
	if (Math.random() < 0.1) {
		throw new Error("Failed to submit feedback. Please try again.");
	}

	return mockResponse;
}

/**
 * Get mutation key for submit input
 */
export const getSubmitInputMutationKey = () => ["submit-input"];

/**
 * React Query mutation hook for submitting input
 * @param {Object} props - Mutation options
 */
export function useSubmitInputMutation(props = {}) {
	return useMutation({
		mutationFn: submitInput,
		mutationKey: getSubmitInputMutationKey(),
		...props,
	});
}
