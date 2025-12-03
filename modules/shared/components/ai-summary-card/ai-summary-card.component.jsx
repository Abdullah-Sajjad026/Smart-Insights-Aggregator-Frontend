import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RefreshIcon from "@mui/icons-material/Refresh";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { DateTime } from "luxon";
import { Stack } from "@mui/material";

/**
 * Premium card component for displaying AI Executive Summary
 * @param {Object} props
 * @param {Object} props.summary - The AI summary object (ExecutiveSummaryDto)
 * @param {Function} props.onRegenerate - Handler for regeneration
 * @param {boolean} props.isRegenerating - Loading state for regeneration
 * @param {string} [props.title="AI Executive Summary"] - Title of the section
 */
export function AiSummaryCard({
	summary,
	onRegenerate,
	isRegenerating,
	title = "AI Executive Summary",
}) {
	if (!summary) return null;

	const summaryText =
		summary.executiveSummaryData?.["summary"] ||
		Object.values(summary.executiveSummaryData || {}).join(" ") ||
		"No summary available.";

	return (
		<Paper
			elevation={0}
			variant="outlined"
			sx={{
				p: 0,
				overflow: "hidden",
				border: "0px ",
				bgcolor: "background.paper",
			}}
		>
			{/* Header */}
			<Box
				sx={{
					p: 2,
					px: 3,
					bgcolor: "primary.50",
					border: "2px solid",
					borderColor: "primary.100",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
					<AutoAwesomeIcon color="primary" />
					<Box>
						<Typography variant="subtitle1" fontWeight={700} color="primary.900">
							{title}
						</Typography>
						<Typography variant="caption" color="primary.700" display="block">
							Generated on{" "}
							{DateTime.fromISO(summary.generatedAt).toFormat("MMM dd, yyyy 'at' HH:mm")}
						</Typography>
					</Box>
				</Box>
				{onRegenerate && (
					<Button
						startIcon={<RefreshIcon />}
						onClick={onRegenerate}
						disabled={isRegenerating}
						size="small"
						variant="outlined"
						color="primary"
						sx={{ bgcolor: "white", "&:hover": { bgcolor: "primary.50" } }}
					>
						Regenerate
					</Button>
				)}
			</Box>

			{/* Content */}
			<Box sx={{ py: 3 }}>
				{/* Main Summary */}
				<Typography
					variant="body1"
					paragraph
					sx={{
						lineHeight: 1.7,
						color: "text.primary",
						fontSize: "1.05rem",
						mb: 4,
					}}
				>
					{summaryText}
				</Typography>

				{/* Key Takeaways */}
				{summary.executiveSummaryData?.keyPoints && (
					<Box sx={{ mb: 4, p: 2.5, borderRadius: 1, border: "1px dashed", borderColor: "info.200" }}>
						<Typography
							variant="subtitle2"
							fontWeight={700}
							color="info.900"
							gutterBottom
							sx={{ textTransform: "uppercase", letterSpacing: 1, mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}
						>
							<LightbulbIcon fontSize="small" /> Key Takeaways
						</Typography>
						<Box component="ul" sx={{ m: 0, pl: 2.5, "& li": { mb: 1, color: "text.primary" } }}>
							{summary.executiveSummaryData.keyPoints.split("\n").map((point, index) => {
								const cleanPoint = point.replace(/^-\s*/, "").trim();
								if (!cleanPoint) return null;
								return (
									<Typography component="li" variant="body2" key={index}>
										{cleanPoint}
									</Typography>
								);
							})}
						</Box>
					</Box>
				)}

				{/* Suggested Actions */}
				{summary.suggestedPrioritizedActions?.length > 0 && (
					<Box>
<Stack direction="row" alignItems="center" gap="4" mb={2}>
						<Box
											sx={{
												display: "flex",
												alignItems: "flex-start",
												pt: 0.5,
											}}
										>
											<Box
												sx={{
													p: 1,
													borderRadius: "50%",
													bgcolor: "primary.50",
													color: "primary.main",
													display: "flex",
												}}
											>
												<LightbulbIcon fontSize="small" />
											</Box>
										</Box>
						<Typography
							variant="subtitle2"
							fontWeight={700}
							color="text.secondary"
							gutterBottom
							sx={{ textTransform: "uppercase", letterSpacing: 1, mb: 2 }}
						>
							Suggested Actions
						</Typography>
</Stack>

						<Grid container spacing={4} >
							{summary.suggestedPrioritizedActions.map((action, index) => (
								<Grid item xs={12} key={index}>
									<Paper
										elevation={0}
										sx={{
											p: 2.5,
											bgcolor: "grey.50",
											border: "1px solid",
											borderColor: "divider",
											transition: "all 0.2s",
											display: "flex",
											gap: 2,
											"&:hover": {
												borderColor: "primary.main",
												bgcolor: "white",
												boxShadow: 2,
												transform: "translateY(-2px)",
											},
										}}
									>
										{/* Icon Column */}


										{/* Content Column */}
										<Box sx={{ flex: 1 }}>
											<Box
												sx={{
													display: "flex",
													justifyContent: "space-between",
													alignItems: "flex-start",
													mb: 1,
													flexWrap: "wrap",
													gap: 1,
												}}
											>
												<Typography variant="subtitle1" fontWeight={700} color="text.primary">
													{action.action}
												</Typography>
												{(() => {
													// Parse impact: "Level: Description" or just "Description"
													let level = "";
													let description = action.impact;

													const parts = action.impact.split(":");
													if (parts.length > 1 && ["High", "Medium", "Low"].includes(parts[0].trim())) {
														level = parts[0].trim();
														description = parts.slice(1).join(":").trim();
													} else if (["High", "Medium", "Low"].includes(action.impact.trim())) {
														level = action.impact.trim();
														description = "";
													}

													// If we have a level, show chip
													if (level) {
														return (
															<Chip
																label={level}
																size="small"
																color={
																	level === "High"
																		? "error"
																		: level === "Medium"
																		? "warning"
																		: "info"
																}
																variant="filled"
																sx={{ fontWeight: 600, height: 24 }}
															/>
														);
													}
													return null;
												})()}
											</Box>

											{/* Impact Description (if any) */}
											{(() => {
												let description = action.impact;
												const parts = action.impact.split(":");
												if (parts.length > 1 && ["High", "Medium", "Low"].includes(parts[0].trim())) {
													description = parts.slice(1).join(":").trim();
												} else if (["High", "Medium", "Low"].includes(action.impact.trim())) {
													description = "";
												}

												if (!description) return null;

												return (
													<Box
														sx={{
															mb: 2,
															p: 1.5,
															bgcolor: "info.50",
															borderRadius: 1,
															borderLeft: "2px solid",
															borderColor: "info.main"
														}}
													>
														<Typography variant="caption" fontWeight={700} color="info.main" display="block" gutterBottom>
															POTENTIAL IMPACT
														</Typography>
														<Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
															{description}
														</Typography>
													</Box>
												);
											})()}

											<Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
												<Box component="span" fontWeight={600} color="text.primary">Reasoning: </Box>
												{action.supportingReasoning}
											</Typography>

											{/* <Box
												sx={{
													display: "flex",
													alignItems: "center",
													justifyContent: "space-between",
													mt: "auto",
												}}
											>
												<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
													<Box
														sx={{
															bgcolor: "primary.50",
															px: 1,
															py: 0.5,
															borderRadius: 1,
														}}
													>
														<Typography variant="caption" fontWeight={700} color="primary.main">
															{action.responseCount}
														</Typography>
													</Box>
													<Typography variant="caption" color="text.secondary">
														supporting responses
													</Typography>
												</Box>

												<ArrowForwardIcon
													fontSize="small"
													sx={{ color: "text.disabled", opacity: 0.5 }}
												/>
											</Box> */}
										</Box>
									</Paper>
								</Grid>
							))}
						</Grid>
					</Box>
				)}
			</Box>
		</Paper>
	);
}
