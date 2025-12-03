// ============================================================================
// Backend API Type Definitions
// ============================================================================
// This file contains all type definitions matching the .NET 8 backend DTOs

// ============================================================================
// Common Types
// ============================================================================

/**
 * @typedef {Object} ApiResponse
 * @property {any} data
 * @property {string} message
 * @property {boolean} success
 */

/**
 * @typedef {Object} PaginatedResult
 * @property {Array} items
 * @property {number} totalCount
 * @property {number} pageNumber
 * @property {number} pageSize
 * @property {number} totalPages
 */

/**
 * @typedef {Object} ValidationError
 * @property {string} field
 * @property {string} message
 */

// ============================================================================
// Enums (matching backend)
// ============================================================================

/**
 * @typedef {'Admin' | 'Student'} Role
 */

/** @type {Object.<string, Role>} */
export const Role = {
	Admin: "Admin",
	Student: "Student",
};

/**
 * @typedef {'Draft' | 'Active' | 'Closed'} InquiryStatus
 */

/** @type {Object.<string, InquiryStatus>} */
export const InquiryStatus = {
	Draft: "Draft",
	Active: "Active",
	Sent: "Active", // Alias for backwards compatibility
	Closed: "Closed",
};

/**
 * @typedef {'Pending' | 'Reviewed' | 'Resolved' | 'Archived'} InputStatus
 */

/** @type {Object.<string, InputStatus>} */
export const InputStatus = {
	Pending: "Pending",
	Reviewed: "Reviewed",
	Resolved: "Resolved",
	Archived: "Archived",
};

/**
 * @typedef {'General' | 'InquiryLinked'} InputType
 */

/** @type {Object.<string, InputType>} */
export const InputType = {
	General: "General",
	InquiryLinked: "InquiryLinked",
};

/**
 * @typedef {'Positive' | 'Neutral' | 'Negative'} Sentiment
 */

/** @type {Object.<string, Sentiment>} */
export const Sentiment = {
	Positive: "Positive",
	Neutral: "Neutral",
	Negative: "Negative",
};

/**
 * @typedef {'Positive' | 'Neutral' | 'Negative'} Tone
 */

/** @type {Object.<string, Tone>} */
export const Tone = {
	Positive: "Positive",
	Neutral: "Neutral",
	Negative: "Negative",
};

/**
 * @typedef {'Infrastructure' | 'Academic' | 'Technology' | 'Administration' | 'StudentServices' | 'Other'} ThemeType
 */

/** @type {Object.<string, ThemeType>} */
export const ThemeType = {
	Infrastructure: "Infrastructure",
	Academic: "Academic",
	Technology: "Technology",
	Administration: "Administration",
	StudentServices: "StudentServices",
	Other: "Other",
};

/**
 * @typedef {'NotRequested' | 'Pending' | 'Approved' | 'Denied'} RevealStatus
 */

/** @type {Object.<string, RevealStatus>} */
export const RevealStatus = {
	NotRequested: "NotRequested",
	Pending: "Pending",
	Approved: "Approved",
	Denied: "Denied",
};

// ============================================================================
// Auth DTOs
// ============================================================================

/**
 * @typedef {Object} LoginRequest
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} token
 * @property {string} email
 * @property {Role} role
 * @property {string} userId
 * @property {string} fullName
 * @property {string} expiresAt
 */

// ============================================================================
// User DTOs
// ============================================================================

/**
 * @typedef {Object} UserDto
 * @property {string} id
 * @property {string} email
 * @property {string} fullName
 * @property {Role} role
 * @property {string} [departmentId]
 * @property {string} [departmentName]
 * @property {string} [programId]
 * @property {string} [programName]
 * @property {string} [semesterId]
 * @property {string} [semesterName]
 * @property {boolean} isActive
 * @property {string} createdAt
 */

/**
 * @typedef {Object} CreateUserRequest
 * @property {string} email
 * @property {string} password
 * @property {string} fullName
 * @property {string} role
 * @property {string} [departmentId]
 * @property {string} [programId]
 * @property {string} [semesterId]
 * @property {boolean} [isActive]
 */

/**
 * @typedef {Object} UpdateUserRequest
 * @property {string} [email]
 * @property {string} [fullName]
 * @property {string} [departmentId]
 * @property {string} [programId]
 * @property {string} [semesterId]
 * @property {boolean} [isActive]
 */

/**
 * @typedef {Object} UserStatsDto
 * @property {number} totalUsers
 * @property {number} totalAdmins
 * @property {number} totalStudents
 * @property {number} activeUsers
 */

// ============================================================================
// Inquiry DTOs
// ============================================================================

/**
 * @typedef {Object} InquiryDto
 * @property {string} id
 * @property {string} body
 * @property {InquiryStatus} status
 * @property {string[]} departmentIds
 * @property {string[]} departmentNames
 * @property {string[]} programIds
 * @property {string[]} programNames
 * @property {string[]} semesterIds
 * @property {string[]} semesterNames
 * @property {string} createdById
 * @property {string} createdByName
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} inputCount
 */

/**
 * @typedef {Object} CreateInquiryRequest
 * @property {string} body
 * @property {string} [status]
 * @property {string[]} departmentIds
 * @property {string[]} programIds
 * @property {string[]} semesterIds
 */

/**
 * @typedef {Object} UpdateInquiryRequest
 * @property {string} [body]
 * @property {string} [status]
 * @property {string[]} [departmentIds]
 * @property {string[]} [programIds]
 * @property {string[]} [semesterIds]
 */

/**
 * @typedef {Object} InquiryStatsDto
 * @property {number} totalInquiries
 * @property {number} draftInquiries
 * @property {number} sentInquiries
 * @property {number} closedInquiries
 * @property {number} totalResponses
 */

// ============================================================================
// Input DTOs
// ============================================================================

/**
 * @typedef {Object} InputDto
 * @property {string} id
 * @property {string} body
 * @property {InputType} type
 * @property {InputStatus} status
 * @property {string} [userId]
 * @property {string} [userName]
 * @property {string} [userEmail]
 * @property {string} [inquiryId]
 * @property {string} [inquiryBody]
 * @property {string} [topicId]
 * @property {string} [topicName]
 * @property {Sentiment} [sentiment]
 * @property {Tone} [tone]
 * @property {number} [urgencyScore]
 * @property {number} [importanceScore]
 * @property {number} [clarityScore]
 * @property {number} [qualityScore]
 * @property {number} [helpfulnessScore]
 * @property {number} [overallScore]
 * @property {number} [severityLevel]
 * @property {ThemeType} [themeType]
 * @property {string} [aiProcessedAt]
 * @property {RevealStatus} revealStatus
 * @property {string} [identityRevealedAt]
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} CreateInputRequest
 * @property {string} body
 * @property {string} [userId]
 * @property {string} [inquiryId]
 */

/**
 * @typedef {Object} UpdateInputRequest
 * @property {string} [body]
 * @property {string} [status]
 * @property {string} [topicId]
 * @property {string} [sentiment]
 * @property {string} [tone]
 * @property {number} [urgencyScore]
 * @property {number} [importanceScore]
 * @property {number} [clarityScore]
 * @property {number} [qualityScore]
 * @property {number} [helpfulnessScore]
 * @property {number} [severityLevel]
 * @property {string} [themeType]
 */

/**
 * @typedef {Object} InputFilterDto
 * @property {InputType} [type]
 * @property {string} [inquiryId]
 * @property {string} [topicId]
 * @property {Sentiment} [sentiment]
 * @property {Tone} [tone]
 * @property {number} [minQualityScore]
 * @property {number} [severityLevel]
 * @property {ThemeType} [themeType]
 * @property {InputStatus} [status]
 * @property {string} [searchTerm]
 * @property {string} [sortBy]
 * @property {boolean} [sortDescending]
 * @property {number} [pageNumber]
 * @property {number} [pageSize]
 */

/**
 * @typedef {Object} InputReplyDto
 * @property {string} id
 * @property {string} inputId
 * @property {string} userId
 * @property {string} userName
 * @property {Role} userRole
 * @property {string} message
 * @property {string} createdAt
 */

/**
 * @typedef {Object} CreateReplyRequest
 * @property {string} message
 */

/**
 * @typedef {Object} InputStatsDto
 * @property {number} totalInputs
 * @property {number} generalInputs
 * @property {number} inquiryLinkedInputs
 * @property {number} pendingInputs
 * @property {number} reviewedInputs
 * @property {number} resolvedInputs
 * @property {number} positiveCount
 * @property {number} neutralCount
 * @property {number} negativeCount
 * @property {number} averageQualityScore
 */

// ============================================================================
// Topic DTOs
// ============================================================================

/**
 * @typedef {Object} TopicDto
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {boolean} isActive
 * @property {string} createdAt
 * @property {number} inputCount
 */

/**
 * @typedef {Object} CreateTopicRequest
 * @property {string} name
 * @property {string} description
 * @property {boolean} [isActive]
 */

/**
 * @typedef {Object} UpdateTopicRequest
 * @property {string} [name]
 * @property {string} [description]
 * @property {boolean} [isActive]
 */

/**
 * @typedef {Object} TopicStatsDto
 * @property {number} totalTopics
 * @property {number} activeTopics
 * @property {number} totalInputsLinked
 */

// ============================================================================
// Department DTOs
// ============================================================================

/**
 * @typedef {Object} DepartmentDto
 * @property {string} id
 * @property {string} name
 * @property {string} code
 * @property {boolean} isActive
 * @property {string} createdAt
 */

/**
 * @typedef {Object} CreateDepartmentRequest
 * @property {string} name
 * @property {string} code
 * @property {boolean} [isActive]
 */

/**
 * @typedef {Object} UpdateDepartmentRequest
 * @property {string} [name]
 * @property {string} [code]
 * @property {boolean} [isActive]
 */

// ============================================================================
// Program DTOs
// ============================================================================

/**
 * @typedef {Object} ProgramDto
 * @property {string} id
 * @property {string} name
 * @property {string} code
 * @property {string} departmentId
 * @property {string} departmentName
 * @property {boolean} isActive
 * @property {string} createdAt
 */

/**
 * @typedef {Object} CreateProgramRequest
 * @property {string} name
 * @property {string} code
 * @property {string} departmentId
 * @property {boolean} [isActive]
 */

/**
 * @typedef {Object} UpdateProgramRequest
 * @property {string} [name]
 * @property {string} [code]
 * @property {string} [departmentId]
 * @property {boolean} [isActive]
 */

// ============================================================================
// Semester DTOs
// ============================================================================

/**
 * @typedef {Object} SemesterDto
 * @property {string} id
 * @property {string} name
 * @property {number} number
 * @property {boolean} isActive
 * @property {string} createdAt
 */

/**
 * @typedef {Object} CreateSemesterRequest
 * @property {string} name
 * @property {number} number
 * @property {boolean} [isActive]
 */

/**
 * @typedef {Object} UpdateSemesterRequest
 * @property {string} [name]
 * @property {number} [number]
 * @property {boolean} [isActive]
 */

// ============================================================================
// Theme DTOs
// ============================================================================

/**
 * @typedef {Object} ThemeDto
 * @property {string} id
 * @property {string} name
 * @property {ThemeType} type
 * @property {string} description
 * @property {boolean} isActive
 * @property {string} createdAt
 */

/**
 * @typedef {Object} CreateThemeRequest
 * @property {string} name
 * @property {string} type
 * @property {string} description
 * @property {boolean} [isActive]
 */

/**
 * @typedef {Object} UpdateThemeRequest
 * @property {string} [name]
 * @property {string} [type]
 * @property {string} [description]
 * @property {boolean} [isActive]
 */
