import React from "react";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";

/**
 * Displays importance level with icon and color coding
 * @param {Object} props
 * @param {number} props.importance - Importance level (1=Low, 2=Medium, 3=High)
 * @param {"chip" | "badge"} [props.variant="chip"] - Display variant
 * @param {import("@mui/material").ChipProps} [props.chipProps] - Additional Chip props
 */
export function ImportanceLevelBadge({
	importance,
	variant = "chip",
	chipProps = {},
}) {
	if (!importance) return null;

	const getConfig = () => {
		switch (importance) {
			case 3:
				return {
					label: "High",
					icon: StarIcon,
					backgroundColor: "#f3e5f5",
					// color: "#9c27b0", // Purple
					borderColor: "#ce93d8",
					tooltip:
						"High Importance: This feedback addresses critical matters that require prompt attention. AI has identified this as high-priority based on impact assessment, urgency indicators, and potential effect on student experience or academic quality. This applies to both issues and valuable suggestions.",
				};
			case 2:
				return {
					label: "Medium",
					icon: StarHalfIcon,
					backgroundColor: "#e3f2fd",
					// color: "#1976d2", // Blue
					borderColor: "#90caf9",
					tooltip:
						"Medium Importance: This feedback highlights matters that should be addressed in a reasonable timeframe. The topic is significant and worth attention, though not immediately urgent.",
				};
			case 1:
				return {
					label: "Low",
					icon: StarBorderIcon,
					backgroundColor: "#f5f5f5",
					// color: "#757575", // Gray
					borderColor: "#bdbdbd",
					tooltip:
						"Low Importance: This feedback contains general suggestions, minor observations, or routine comments. It can be reviewed during regular feedback sessions and doesn't require immediate prioritization.",
				};
			default:
				return {
					label: "Not Rated",
					icon: StarBorderIcon,
					backgroundColor: "#f5f5f5",
					color: "#9e9e9e",
					borderColor: "#e0e0e0",
					tooltip: "Importance level not yet analyzed by AI.",
				};
		}
	};

	const config = getConfig();
	const IconComponent = config.icon;

	return (
		<Tooltip title={config.tooltip} arrow placement="top">
			<Chip
				label={config.label}
				size="small"
				icon={<IconComponent />}
				sx={{
					// fontWeight: 600,
					cursor: "help",
					backgroundColor: config.backgroundColor,
					color: config.color,
					borderColor: config.borderColor,
					border: "1px solid",
					"& .MuiChip-icon": {
						color: config.color,
					},
					...chipProps.sx,
				}}
				{...chipProps}
			/>
		</Tooltip>
	);
}

export default ImportanceLevelBadge;
