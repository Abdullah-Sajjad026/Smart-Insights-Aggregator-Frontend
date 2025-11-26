import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export function CostCard({ title, amount, subtitle, trend, loading = false }) {
	return (
		<Paper
			elevation={0}
			sx={{
				p: 3,
				height: "100%",
				border: "1px solid",
				borderColor: "divider",
				borderRadius: 2,
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
				<Box
					sx={{
						p: 1,
						borderRadius: 1,
						bgcolor: "primary.light",
						color: "primary.main",
						mr: 2,
						display: "flex",
					}}
				>
					<AttachMoneyIcon />
				</Box>
				<Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
					{title}
				</Typography>
			</Box>

			<Typography variant="h4" fontWeight={700} gutterBottom>
				${Number(amount || 0).toFixed(4)}
			</Typography>

			{subtitle && (
				<Typography variant="body2" color="text.secondary">
					{subtitle}
				</Typography>
			)}

			{trend && (
				<Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
					<TrendingUpIcon
						fontSize="small"
						color="success"
						sx={{ mr: 0.5 }}
					/>
					<Typography variant="caption" color="success.main" fontWeight={600}>
						{trend}
					</Typography>
				</Box>
			)}
		</Paper>
	);
}
