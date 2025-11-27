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
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DateTime } from "luxon";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader } from "modules/shared/components";
import { useGetTopicById, useGenerateTopicSummaryMutation } from "modules/topic";
import { toast } from "react-toastify";
import RefreshIcon from "@mui/icons-material/Refresh";
import { InputCard } from "modules/input";
import { withAdmin } from "modules/user";

function TabPanel({ children, value, index }) {
	return (
		<div role="tabpanel" hidden={value !== index}>
			{value === index && <Box sx={{ py: 3 }}>{children}</Box>}
		</div>
	);
}

function TopicDetailPage() {
	const router = useRouter();
	const { topicId } = router.query;
	const [activeTab, setActiveTab] = useState(0);

	// Fetch topic details
	const { data: topic, isLoading, isError } = useGetTopicById(topicId, {
		enabled: !!topicId,
	});

	const generateSummaryMutation = useGenerateTopicSummaryMutation({
		onSuccess: () => {
			toast.success("Summary generation started. It may take a few moments to appear.");
		},
		onError: () => {
			toast.error("Failed to start summary generation");
		},
	});

	const handleRegenerateSummary = () => {
		generateSummaryMutation.mutate(topicId);
	};

	// Loading state
	if (isLoading || !topicId) {
		return (
			<RootLayout>
				<MainContainer>
					<Loader />
				</MainContainer>
			</RootLayout>
		);
	}

	// Error state
	if (isError || !topic) {
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
							<Typography variant="h4" fontWeight={700}>
								{topic.name}
							</Typography>
							{topic.department && (
								<Chip label={topic.department} color="primary" variant="outlined" size="small" />
							)}
						</Box>
						<Typography variant="body2" color="text.secondary">
							Created on {DateTime.fromISO(topic.createdAt).toFormat("MMM dd, yyyy")} • {topic.inputCount} Responses
						</Typography>
					</Box>

					{/* Tabs */}
					<Paper elevation={2}>
						<Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
							<Tab label="Overview" />
							<Tab label={`Responses (${topic.inputCount || 0})`} />
						</Tabs>

						{/* Tab 1: Overview */}
						<TabPanel value={activeTab} index={0}>
							{/* AI Summary Section */}
							{topic.aiSummary ? (
								<Box>
									<Typography variant="h6" fontWeight={600} gutterBottom>
										AI Executive Summary
									</Typography>
									<Button
										startIcon={<RefreshIcon />}
										onClick={handleRegenerateSummary}
										disabled={generateSummaryMutation.isLoading}
										size="small"
										sx={{ float: "right", mt: -5 }}
									>
										Regenerate Summary
									</Button>
									<Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: "primary.50" }}>
										<Typography variant="body1" paragraph>
											{topic.aiSummary.executiveSummaryData?.["summary"] ||
											 Object.values(topic.aiSummary.executiveSummaryData || {}).join(" ") ||
											 "No summary available."}
										</Typography>
										<Typography variant="caption" color="text.secondary">
											Generated on{" "}
											{DateTime.fromISO(topic.aiSummary.generatedAt).toFormat(
												"MMM dd, yyyy HH:mm"
											)}
										</Typography>
									</Paper>

									{/* Suggested Actions */}
									{topic.aiSummary.suggestedPrioritizedActions?.length > 0 && (
										<>
											<Typography variant="h6" fontWeight={600} gutterBottom>
												Suggested Actions
											</Typography>
											<Grid container spacing={2}>
												{topic.aiSummary.suggestedPrioritizedActions.map((action, index) => (
													<Grid item xs={12} md={6} key={index}>
														<Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
															<Typography variant="subtitle1" fontWeight={700} gutterBottom>
																{action.action}
															</Typography>
															<Box sx={{ mb: 1 }}>
																<Chip
																	label={action.impact}
																	size="small"
																	color={
																		action.impact === "High"
																			? "error"
																			: action.impact === "Medium"
																			? "warning"
																			: "info"
																	}
																	sx={{ mr: 1 }}
																/>
																<Typography variant="caption" color="text.secondary">
																	{action.responseCount} responses
																</Typography>
															</Box>
															<Typography variant="body2" color="text.secondary" paragraph>
																{action.supportingReasoning}
															</Typography>
														</Paper>
													</Grid>
												))}
											</Grid>
										</>
									)}
								</Box>
							) : (
								<Box>
									<Alert severity="info">
										No AI summary generated yet. Summaries are generated periodically for active topics.
									</Alert>
									<Button
										startIcon={<RefreshIcon />}
										onClick={handleRegenerateSummary}
										disabled={generateSummaryMutation.isLoading}
										variant="outlined"
										sx={{ mt: 2 }}
									>
										Generate Summary Now
									</Button>
								</Box>
							)}
						</TabPanel>

						{/* Tab 2: Inputs */}
						<TabPanel value={activeTab} index={1}>
							{topic.inputs && topic.inputs.length > 0 ? (
								<Grid container spacing={2}>
									{topic.inputs.map(input => (
										<Grid item xs={12} key={input.id}>
											<InputCard
												input={input}
												showTopicLink={false}
												onClick={() => handleInputClick(input.id)}
											/>
										</Grid>
									))}
								</Grid>
							) : (
								<Alert severity="info">No responses linked to this topic yet.</Alert>
							)}
						</TabPanel>
					</Paper>
				</Box>
			</MainContainer>
		</RootLayout>
	);
}

export default withAdmin(TopicDetailPage);
