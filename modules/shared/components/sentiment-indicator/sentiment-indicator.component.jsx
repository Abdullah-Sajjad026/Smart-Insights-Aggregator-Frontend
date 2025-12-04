import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";

/**
 * Displays sentiment with icon and color coding
 * @param {Object} props
 * @param {"POSITIVE" | "NEGATIVE" | "NEUTRAL" | "MIXED"} props.sentiment - Sentiment type
 * @param {"chip" | "icon"} [props.variant="chip"] - Display variant
 * @param {import("@mui/material").ChipProps} [props.chipProps] - Additional Chip props
 * @param {import("@mui/material").SvgIconProps} [props.iconProps] - Additional Icon props
 */
export function SentimentIndicator({
	sentiment,
	variant = "chip",
	chipProps = {},
	iconProps = {},
}) {
	const getConfig = () => {
		switch (sentiment) {
			case "POSITIVE":
				return {
					label: "Positive",
					icon: SentimentVerySatisfiedIcon,
					color: "success",
					iconColor: "#4caf50",
					tooltip: "Positive Sentiment: The feedback expresses satisfaction, appreciation, or optimistic views. This indicates things are going well in this area or the student is pleased with certain aspects.",
				};
			case "NEGATIVE":
				return {
					label: "Negative",
					icon: SentimentVeryDissatisfiedIcon,
					color: "error",
					iconColor: "#f44336",
					tooltip: "Negative Sentiment: The feedback expresses dissatisfaction, frustration, or concern. This requires attention as it indicates problems or areas where students are unhappy.",
				};
			case "NEUTRAL":
				return {
					label: "Neutral",
					icon: SentimentNeutralIcon,
					color: "default",
					iconColor: "#9e9e9e",
					tooltip: "Neutral Sentiment: The feedback is objective and factual without strong positive or negative emotions. It may be a suggestion or observation rather than a complaint or praise.",
				};
			case "MIXED":
				return {
					label: "Mixed",
					icon: SentimentSatisfiedIcon,
					color: "warning",
					iconColor: "#ff9800",
					tooltip: "Mixed Sentiment: The feedback contains both positive and negative elements. The student may appreciate some aspects while having concerns about others in the same topic.",
				};
			default:
				return {
					label: "Unknown",
					icon: SentimentNeutralIcon,
					color: "default",
					iconColor: "#9e9e9e",
					tooltip: "Sentiment analysis not yet completed by AI.",
				};
		}
	};

	const config = getConfig();
	const IconComponent = config.icon;

	if (variant === "icon") {
		return (
			<Tooltip title={config.tooltip} arrow placement="top">
				<Box
					sx={{
						display: "inline-flex",
						alignItems: "center",
						gap: 0.5,
						cursor: "help",
					}}
				>
					<IconComponent
						sx={{ color: config.iconColor, fontSize: 20, ...iconProps.sx }}
						{...iconProps}
					/>
				</Box>
			</Tooltip>
		);
	}

	return (
		<Tooltip title={config.tooltip} arrow placement="top">
			<Chip
				label={config.label}
				color={config.color}
				size="small"
				icon={<IconComponent />}
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

export default SentimentIndicator;
