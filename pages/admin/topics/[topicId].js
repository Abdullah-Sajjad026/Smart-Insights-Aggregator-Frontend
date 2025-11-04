import { useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DateTime } from "luxon";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader } from "modules/shared/components";
import {
	mockTopics,
	mockInputsSimplified,
} from "modules/shared/shared.mock-data-v2";

function TabPanel({ children, value, index }) {
	return (
		<div role="tabpanel" hidden={value !== index}>
			{value === index && <Box sx={{ py: 3 }}>{children}</Box>}
		</div>
	);
}

const getSeverityLabel = severity => {
	if (severity === 3) return "HIGH";
	if (severity === 2) return "MEDIUM";
	return "LOW";
};

const getSeverityColor = severity => {
	if (severity === 3) return "error";
	if (severity === 2) return "warning";
	return "success";
};

export default function TopicDetailPage() {
	const router = useRouter();
	const { topicId } = router.query;
	const [activeTab, setActiveTab] = useState(0);

	// Mock: Find topic
	const topic = mockTopics.find(t => t.id === topicId);
	const topicInputs = mockInputsSimplified.filter(
		inp => inp.topicId === topicId,
	);

	if (!topic) {
		return (
			<RootLayout>
				<MainContainer>
					<Alert severity="error">Topic not found</Alert>
				</MainContainer>
			</RootLayout>
		);
	}

	const handleInputClick = inputId => {
		router.push(`/admin/inputs/${inputId}`);
	};

	// Get first insights summary (topics have array structure)
	const insightsSummary = topic.insightsSummary?.[0];
	const executiveSummary = insightsSummary?.["Executive Summary"];
	const suggestedActions =
		insightsSummary?.["Suggested Prioritized Actions"] || [];

	return (
		<RootLayout>
			<MainContainer>
				<Box sx={{ py: 4 }}>
					{/* Back Button */}
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={() => router.push("/admin/topics")}
						sx={{ mb: 3 }}
					>
						Back to Topics
					</Button>

					{/* Header */}
					<Box sx={{ mb: 3 }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
							<Typography variant="h4" fontWeight={600}>
								{topic.topic}
							</Typography>
							<Chip
								label={getSeverityLabel(topic.severity)}
								color={getSeverityColor(topic.severity)}
							/>
							<Chip
								label={topic.status}
								color={topic.status === "ACTIVE" ? "success" : "default"}
							/>
						</Box>
						<Typography variant="body1" color="text.secondary">
							{topic.description}
						</Typography>
					</Box>

					{/* Tabs */}
					<Paper elevation={2}>
						<Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
							<Tab label="Overview & AI Analysis" />
							<Tab label={`Inputs (${topicInputs.length})`} />
						</Tabs>

						{/* Tab 1: Overview & AI Analysis */}
						<TabPanel value={activeTab} index={0}>
							{/* Topic Details */}
							<Box sx={{ mb: 4 }}>
								<Typography variant="h6" gutterBottom fontWeight={600}>
									Topic Details
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={6} md={3}>
										<Typography variant="caption" color="text.secondary">
											Total Inputs
										</Typography>
										<Typography variant="h6" fontWeight={600}>
											{topic.totalInputs}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<Typography variant="caption" color="text.secondary">
											Average Score
										</Typography>
										<Typography variant="h6" fontWeight={600}>
											{parseFloat(topic.averageScore).toFixed(1)}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<Typography variant="caption" color="text.secondary">
											Severity Level
										</Typography>
										<Chip
											label={getSeverityLabel(topic.severity)}
											color={getSeverityColor(topic.severity)}
										/>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<Typography variant="caption" color="text.secondary">
											Created On
										</Typography>
										<Typography variant="body2">
											{DateTime.fromISO(topic.createdAt).toFormat(
												"MMM dd, yyyy",
											)}
										</Typography>
									</Grid>
								</Grid>
							</Box>

							<Divider sx={{ my: 3 }} />

							{/* AI Analysis - Executive Summary Format */}
							<Box sx={{ mb: 4 }}>
								<Typography variant="h6" gutterBottom fontWeight={600}>
									AI-Powered Aggregate Analysis
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ mb: 3 }}
								>
									Analysis of all {topic.totalInputs} inputs in this topic
								</Typography>

								{/* Topics */}
								{insightsSummary?.topics && (
									<Paper
										variant="outlined"
										sx={{ p: 3, mb: 3, bgcolor: "primary.50" }}
									>
										<Typography
											variant="subtitle2"
											gutterBottom
											fontWeight={600}
										>
											Key Topics Identified
										</Typography>
										<Box
											sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}
										>
											{insightsSummary.topics.map((topicName, idx) => (
												<Chip key={idx} label={topicName} color="primary" />
											))}
										</Box>
									</Paper>
								)}

								{/* Executive Summary */}
								{executiveSummary && (
									<>
										{/* Headline Insight */}
										{executiveSummary["Headline Insight"] && (
											<Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
												<Typography
													variant="subtitle2"
													gutterBottom
													fontWeight={600}
												>
													Headline Insight
												</Typography>
												<Typography
													variant="body1"
													sx={{ mt: 1, fontWeight: 500 }}
												>
													{executiveSummary["Headline Insight"]}
												</Typography>
											</Paper>
										)}

										{/* Key Takeaway */}
										{executiveSummary["Key Takeaway"] && (
											<Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
												<Typography
													variant="subtitle2"
													gutterBottom
													fontWeight={600}
												>
													Key Takeaway
												</Typography>
												<Typography
													variant="body2"
													color="text.secondary"
													sx={{ mt: 1, lineHeight: 1.8 }}
												>
													{executiveSummary["Key Takeaway"]}
												</Typography>
											</Paper>
										)}

										{/* Risks */}
										{executiveSummary["Risks"] && (
											<Paper
												variant="outlined"
												sx={{
													p: 3,
													mb: 3,
													borderColor: "error.main",
													bgcolor: "error.50",
												}}
											>
												<Typography
													variant="subtitle2"
													gutterBottom
													fontWeight={600}
													color="error.dark"
												>
													Risks
												</Typography>
												<Typography
													variant="body2"
													sx={{ mt: 1, lineHeight: 1.8 }}
													color="error.dark"
												>
													{executiveSummary["Risks"]}
												</Typography>
											</Paper>
										)}

										{/* Opportunities */}
										{executiveSummary["Opportunities"] && (
											<Paper
												variant="outlined"
												sx={{
													p: 3,
													mb: 3,
													borderColor: "success.main",
													bgcolor: "success.50",
												}}
											>
												<Typography
													variant="subtitle2"
													gutterBottom
													fontWeight={600}
													color="success.dark"
												>
													Opportunities
												</Typography>
												<Typography
													variant="body2"
													sx={{ mt: 1, lineHeight: 1.8 }}
													color="success.dark"
												>
													{executiveSummary["Opportunities"]}
												</Typography>
											</Paper>
										)}
									</>
								)}

								{/* Suggested Prioritized Actions */}
								{suggestedActions.length > 0 && (
									<Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
										<Typography
											variant="subtitle2"
											gutterBottom
											fontWeight={600}
										>
											Suggested Prioritized Actions
										</Typography>
										<Box sx={{ mt: 2 }}>
											{suggestedActions.map((action, idx) => (
												<Paper
													key={idx}
													variant="outlined"
													sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}
												>
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															gap: 2,
															mb: 1,
														}}
													>
														<Chip
															label={`#${idx + 1}`}
															color="primary"
															size="small"
															sx={{ fontWeight: 600 }}
														/>
														<Typography
															variant="body1"
															fontWeight={600}
															sx={{ flex: 1 }}
														>
															{action.Action}
														</Typography>
													</Box>

													<Box sx={{ display: "flex", gap: 1, mb: 2 }}>
														<Chip
															label={`Impact: ${action.Impact}`}
															size="small"
														/>
														<Chip
															label={`${action["Response Count"]} responses`}
															size="small"
															variant="outlined"
														/>
													</Box>

													<Typography
														variant="body2"
														color="text.secondary"
														sx={{ mb: 1 }}
													>
														<strong>Supporting Reasoning:</strong>{" "}
														{action["Supporting Reasoning"]}
													</Typography>

													<Typography variant="body2" color="text.secondary">
														<strong>Challenges:</strong> {action.Challenges}
													</Typography>
												</Paper>
											))}
										</Box>
									</Paper>
								)}

								{/* Sentiment Distribution */}
								{topic.overallSentiment && (
									<Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
										<Typography
											variant="subtitle2"
											gutterBottom
											fontWeight={600}
										>
											Sentiment Distribution
										</Typography>
										<Grid container spacing={2} sx={{ mt: 1 }}>
											<Grid item xs={6} sm={3}>
												<Box sx={{ textAlign: "center" }}>
													<Typography variant="h4" color="success.main">
														{topic.overallSentiment.positive}
													</Typography>
													<Typography variant="caption">Positive</Typography>
												</Box>
											</Grid>
											<Grid item xs={6} sm={3}>
												<Box sx={{ textAlign: "center" }}>
													<Typography variant="h4" color="error.main">
														{topic.overallSentiment.negative}
													</Typography>
													<Typography variant="caption">Negative</Typography>
												</Box>
											</Grid>
											<Grid item xs={6} sm={3}>
												<Box sx={{ textAlign: "center" }}>
													<Typography variant="h4" color="text.secondary">
														{topic.overallSentiment.neutral}
													</Typography>
													<Typography variant="caption">Neutral</Typography>
												</Box>
											</Grid>
											<Grid item xs={6} sm={3}>
												<Box sx={{ textAlign: "center" }}>
													<Typography variant="h4" color="warning.main">
														{topic.overallSentiment.mixed}
													</Typography>
													<Typography variant="caption">Mixed</Typography>
												</Box>
											</Grid>
										</Grid>
									</Paper>
								)}

								{/* Importance Breakdown */}
								{topic.importanceBreakdown && (
									<Paper variant="outlined" sx={{ p: 3 }}>
										<Typography
											variant="subtitle2"
											gutterBottom
											fontWeight={600}
										>
											Importance Breakdown
										</Typography>
										<Grid container spacing={2} sx={{ mt: 1 }}>
											<Grid item xs={4}>
												<Box sx={{ textAlign: "center" }}>
													<Typography variant="h4" color="error.main">
														{topic.importanceBreakdown.high}
													</Typography>
													<Typography variant="caption">
														High Priority
													</Typography>
												</Box>
											</Grid>
											<Grid item xs={4}>
												<Box sx={{ textAlign: "center" }}>
													<Typography variant="h4" color="warning.main">
														{topic.importanceBreakdown.medium}
													</Typography>
													<Typography variant="caption">
														Medium Priority
													</Typography>
												</Box>
											</Grid>
											<Grid item xs={4}>
												<Box sx={{ textAlign: "center" }}>
													<Typography variant="h4" color="success.main">
														{topic.importanceBreakdown.low}
													</Typography>
													<Typography variant="caption">
														Low Priority
													</Typography>
												</Box>
											</Grid>
										</Grid>
									</Paper>
								)}
							</Box>
						</TabPanel>

						{/* Tab 2: Inputs */}
						<TabPanel value={activeTab} index={1}>
							{topicInputs.length > 0 ? (
								<Box>
									{topicInputs.map(input => (
										<Paper
											key={input.id}
											variant="outlined"
											sx={{
												p: 2,
												mb: 2,
												cursor: "pointer",
												"&:hover": { bgcolor: "grey.50" },
											}}
											onClick={() => handleInputClick(input.id)}
										>
											<Box
												sx={{
													display: "flex",
													justifyContent: "space-between",
													mb: 1,
												}}
											>
												<Typography variant="caption" color="text.secondary">
													{DateTime.fromISO(input.createdAt).toFormat(
														"MMM dd, yyyy 'at' hh:mm a",
													)}
												</Typography>
												<Box sx={{ display: "flex", gap: 1 }}>
													<Chip label={input.sentiment} size="small" />
													<Chip
														label={getSeverityLabel(input.severity)}
														size="small"
														color={getSeverityColor(input.severity)}
													/>
												</Box>
											</Box>
											<Typography variant="body2" sx={{ mb: 1 }}>
												{input.body}
											</Typography>

											{/* AI Theme for general inputs */}
											{input.aiTheme && (
												<Chip
													label={input.aiTheme}
													size="small"
													variant="outlined"
													sx={{ mb: 2 }}
												/>
											)}

											{/* Quality Scores */}
											<Box
												sx={{
													display: "flex",
													gap: 2,
													flexWrap: "wrap",
													mt: 2,
												}}
											>
												<Chip
													label={`Urgency: ${(
														parseFloat(input.urgencyPct) * 100
													).toFixed(0)}%`}
													size="small"
													variant="outlined"
												/>
												<Chip
													label={`Importance: ${(
														parseFloat(input.importancePct) * 100
													).toFixed(0)}%`}
													size="small"
													variant="outlined"
												/>
												<Chip
													label={`Quality: ${(
														parseFloat(input.qualityPct) * 100
													).toFixed(0)}%`}
													size="small"
													variant="outlined"
												/>
											</Box>
										</Paper>
									))}
								</Box>
							) : (
								<Alert severity="info">No inputs in this topic yet.</Alert>
							)}
						</TabPanel>
					</Paper>
				</Box>
			</MainContainer>
		</RootLayout>
	);
}
