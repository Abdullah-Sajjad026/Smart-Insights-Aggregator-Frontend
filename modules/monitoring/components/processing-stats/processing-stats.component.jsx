import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Grid from "@mui/material/Grid";

function StatItem({ label, value, color = "primary" }) {
	return (
		<Box>
			<Typography variant="caption" color="text.secondary">
				{label}
			</Typography>
			<Typography variant="h6" fontWeight={600} color={`${color}.main`}>
				{value}
			</Typography>
		</Box>
	);
}

export function ProcessingStats({ stats }) {
	const processingRate = stats?.overall?.processingRate || 0;

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
			<Typography variant="h6" gutterBottom fontWeight={600}>
				System Health
			</Typography>

			<Box sx={{ mb: 4 }}>
				<Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
					<Typography variant="body2" fontWeight={500}>
						Processing Rate
					</Typography>
					<Typography variant="body2" fontWeight={600}>
						{processingRate.toFixed(1)}%
					</Typography>
				</Box>
				<LinearProgress
					variant="determinate"
					value={processingRate}
					sx={{ height: 8, borderRadius: 4 }}
					color={processingRate > 90 ? "success" : "warning"}
				/>
			</Box>

			<Grid container spacing={3}>
				<Grid item xs={6}>
					<StatItem
						label="Total Inputs"
						value={stats?.overall?.totalInputs || 0}
					/>
				</Grid>
				<Grid item xs={6}>
					<StatItem
						label="Pending"
						value={stats?.overall?.pendingInputs || 0}
						color="warning"
					/>
				</Grid>
				<Grid item xs={6}>
					<StatItem
						label="Processed Today"
						value={stats?.today?.processedInputs || 0}
						color="success"
					/>
				</Grid>
				<Grid item xs={6}>
					<StatItem
						label="New Today"
						value={stats?.today?.totalInputs || 0}
					/>
				</Grid>
			</Grid>
		</Paper>
	);
}
