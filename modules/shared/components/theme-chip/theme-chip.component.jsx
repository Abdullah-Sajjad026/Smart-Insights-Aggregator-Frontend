import React from "react";
import Chip from "@mui/material/Chip";
import LabelIcon from "@mui/icons-material/Label";

/**
 * Displays a theme/category chip with consistent styling
 * @param {Object} props
 * @param {string} props.theme - Theme name to display
 * @param {"filled" | "outlined"} [props.variant="filled"] - Chip variant
 * @param {boolean} [props.showIcon=true] - Whether to show the label icon
 * @param {import("@mui/material").ChipProps} [props.chipProps] - Additional Chip props
 */
export function ThemeChip({
	theme,
	variant = "filled",
	showIcon = true,
	chipProps = {},
}) {
	if (!theme) {
		return null;
	}

	return (
		<Chip
			label={theme}
			variant={variant}
			size="small"
			icon={showIcon ? <LabelIcon /> : undefined}
			color="primary"
			sx={{
				fontWeight: 500,
				...chipProps.sx,
			}}
			{...chipProps}
		/>
	);
}

export default ThemeChip;
