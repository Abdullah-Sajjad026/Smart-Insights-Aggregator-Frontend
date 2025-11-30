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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { DateTime } from "luxon";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader, LoadingButton, AiSummaryCard, StatsOverview } from "modules/shared/components";
import { useGetInquiryById, useGenerateInquirySummaryMutation, getInquiryByIdQueryKey } from "modules/inquiry";
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
	const queryClient = useQueryClient();

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

	const generateSummaryMutation = useGenerateInquirySummaryMutation({
		onSuccess: () => {
			toast.success("Summary generation started. It will appear shortly.");
			queryClient.invalidateQueries(getInquiryByIdQueryKey(inquiryId));
			setTimeout(() => {
				queryClient.invalidateQueries(getInquiryByIdQueryKey(inquiryId));
			}, 2000);
		},
		onError: () => {
			toast.error("Failed to start summary generation");
		},
	});

	const handleGenerateSummary = () => {
		generateSummaryMutation.mutate(inquiryId);
	};

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
					<Box sx={{ mb: 4 }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
							<Typography variant="h3" fontWeight={800} color="text.primary">
								{inquiry.title || "Inquiry"}
							</Typography>
							<Chip
								label={INQUIRY_STATUS_LABELS[inquiry.status] || inquiry.status}
								color={getStatusColor(inquiry.status)}
								variant="filled"
								sx={{ fontWeight: 600 }}
							/>
						</Box>
						<Paper variant="outlined" sx={{ p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
							<Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: "1.1rem" }}>
								{inquiry.body}
							</Typography>
						</Paper>
					</Box>

					{/* Stats Overview */}
					{inquiry.stats && <StatsOverview stats={inquiry.stats} />}



					{/* Tabs */}
					<Paper elevation={2}>
						<Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
							<Tab label="Overview" />
							<Tab label={`Responses (${inquiry.stats?.totalResponses || 0})`} />
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
								</Grid>

								{/* Target Audience */}
								{(inquiry.targetDepartments?.length > 0 || inquiry.targetPrograms?.length > 0 || inquiry.targetSemesters?.length > 0) && (
									<Box sx={{ mt: 3 }}>
										<Typography variant="subtitle2" gutterBottom>Target Audience</Typography>
										<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
											{inquiry.targetDepartments?.map((dept, idx) => (
												<Chip key={`dept-${idx}`} label={dept} size="small" color="primary" variant="outlined" />
											))}
											{inquiry.targetPrograms?.map((prog, idx) => (
												<Chip key={`prog-${idx}`} label={prog} size="small" color="secondary" variant="outlined" />
											))}
											{inquiry.targetSemesters?.map((sem, idx) => (
												<Chip key={`sem-${idx}`} label={`Sem ${sem}`} size="small" variant="outlined" />
											))}
										</Box>
									</Box>
								)}
							</Box>

							{/* AI Summary Section */}
							<Box sx={{ mt: 4 }}>
								{inquiry.aiSummary ? (
									<AiSummaryCard
										summary={inquiry.aiSummary}
										onRegenerate={handleGenerateSummary}
										isRegenerating={generateSummaryMutation.isLoading}
										title="Inquiry Executive Summary"
									/>
								) : (
									<Box>
										<Alert severity="info" sx={{ mb: 2 }}>
											No AI summary generated yet.
										</Alert>
										<LoadingButton
											startIcon={<AutoAwesomeIcon />}
											onClick={handleGenerateSummary}
											loading={generateSummaryMutation.isLoading}
											disabled={!inquiry.stats?.totalResponses}
											variant="contained"
										>
											Generate AI Summary
										</LoadingButton>
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
