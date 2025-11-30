import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import { SENTIMENT_COLORS } from "constants/enums";

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
	const getPercentage = (count) => {
		if (totalResponses === 0) return 0;
		return Math.round((count / totalResponses) * 100);
	};

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
						bgcolor: "primary.main",
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
						{["Positive", "Neutral", "Negative"].map((sentiment) => {
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
									<Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
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
				<Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
					<Typography variant="subtitle2" color="text.secondary" gutterBottom>
						SEVERITY BREAKDOWN
					</Typography>
					<Box sx={{ mt: 2, display: "flex", gap: 1, height: "100%", alignItems: "flex-end", pb: 1 }}>
						{["Low", "Medium", "High"].map((severity) => {
							const count = severityBreakdown[severity] || 0;
							const percentage = getPercentage(count);
							const height = Math.max(percentage, 10); // Min height for visibility
							const color =
								severity === "High"
									? "error.main"
									: severity === "Medium"
									? "warning.main"
									: "info.main";

							return (
								<Box
									key={severity}
									sx={{
										flex: 1,
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										gap: 1,
									}}
								>
									<Typography variant="caption" fontWeight={700}>
										{count}
									</Typography>
									<Box
										sx={{
											width: "100%",
											height: `${height}%`,
											bgcolor: color,
											borderRadius: "4px 4px 0 0",
											minHeight: 4,
											transition: "height 0.5s",
										}}
									/>
									<Typography variant="caption" color="text.secondary">
										{severity}
									</Typography>
								</Box>
							);
						})}
					</Box>
				</Paper>
			</Grid>
		</Grid>
	);
}
