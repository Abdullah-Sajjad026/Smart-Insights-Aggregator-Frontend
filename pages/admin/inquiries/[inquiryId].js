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
	mockInquiriesWithAnalysis,
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

export default function InquiryDetailPage() {
	const router = useRouter();
	const { inquiryId } = router.query;
	const [activeTab, setActiveTab] = useState(0);

	// Mock: Find inquiry
	const inquiry = mockInquiriesWithAnalysis.find(
		inq => inq.id === inquiryId,
	);
	const inquiryInputs = mockInputsSimplified.filter(
		inp => inp.inquiryId === inquiryId,
	);

	if (!inquiry) {
		return (
			<RootLayout>
				<MainContainer>
					<Alert severity="error">Inquiry not found</Alert>
				</MainContainer>
			</RootLayout>
		);
	}

	const handleInputClick = inputId => {
		router.push(`/admin/inputs/${inputId}`);
	};

	const executiveSummary = inquiry.aiSummary?.["Executive Summary"];
	const suggestedActions = inquiry.aiSummary?.["Suggested Prioritized Actions"] || [];

	return (
		<RootLayout>
			<MainContainer>
				<Box sx={{ py: 4 }}>
					{/* Back Button */}
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={() => router.push("/admin/inquiries")}
						sx={{ mb: 3 }}
					>
						Back to Inquiries
					</Button>

					{/* Header */}
					<Box sx={{ mb: 3 }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
							<Typography variant="h5" fontWeight={600}>
								Inquiry Question
							</Typography>
							<Chip
								label={inquiry.status}
								color={inquiry.status === "ACTIVE" ? "success" : "default"}
							/>
						</Box>
						<Paper variant="outlined" sx={{ p: 2, bgcolor: "grey.50" }}>
							<Typography variant="body1" sx={{ lineHeight: 1.8 }}>
								{inquiry.body}
							</Typography>
						</Paper>
					</Box>

					{/* Tabs */}
					<Paper elevation={2}>
						<Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
							<Tab label="Overview & AI Analysis" />
							<Tab label={`Inputs (${inquiryInputs.length})`} />
						</Tabs>

						{/* Tab 1: Overview & AI Analysis */}
						<TabPanel value={activeTab} index={0}>
							{/* Inquiry Details */}
							<Box sx={{ mb: 4 }}>
								<Typography variant="h6" gutterBottom fontWeight={600}>
									Inquiry Details
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={6} md={3}>
										<Typography variant="caption" color="text.secondary">
											Start Date
										</Typography>
										<Typography variant="body2">
											{DateTime.fromISO(inquiry.startDate).toFormat("MMM dd, yyyy")}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<Typography variant="caption" color="text.secondary">
											End Date
										</Typography>
										<Typography variant="body2">
											{DateTime.fromISO(inquiry.endDate).toFormat("MMM dd, yyyy")}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<Typography variant="caption" color="text.secondary">
											Total Responses
										</Typography>
										<Typography variant="h6" fontWeight={600}>
											{inquiry.totalInputs}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={6} md={3}>
										<Typography variant="caption" color="text.secondary">
											Status
										</Typography>
										<Typography variant="body2" fontWeight={600}>
											{inquiry.status}
										</Typography>
									</Grid>
								</Grid>

								{/* Target Audience */}
								{inquiry.targetDepartments?.length > 0 && (
									<Box sx={{ mt: 2 }}>
										<Typography variant="caption" color="text.secondary">
											Target Departments
										</Typography>
										<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
											{inquiry.targetDepartments.map(dept => (
												<Chip key={dept} label={dept} size="small" />
											))}
										</Box>
									</Box>
								)}

								{/* Engagement Metrics */}
								{inquiry.engagementMetrics?.length > 0 && (
									<Box sx={{ mt: 3 }}>
										<Typography variant="caption" color="text.secondary" gutterBottom>
											Engagement Trends
										</Typography>
										<Grid container spacing={2} sx={{ mt: 0.5 }}>
											{inquiry.engagementMetrics.map((metric, idx) => (
												<Grid item xs={6} sm={3} key={idx}>
													<Paper variant="outlined" sx={{ p: 1.5, textAlign: "center" }}>
														<Typography variant="caption" color="text.secondary">
															{DateTime.fromISO(metric.date).toFormat("MMM dd")}
														</Typography>
														<Typography variant="body2" fontWeight={600}>
															{metric.responses} responses
														</Typography>
														<Typography variant="caption" color="text.secondary">
															{metric.views} views
														</Typography>
													</Paper>
												</Grid>
											))}
										</Grid>
									</Box>
								)}
							</Box>

							<Divider sx={{ my: 3 }} />

							{/* AI Analysis - Executive Summary Format */}
							<Box sx={{ mb: 4 }}>
								<Typography variant="h6" gutterBottom fontWeight={600}>
									AI-Powered Aggregate Analysis
								</Typography>
								<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
									Analysis of all {inquiry.totalInputs} responses
								</Typography>

								{/* Topics */}
								{inquiry.aiSummary?.topics && (
									<Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: "primary.50" }}>
										<Typography variant="subtitle2" gutterBottom fontWeight={600}>
											Key Topics Identified
										</Typography>
										<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
											{inquiry.aiSummary.topics.map((topic, idx) => (
												<Chip key={idx} label={topic} color="primary" />
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
												<Typography variant="subtitle2" gutterBottom fontWeight={600}>
													Headline Insight
												</Typography>
												<Typography variant="body1" sx={{ mt: 1, fontWeight: 500 }}>
													{executiveSummary["Headline Insight"]}
												</Typography>
											</Paper>
										)}

										{/* Response Mix */}
										{executiveSummary["Response Mix"] && (
											<Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
												<Typography variant="subtitle2" gutterBottom fontWeight={600}>
													Response Mix
												</Typography>
												<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
													{executiveSummary["Response Mix"]}
												</Typography>
											</Paper>
										)}

										{/* Key Takeaways */}
										{executiveSummary["Key Takeaways"] && (
											<Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
												<Typography variant="subtitle2" gutterBottom fontWeight={600}>
													Key Takeaways
												</Typography>
												<Typography
													variant="body2"
													color="text.secondary"
													sx={{ mt: 1, lineHeight: 1.8 }}
												>
													{executiveSummary["Key Takeaways"]}
												</Typography>
											</Paper>
										)}

										{/* Risks */}
										{executiveSummary["Risks"] && (
											<Paper
												variant="outlined"
												sx={{ p: 3, mb: 3, borderColor: "error.main", bgcolor: "error.50" }}
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
												sx={{ p: 3, mb: 3, borderColor: "success.main", bgcolor: "success.50" }}
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
										<Typography variant="subtitle2" gutterBottom fontWeight={600}>
											Suggested Prioritized Actions
										</Typography>
										<Box sx={{ mt: 2 }}>
											{suggestedActions.map((action, idx) => (
												<Paper
													key={idx}
													variant="outlined"
													sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}
												>
													<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
														<Chip
															label={`#${idx + 1}`}
															color="primary"
															size="small"
															sx={{ fontWeight: 600 }}
														/>
														<Typography variant="body1" fontWeight={600} sx={{ flex: 1 }}>
															{action.Action}
														</Typography>
													</Box>

													<Box sx={{ display: "flex", gap: 1, mb: 2 }}>
														<Chip label={`Impact: ${action.Impact}`} size="small" />
														<Chip
															label={`${action["Response Count"]} responses`}
															size="small"
															variant="outlined"
														/>
													</Box>

													<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
														<strong>Supporting Reasoning:</strong> {action["Supporting Reasoning"]}
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
								{inquiry.aiSummary?.overallSentiment && (
									<Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
										<Typography variant="subtitle2" gutterBottom fontWeight={600}>
											Sentiment Distribution
										</Typography>
										<Grid container spacing={2} sx={{ mt: 1 }}>
											<Grid item xs={6} sm={3}>
												<Box sx={{ textAlign: "center" }}>
													<Typography variant="h4" color="success.main">
														{inquiry.aiSummary.overallSentiment.positive}
													</Typography>
													<Typography variant="caption">Positive</Typography>
												</Box>
											</Grid>
											<Grid item xs={6} sm={3}>
												<Box sx={{ textAlign: "center" }}>
													<Typography variant="h4" color="error.main">
														{inquiry.aiSummary.overallSentiment.negative}
													</Typography>
													<Typography variant="caption">Negative</Typography>
												</Box>
											</Grid>
											<Grid item xs={6} sm={3}>
												<Box sx={{ textAlign: "center" }}>
													<Typography variant="h4" color="text.secondary">
														{inquiry.aiSummary.overallSentiment.neutral}
													</Typography>
													<Typography variant="caption">Neutral</Typography>
												</Box>
											</Grid>
											<Grid item xs={6} sm={3}>
												<Box sx={{ textAlign: "center" }}>
													<Typography variant="h4" color="warning.main">
														{inquiry.aiSummary.overallSentiment.mixed}
													</Typography>
													<Typography variant="caption">Mixed</Typography>
												</Box>
											</Grid>
										</Grid>
									</Paper>
								)}
							</Box>
						</TabPanel>

						{/* Tab 2: Inputs */}
						<TabPanel value={activeTab} index={1}>
							{inquiryInputs.length > 0 ? (
								<Box>
									{inquiryInputs.map(input => (
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
											<Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
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

											{/* Quality Scores */}
											<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
												<Chip
													label={`Urgency: ${(parseFloat(input.urgencyPct) * 100).toFixed(0)}%`}
													size="small"
													variant="outlined"
												/>
												<Chip
													label={`Importance: ${(parseFloat(input.importancePct) * 100).toFixed(0)}%`}
													size="small"
													variant="outlined"
												/>
												<Chip
													label={`Quality: ${(parseFloat(input.qualityPct) * 100).toFixed(0)}%`}
													size="small"
													variant="outlined"
												/>
											</Box>
										</Paper>
									))}
								</Box>
							) : (
								<Alert severity="info">No inputs received yet for this inquiry.</Alert>
							)}
						</TabPanel>
					</Paper>
				</Box>
			</MainContainer>
		</RootLayout>
	);
}
