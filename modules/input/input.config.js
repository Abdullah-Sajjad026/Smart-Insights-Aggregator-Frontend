// @ts-check

/**
 * Input module configuration
 */

// Input types
export const INPUT_TYPE_GENERAL = "GENERAL";
export const INPUT_TYPE_INQUIRY_LINKED = "INQUIRY_LINKED";

// Input status
export const INPUT_STATUS_PENDING = "PENDING";
export const INPUT_STATUS_PROCESSING = "PROCESSING";
export const INPUT_STATUS_PROCESSED = "PROCESSED";
export const INPUT_STATUS_FAILED = "FAILED";

// Sentiment types
export const SENTIMENT_POSITIVE = "POSITIVE";
export const SENTIMENT_NEGATIVE = "NEGATIVE";
export const SENTIMENT_NEUTRAL = "NEUTRAL";
export const SENTIMENT_MIXED = "MIXED";

// Importance levels
export const IMPORTANCE_HIGH = "HIGH";
export const IMPORTANCE_MEDIUM = "MEDIUM";
export const IMPORTANCE_LOW = "LOW";

// Form validation limits
export const INPUT_MIN_LENGTH = 20;
export const INPUT_MAX_LENGTH = 2000;

// Query stale times
export const INPUT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
export const MY_INPUTS_STALE_TIME = 1000 * 60 * 2; // 2 minutes
