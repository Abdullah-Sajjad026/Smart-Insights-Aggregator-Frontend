import React from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
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
				};
			case "NEGATIVE":
				return {
					label: "Negative",
					icon: SentimentVeryDissatisfiedIcon,
					color: "error",
					iconColor: "#f44336",
				};
			case "NEUTRAL":
				return {
					label: "Neutral",
					icon: SentimentNeutralIcon,
					color: "default",
					iconColor: "#9e9e9e",
				};
			case "MIXED":
				return {
					label: "Mixed",
					icon: SentimentSatisfiedIcon,
					color: "warning",
					iconColor: "#ff9800",
				};
			default:
				return {
					label: "Unknown",
					icon: SentimentNeutralIcon,
					color: "default",
					iconColor: "#9e9e9e",
				};
		}
	};

	const config = getConfig();
	const IconComponent = config.icon;

	if (variant === "icon") {
		return (
			<Box
				sx={{
					display: "inline-flex",
					alignItems: "center",
					gap: 0.5,
				}}
			>
				<IconComponent
					sx={{ color: config.iconColor, fontSize: 20, ...iconProps.sx }}
					{...iconProps}
				/>
			</Box>
		);
	}

	return (
		<Chip
			label={config.label}
			color={config.color}
			size="small"
			icon={<IconComponent />}
			sx={{
				fontWeight: 500,
				...chipProps.sx,
			}}
			{...chipProps}
		/>
	);
}

export default SentimentIndicator;
