// @ts-check

/**
 * Inquiry module configuration
 */

// Inquiry status
export const INQUIRY_STATUS_ACTIVE = "ACTIVE";
export const INQUIRY_STATUS_DRAFT = "DRAFT";
export const INQUIRY_STATUS_CLOSED = "CLOSED";

export const inquiryStatusOptions = [
	{ value: INQUIRY_STATUS_ACTIVE, label: "Active" },
	{ value: INQUIRY_STATUS_DRAFT, label: "Draft" },
	{ value: INQUIRY_STATUS_CLOSED, label: "Closed" },
];

// Departments (should match your actual departments)
export const departments = [
	"Computer Science",
	"Software Engineering",
	"Electrical Engineering",
	"Mechanical Engineering",
	"Civil Engineering",
];

// Programs (should match your actual programs)
export const programs = [
	"BS Computer Science",
	"BS Software Engineering",
	"BS Electrical Engineering",
	"BS Mechanical Engineering",
	"BS Civil Engineering",
];

// Semesters
export const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

// Query stale times
export const INQUIRY_STALE_TIME = 1000 * 60 * 5; // 5 minutes
