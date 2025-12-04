import React from "react";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";

/**
 * Displays tone with icon and color coding
 * @param {Object} props
 * @param {"Formal" | "Informal" | "Neutral" | "Professional" | "Casual"} props.tone - Tone type
 * @param {"chip" | "text"} [props.variant="chip"] - Display variant
 * @param {import("@mui/material").ChipProps} [props.chipProps] - Additional Chip props
 */
export function ToneIndicator({ tone, variant = "chip", chipProps = {} }) {
	if (!tone) return null;

	const getConfig = () => {
		switch (tone?.toLowerCase()) {
			case "formal":
			case "professional":
				return {
					label: tone,
					color: "primary",
					bgColor: "#e3f2fd",
					tooltip: `${tone} Tone: The feedback is written in a structured, professional manner with proper grammar and formal language. This often indicates the student took time to carefully compose their feedback.`,
				};
			case "informal":
			case "casual":
				return {
					label: tone,
					color: "secondary",
					bgColor: "#f3e5f5",
					tooltip: `${tone} Tone: The feedback uses conversational, relaxed language. This may indicate the student feels comfortable sharing their thoughts openly, though the issue might be less serious or more personal in nature.`,
				};
			case "neutral":
				return {
					label: tone,
					color: "default",
					bgColor: "#f5f5f5",
					tooltip: "Neutral Tone: The feedback is written in a balanced, matter-of-fact manner without strong emotional indicators. It's neither overly formal nor casual.",
				};
			default:
				return {
					label: tone,
					color: "default",
					bgColor: "#f5f5f5",
					tooltip: `${tone} Tone: AI has detected this communication style in the feedback.`,
				};
		}
	};

	const config = getConfig();

	return (
		<Tooltip title={config.tooltip} arrow placement="top">
			<Chip
				label={config.label}
				color={config.color}
				size="small"
				icon={<RecordVoiceOverIcon />}
				sx={{
					fontWeight: 500,
					cursor: "help",
					...chipProps.sx,
				}}
				{...chipProps}
			/>
		</Tooltip>
	);
}

export default ToneIndicator;
