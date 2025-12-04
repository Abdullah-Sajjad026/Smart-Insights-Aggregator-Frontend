import React from "react";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";

/**
 * Displays severity level with icon and color coding
 * @param {Object} props
 * @param {number} props.severity - Severity level (1=Low, 2=Medium, 3=High)
 * @param {"chip" | "badge"} [props.variant="chip"] - Display variant
 * @param {import("@mui/material").ChipProps} [props.chipProps] - Additional Chip props
 */
export function SeverityBadge({ severity, variant = "chip", chipProps = {} }) {
	if (!severity) return null;

	const getConfig = () => {
		switch (severity) {
			case 3:
				return {
					label: "High Severity",
					icon: PriorityHighIcon,
					color: "error",
					bgColor: "#ffebee",
					tooltip: "High Severity: This feedback addresses critical issues that require immediate attention. AI has identified this as urgent based on language intensity, urgency indicators, and potential impact on student wellbeing or academic experience.",
				};
			case 2:
				return {
					label: "Medium Severity",
					icon: WarningIcon,
					color: "warning",
					bgColor: "#fff3e0",
					tooltip: "Medium Severity: This feedback highlights important concerns that should be addressed in a timely manner. The issue is significant but not immediately critical.",
				};
			case 1:
				return {
					label: "Low Severity",
					icon: InfoIcon,
					color: "info",
					bgColor: "#e3f2fd",
					tooltip: "Low Severity: This feedback contains general suggestions or minor concerns. It can be addressed during regular reviews and doesn't require immediate action.",
				};
			default:
				return {
					label: "Unknown",
					icon: InfoIcon,
					color: "default",
					bgColor: "#f5f5f5",
					tooltip: "Severity level not yet analyzed by AI.",
				};
		}
	};

	const config = getConfig();
	const IconComponent = config.icon;

	return (
		<Tooltip title={config.tooltip} arrow placement="top">
			<Chip
				label={config.label}
				color={config.color}
				size="small"
				icon={<IconComponent />}
				sx={{
					fontWeight: 600,
					cursor: "help",
					...chipProps.sx,
				}}
				{...chipProps}
			/>
		</Tooltip>
	);
}

export default SeverityBadge;
