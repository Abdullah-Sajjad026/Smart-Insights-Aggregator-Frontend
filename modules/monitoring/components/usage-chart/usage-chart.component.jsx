import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";

export function UsageChart({ data, title }) {
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
				{title}
			</Typography>

			<Box sx={{ height: 300, width: "100%", mt: 2 }}>
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={data}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" vertical={false} />
						<XAxis dataKey="operation" />
						<YAxis />
						<Tooltip
							cursor={{ fill: "transparent" }}
							contentStyle={{
								borderRadius: 8,
								border: "none",
								boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
							}}
						/>
						<Legend />
						<Bar
							dataKey="requestCount"
							name="Requests"
							fill="#3f51b5"
							radius={[4, 4, 0, 0]}
							barSize={40}
						/>
					</BarChart>
				</ResponsiveContainer>
			</Box>
		</Paper>
	);
}
