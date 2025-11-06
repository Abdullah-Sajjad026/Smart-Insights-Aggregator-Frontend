// Export the input module's apis
export * from "./submit-input/submit-input.api";
export * from "./get-my-inputs/get-my-inputs.api";
export * from "./get-all-inputs/get-all-inputs.api";
export * from "./get-input-by-id/get-input-by-id.api";
export * from "./update-input/update-input.api";
export * from "./delete-input/delete-input.api";
export * from "./get-dashboard-stats/get-dashboard-stats.api";
export * from "./request-reveal/request-reveal.api";
export * from "./respond-to-reveal/respond-to-reveal.api";
export * from "./get-input-replies/get-input-replies.api";
export * from "./create-input-reply/create-input-reply.api";

// Note: get-active-inquiries and get-inquiry-by-id are inquiry-related
// They should ideally be moved to inquiry module or kept for backward compatibility
export * from "./get-active-inquiries/get-active-inquiries.api";
export * from "./get-inquiry-by-id/get-inquiry-by-id.api";
