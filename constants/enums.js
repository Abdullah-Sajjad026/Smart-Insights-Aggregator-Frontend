// Global Enum Configurations and Label Mappings
// This file provides user-friendly labels and dropdown options for all backend enums

import {
	Role,
	InquiryStatus,
	InputStatus,
	InputType,
	Sentiment,
	Tone,
	ThemeType,
	RevealStatus,
} from "../types/api";

// ============================================================================
// Role
// ============================================================================

export const ROLE_LABELS = {
	[Role.Admin]: "Administrator",
	[Role.Student]: "Student",
};

export const roleOptions = [
	{ value: Role.Admin, label: ROLE_LABELS[Role.Admin] },
	{ value: Role.Student, label: ROLE_LABELS[Role.Student] },
];

// ============================================================================
// Inquiry Status
// ============================================================================

export const INQUIRY_STATUS_LABELS = {
	[InquiryStatus.Draft]: "Draft",
	[InquiryStatus.Sent]: "Sent",
	[InquiryStatus.Closed]: "Closed",
};

export const inquiryStatusOptions = [
	{ value: InquiryStatus.Draft, label: INQUIRY_STATUS_LABELS[InquiryStatus.Draft] },
	{ value: InquiryStatus.Sent, label: INQUIRY_STATUS_LABELS[InquiryStatus.Sent] },
	{ value: InquiryStatus.Closed, label: INQUIRY_STATUS_LABELS[InquiryStatus.Closed] },
];

// ============================================================================
// Input Status
// ============================================================================

export const INPUT_STATUS_LABELS = {
	[InputStatus.Pending]: "Pending",
	[InputStatus.Reviewed]: "Reviewed",
	[InputStatus.Resolved]: "Resolved",
	[InputStatus.Archived]: "Archived",
};

export const INPUT_STATUS_COLORS = {
	[InputStatus.Pending]: "warning",
	[InputStatus.Reviewed]: "info",
	[InputStatus.Resolved]: "success",
	[InputStatus.Archived]: "default",
};

export const inputStatusOptions = [
	{ value: InputStatus.Pending, label: INPUT_STATUS_LABELS[InputStatus.Pending] },
	{ value: InputStatus.Reviewed, label: INPUT_STATUS_LABELS[InputStatus.Reviewed] },
	{ value: InputStatus.Resolved, label: INPUT_STATUS_LABELS[InputStatus.Resolved] },
	{ value: InputStatus.Archived, label: INPUT_STATUS_LABELS[InputStatus.Archived] },
];

// ============================================================================
// Input Type
// ============================================================================

export const INPUT_TYPE_LABELS = {
	[InputType.General]: "General Feedback",
	[InputType.InquiryLinked]: "Inquiry Response",
};

export const inputTypeOptions = [
	{ value: InputType.General, label: INPUT_TYPE_LABELS[InputType.General] },
	{ value: InputType.InquiryLinked, label: INPUT_TYPE_LABELS[InputType.InquiryLinked] },
];

// ============================================================================
// Sentiment
// ============================================================================

export const SENTIMENT_LABELS = {
	[Sentiment.Positive]: "Positive",
	[Sentiment.Neutral]: "Neutral",
	[Sentiment.Negative]: "Negative",
};

export const SENTIMENT_COLORS = {
	[Sentiment.Positive]: "success",
	[Sentiment.Neutral]: "default",
	[Sentiment.Negative]: "error",
};

export const sentimentOptions = [
	{ value: Sentiment.Positive, label: SENTIMENT_LABELS[Sentiment.Positive] },
	{ value: Sentiment.Neutral, label: SENTIMENT_LABELS[Sentiment.Neutral] },
	{ value: Sentiment.Negative, label: SENTIMENT_LABELS[Sentiment.Negative] },
];

// ============================================================================
// Tone
// ============================================================================

export const TONE_LABELS = {
	[Tone.Positive]: "Positive",
	[Tone.Neutral]: "Neutral",
	[Tone.Negative]: "Negative",
};

export const TONE_COLORS = {
	[Tone.Positive]: "success",
	[Tone.Neutral]: "default",
	[Tone.Negative]: "error",
};

export const toneOptions = [
	{ value: Tone.Positive, label: TONE_LABELS[Tone.Positive] },
	{ value: Tone.Neutral, label: TONE_LABELS[Tone.Neutral] },
	{ value: Tone.Negative, label: TONE_LABELS[Tone.Negative] },
];

// ============================================================================
// Theme Type
// ============================================================================

export const THEME_TYPE_LABELS = {
	[ThemeType.Infrastructure]: "Infrastructure",
	[ThemeType.Academic]: "Academic",
	[ThemeType.Technology]: "Technology",
	[ThemeType.Administration]: "Administration",
	[ThemeType.StudentServices]: "Student Services",
	[ThemeType.Other]: "Other",
};

export const themeTypeOptions = [
	{ value: ThemeType.Infrastructure, label: THEME_TYPE_LABELS[ThemeType.Infrastructure] },
	{ value: ThemeType.Academic, label: THEME_TYPE_LABELS[ThemeType.Academic] },
	{ value: ThemeType.Technology, label: THEME_TYPE_LABELS[ThemeType.Technology] },
	{ value: ThemeType.Administration, label: THEME_TYPE_LABELS[ThemeType.Administration] },
	{ value: ThemeType.StudentServices, label: THEME_TYPE_LABELS[ThemeType.StudentServices] },
	{ value: ThemeType.Other, label: THEME_TYPE_LABELS[ThemeType.Other] },
];

// ============================================================================
// Reveal Status
// ============================================================================

export const REVEAL_STATUS_LABELS = {
	[RevealStatus.NotRequested]: "Not Requested",
	[RevealStatus.Pending]: "Pending",
	[RevealStatus.Approved]: "Approved",
	[RevealStatus.Denied]: "Denied",
};

export const REVEAL_STATUS_COLORS = {
	[RevealStatus.NotRequested]: "default",
	[RevealStatus.Pending]: "warning",
	[RevealStatus.Approved]: "success",
	[RevealStatus.Denied]: "error",
};

export const revealStatusOptions = [
	{ value: RevealStatus.NotRequested, label: REVEAL_STATUS_LABELS[RevealStatus.NotRequested] },
	{ value: RevealStatus.Pending, label: REVEAL_STATUS_LABELS[RevealStatus.Pending] },
	{ value: RevealStatus.Approved, label: REVEAL_STATUS_LABELS[RevealStatus.Approved] },
	{ value: RevealStatus.Denied, label: REVEAL_STATUS_LABELS[RevealStatus.Denied] },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get label for any enum value
 * @param {string} enumValue
 * @param {Object} labelsMap
 * @returns {string}
 */
export const getEnumLabel = (enumValue, labelsMap) => {
	return labelsMap[enumValue] || enumValue;
};

/**
 * Get color for sentiment/tone chips
 * @param {string} value
 * @param {Object} colorsMap
 * @returns {string}
 */
export const getEnumColor = (value, colorsMap) => {
	return colorsMap[value] || "default";
};
