import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import { SeverityBreakdownChart } from "../severity-breakdown-chart/severity-breakdown-chart.component";

/**
 * Component to visualize statistics
 * @param {Object} props
 * @param {Object} props.stats - Stats object (TotalResponses, SentimentBreakdown, SeverityBreakdown, AverageQuality)
 */
export function StatsOverview({ stats }) {
	if (!stats) return null;

	const {
		totalResponses = 0,
		sentimentBreakdown = {},
		severityBreakdown = {},
		averageQuality = 0,
	} = stats;

	// Calculate percentages for sentiment
	const getPercentage = count => {
		if (totalResponses === 0) return 0;
		return Math.round((count / totalResponses) * 100);
	};

	// Find max count for severity to normalize bar heights
	const maxSeverityCount = Math.max(
		severityBreakdown["Low"] || 0,
		severityBreakdown["Medium"] || 0,
		severityBreakdown["High"] || 0,
		1, // Avoid division by zero
	);

	return (
		<Grid container spacing={3} sx={{ mb: 4 }}>
			{/* Total Responses & Quality */}
			<Grid item xs={12} md={4}>
				<Paper
					variant="outlined"
					sx={{
						p: 3,
						height: "100%",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						textAlign: "center",
						bgcolor: "background.paperDark",
						color: "white",
						border: "none",
					}}
				>
					<Typography variant="h2" fontWeight={700}>
						{totalResponses}
					</Typography>
					<Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 2 }}>
						Total Responses
					</Typography>
					{averageQuality > 0 && (
						<Box
							sx={{
								bgcolor: "rgba(255,255,255,0.2)",
								px: 2,
								py: 0.5,
								borderRadius: 4,
							}}
						>
							<Typography variant="caption" fontWeight={600}>
								Avg Quality: {averageQuality.toFixed(1)}/10
							</Typography>
						</Box>
					)}
				</Paper>
			</Grid>

			{/* Sentiment Distribution */}
			<Grid item xs={12} md={4}>
				<Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
					<Typography variant="subtitle2" color="text.secondary" gutterBottom>
						SENTIMENT DISTRIBUTION
					</Typography>
					<Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
						{["Positive", "Neutral", "Negative"].map(sentiment => {
							const count = sentimentBreakdown[sentiment] || 0;
							const percentage = getPercentage(count);
							const color =
								sentiment === "Positive"
									? "success"
									: sentiment === "Negative"
									? "error"
									: "warning";

							return (
								<Box key={sentiment}>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											mb: 0.5,
										}}
									>
										<Typography variant="caption" fontWeight={600}>
											{sentiment}
										</Typography>
										<Typography variant="caption" color="text.secondary">
											{count} ({percentage}%)
										</Typography>
									</Box>
									<LinearProgress
										variant="determinate"
										value={percentage}
										color={color}
										sx={{ height: 6, borderRadius: 3, bgcolor: "grey.100" }}
									/>
								</Box>
							);
						})}
					</Box>
				</Paper>
			</Grid>

			{/* Severity Breakdown */}
			<Grid item xs={12} md={4}>
				<SeverityBreakdownChart data={severityBreakdown} />
			</Grid>
		</Grid>
	);
}
