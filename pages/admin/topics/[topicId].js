import { useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Alert from "@mui/material/Alert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DateTime } from "luxon";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader } from "modules/shared/components";
import { useGetTopicById } from "modules/topic";
import { useGetAllInputs, InputCard } from "modules/input";
import { withAdmin } from "modules/user";

function TopicDetailsPage() {
	const router = useRouter();
	const { topicId } = router.query;
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);

	// Fetch topic details
	const {
		data: topic,
		isLoading: isTopicLoading,
		isError: isTopicError,
	} = useGetTopicById(topicId, {
		enabled: !!topicId,
	});

	// Fetch inputs linked to this topic
	const {
		data: inputsData,
		isLoading: isInputsLoading,
		isError: isInputsError,
	} = useGetAllInputs(
		{
			topicId,
			page,
			pageSize,
		},
		{
			enabled: !!topicId,
		}
	);

	const handleBack = () => {
		router.push("/admin/topics");
	};

	if (isTopicLoading) {
		return (
			<RootLayout>
				<MainContainer>
					<Loader height="auto" />
				</MainContainer>
			</RootLayout>
		);
	}

	if (isTopicError || !topic) {
		return (
			<RootLayout>
				<MainContainer>
					<Alert severity="error" sx={{ mt: 4 }}>
						Failed to load topic details.
					</Alert>
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={handleBack}
						sx={{ mt: 2 }}
					>
						Back to Topics
					</Button>
				</MainContainer>
			</RootLayout>
		);
	}

	return (
		<RootLayout>
			<MainContainer>
				<Box sx={{ py: 4 }}>
					{/* Header */}
					<Box sx={{ mb: 4 }}>
						<Button
							startIcon={<ArrowBackIcon />}
							onClick={handleBack}
							sx={{ mb: 2 }}
						>
							Back to Topics
						</Button>
						<Typography variant="h4" fontWeight={700} gutterBottom>
							{topic.name}
						</Typography>
						<Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
							{topic.department && (
								<Chip label={topic.department} color="primary" variant="outlined" />
							)}
							<Typography variant="body2" color="text.secondary">
								Created on{" "}
								{DateTime.fromISO(topic.createdAt).toFormat("MMM dd, yyyy")}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								• {topic.inputCount} Inputs Linked
							</Typography>
						</Box>
					</Box>

					{/* AI Summary Section */}
					{topic.aiSummary && (
						<Box sx={{ mb: 6 }}>
							<Typography variant="h5" fontWeight={600} gutterBottom>
								AI Executive Summary
							</Typography>
							<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
								<Typography variant="body1" paragraph>
									{topic.aiSummary.executiveSummaryData}
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
									<Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4 }}>
										Suggested Actions
									</Typography>
									<Grid container spacing={3}>
										{topic.aiSummary.suggestedPrioritizedActions.map((action, index) => (
											<Grid item xs={12} md={6} key={index}>
												<Card variant="outlined" sx={{ height: "100%" }}>
													<CardContent>
														<Typography variant="subtitle1" fontWeight={700} gutterBottom>
															{action.action}
														</Typography>
														<Box sx={{ mb: 2 }}>
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
																Based on {action.responseCount} responses
															</Typography>
														</Box>
														<Typography variant="body2" paragraph>
															{action.supportingReasoning}
														</Typography>
														{action.challenges && (
															<Box sx={{ mt: 2, p: 1.5, bgcolor: "grey.50", borderRadius: 1 }}>
																<Typography variant="caption" fontWeight={600} display="block">
																	Potential Challenges:
																</Typography>
																<Typography variant="caption" color="text.secondary">
																	{action.challenges}
																</Typography>
															</Box>
														)}
													</CardContent>
												</Card>
											</Grid>
										))}
									</Grid>
								</>
							)}
						</Box>
					)}

					<Divider sx={{ my: 4 }} />

					{/* Linked Inputs Section */}
					<Box>
						<Typography variant="h5" fontWeight={600} gutterBottom>
							Linked Feedback ({topic.inputCount})
						</Typography>

						{isInputsLoading ? (
							<Loader height="200px" />
						) : isInputsError ? (
							<Alert severity="error">Failed to load inputs.</Alert>
						) : inputsData?.data?.length > 0 ? (
							<Grid container spacing={3}>
								{inputsData.data.map((input) => (
									<Grid item xs={12} key={input.id}>
										<InputCard input={input} />
									</Grid>
								))}
							</Grid>
						) : (
							<Typography color="text.secondary">
								No feedback linked to this topic yet.
							</Typography>
						)}
					</Box>
				</Box>
			</MainContainer>
		</RootLayout>
	);
}

export default withAdmin(TopicDetailsPage);
