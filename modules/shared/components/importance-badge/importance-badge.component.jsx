import React from "react";
import Chip from "@mui/material/Chip";

/**
 * Displays importance level with color coding
 * @param {Object} props
 * @param {"HIGH" | "MEDIUM" | "LOW"} props.importance - Importance level
 * @param {import("@mui/material").ChipProps} [props.chipProps] - Additional Chip props
 */
export function ImportanceBadge({ importance, chipProps = {} }) {
	const getConfig = () => {
		switch (importance) {
			case "HIGH":
				return {
					label: "High Priority",
					color: "error",
					sx: { fontWeight: 600 },
				};
			case "MEDIUM":
				return {
					label: "Medium Priority",
					color: "warning",
					sx: { fontWeight: 500 },
				};
			case "LOW":
				return {
					label: "Low Priority",
					color: "success",
					sx: { fontWeight: 500 },
				};
			default:
				return {
					label: "Unknown",
					color: "default",
					sx: {},
				};
		}
	};

	const config = getConfig();

	return (
		<Chip
			label={config.label}
			color={config.color}
			size="small"
			sx={{
				...config.sx,
				...chipProps.sx,
			}}
			{...chipProps}
		/>
	);
}

export default ImportanceBadge;
