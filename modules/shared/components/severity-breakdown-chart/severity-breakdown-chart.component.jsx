import React from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export function SeverityBreakdownChart({ data }) {
	// Transform data object into array for Recharts
	// data is expected to be { Low: count, Medium: count, High: count }
	const chartData = [
		{ name: "Low", count: data?.Low || 0, color: "#0288d1" }, // info.main
		{ name: "Medium", count: data?.Medium || 0, color: "#ed6c02" }, // warning.main
		{ name: "High", count: data?.High || 0, color: "#d32f2f" }, // error.main
	];

	return (
		<Paper
			variant="outlined"
			sx={{
				p: 3,
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Typography variant="subtitle2" color="text.secondary" gutterBottom>
				SEVERITY BREAKDOWN
			</Typography>
			<Box sx={{ width: "100%", height: 200, mt: 2 }}>
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={chartData}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" vertical={false} />
						<XAxis dataKey="name" />
						<YAxis allowDecimals={false} />
						<Tooltip
							cursor={{ fill: "transparent" }}
							contentStyle={{
								borderRadius: 8,
								border: "none",
								boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
							}}
						/>
						<Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
							{chartData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.color} />
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</Box>
		</Paper>
	);
}
