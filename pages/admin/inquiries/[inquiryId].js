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
import { useGetInquiryById } from "modules/inquiry";
import { useGetAllInputs, InputCard } from "modules/input";
import { withAdmin } from "modules/user";
import { InquiryStatus, Sentiment, InputStatus } from "types/api";
import { INQUIRY_STATUS_LABELS, SENTIMENT_COLORS, INPUT_STATUS_COLORS } from "constants/enums";

function TabPanel({ children, value, index }) {
	return (
		<div role="tabpanel" hidden={value !== index}>
			{value === index && <Box sx={{ py: 3 }}>{children}</Box>}
		</div>
	);
}

function InquiryDetailPage() {
	const router = useRouter();
	const { inquiryId } = router.query;
	const [activeTab, setActiveTab] = useState(0);

	// Fetch inquiry details
	const { data: inquiry, isLoading: inquiryLoading, isError: inquiryError } = useGetInquiryById(inquiryId, {
		enabled: !!inquiryId,
	});

	// Fetch inputs for this inquiry
	const { data: inputsData, isLoading: inputsLoading } = useGetAllInputs({
		inquiryId,
		page: 1,
		pageSize: 100,
	}, {
		enabled: !!inquiryId,
	});

	const inquiryInputs = inputsData?.data || [];

	// Loading state
	if (inquiryLoading || !inquiryId) {
		return (
			<RootLayout>
				<MainContainer>
					<Loader />
				</MainContainer>
			</RootLayout>
		);
	}

	// Error state
	if (inquiryError || !inquiry) {
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

	const getStatusColor = (status) => {
		switch (status) {
			case InquiryStatus.Sent:
				return "success";
			case InquiryStatus.Draft:
				return "warning";
			case InquiryStatus.Closed:
				return "default";
			default:
				return "default";
		}
	};

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
								{inquiry.title || "Inquiry"}
							</Typography>
							<Chip
								label={INQUIRY_STATUS_LABELS[inquiry.status] || inquiry.status}
								color={getStatusColor(inquiry.status)}
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
							<Tab label="Overview" />
							<Tab label={`Responses (${inquiry.totalInputs || 0})`} />
						</Tabs>

						{/* Tab 1: Overview */}
						<TabPanel value={activeTab} index={0}>
							{/* Inquiry Details */}
							<Box sx={{ mb: 4 }}>
								<Typography variant="h6" gutterBottom fontWeight={600}>
									Inquiry Details
								</Typography>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={6} md={4}>
										<Typography variant="caption" color="text.secondary">
											Created Date
										</Typography>
										<Typography variant="body2">
											{DateTime.fromISO(inquiry.createdAt).toFormat("MMM dd, yyyy 'at' hh:mm a")}
										</Typography>
									</Grid>
									{inquiry.closedAt && (
										<Grid item xs={12} sm={6} md={4}>
											<Typography variant="caption" color="text.secondary">
												Closed Date
											</Typography>
											<Typography variant="body2">
												{DateTime.fromISO(inquiry.closedAt).toFormat("MMM dd, yyyy 'at' hh:mm a")}
											</Typography>
										</Grid>
									)}
									<Grid item xs={12} sm={6} md={4}>
										<Typography variant="caption" color="text.secondary">
											Total Responses
										</Typography>
										<Typography variant="h6" fontWeight={600} color="primary.main">
											{inquiry.totalInputs || 0}
										</Typography>
									</Grid>
								</Grid>

								{/* Target Audience */}
								{inquiry.targetDepartments?.length > 0 && (
									<Box sx={{ mt: 3 }}>
										<Typography variant="caption" color="text.secondary" display="block" gutterBottom>
											Target Departments
										</Typography>
										<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
											{inquiry.targetDepartments.map((dept, idx) => (
												<Chip key={idx} label={dept} size="small" color="primary" variant="outlined" />
											))}
										</Box>
									</Box>
								)}

								{inquiry.targetPrograms?.length > 0 && (
									<Box sx={{ mt: 2 }}>
										<Typography variant="caption" color="text.secondary" display="block" gutterBottom>
											Target Programs
										</Typography>
										<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
											{inquiry.targetPrograms.map((program, idx) => (
												<Chip key={idx} label={program} size="small" color="secondary" variant="outlined" />
											))}
										</Box>
									</Box>
								)}

								{inquiry.targetSemesters?.length > 0 && (
									<Box sx={{ mt: 2 }}>
										<Typography variant="caption" color="text.secondary" display="block" gutterBottom>
											Target Semesters
										</Typography>
										<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
											{inquiry.targetSemesters.map((semester, idx) => (
												<Chip key={idx} label={semester} size="small" variant="outlined" />
											))}
										</Box>
									</Box>
								)}
								{/* AI Summary Section */}
								{inquiry.aiSummary && (
									<Box sx={{ mt: 4, mb: 2 }}>
										<Typography variant="h6" fontWeight={600} gutterBottom>
											AI Executive Summary
										</Typography>
										<Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: "primary.50" }}>
											<Typography variant="body1" paragraph>
												{inquiry.aiSummary.executiveSummaryData?.["summary"] ||
												 Object.values(inquiry.aiSummary.executiveSummaryData || {}).join(" ") ||
												 "No summary available."}
											</Typography>
											<Typography variant="caption" color="text.secondary">
												Generated on{" "}
												{DateTime.fromISO(inquiry.aiSummary.generatedAt).toFormat(
													"MMM dd, yyyy HH:mm"
												)}
											</Typography>
										</Paper>

										{/* Suggested Actions */}
										{inquiry.aiSummary.suggestedPrioritizedActions?.length > 0 && (
											<>
												<Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 2 }}>
													Suggested Actions
												</Typography>
												<Grid container spacing={2}>
													{inquiry.aiSummary.suggestedPrioritizedActions.map((action, index) => (
														<Grid item xs={12} md={6} key={index}>
															<Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
																<Typography variant="subtitle2" fontWeight={700} gutterBottom>
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
								)}
							</Box>
						</TabPanel>

						{/* Tab 2: Inputs */}
						<TabPanel value={activeTab} index={1}>
							{inputsLoading ? (
								<Loader height="auto" />
							) : inquiryInputs.length > 0 ? (
								<Grid container spacing={2}>
									{inquiryInputs.map(input => (
										<Grid item xs={12} key={input.id}>
											<InputCard
												input={input}
												showInquiryLink={false}
												onClick={() => handleInputClick(input.id)}
											/>
										</Grid>
									))}
								</Grid>
							) : (
								<Alert severity="info">No responses received yet for this inquiry.</Alert>
							)}
						</TabPanel>
					</Paper>
				</Box>
			</MainContainer>
		</RootLayout>
	);
}

export default withAdmin(InquiryDetailPage);
