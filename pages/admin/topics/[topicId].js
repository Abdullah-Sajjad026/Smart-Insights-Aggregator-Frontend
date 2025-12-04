import { useState } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
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
import ArchiveIcon from "@mui/icons-material/Archive";
import { DateTime } from "luxon";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader, AiSummaryCard, StatsOverview } from "modules/shared/components";
import { useGetTopicById, useGenerateTopicSummaryMutation, useArchiveTopicMutation, getTopicByIdQueryKey } from "modules/topic";
import { toast } from "react-toastify";
import RefreshIcon from "@mui/icons-material/Refresh";
import { InputCard } from "modules/input";
import { withAdmin } from "modules/user";
import {
	useUpdateTopicStatusMutation,
	usePostTopicUpdateMutation,
} from "modules/topic";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import CircleIcon from "@mui/icons-material/Circle";
import { Stack } from "@mui/material";

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
	const [statusDialogOpen, setStatusDialogOpen] = useState(false);
	const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
	const [statusMessage, setStatusMessage] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("");
	const [updateMessage, setUpdateMessage] = useState("");

	// Fetch topic details
	const { data: topic, isLoading, isError } = useGetTopicById(topicId, {
		enabled: !!topicId,
	});

	const queryClient = useQueryClient();

	const generateSummaryMutation = useGenerateTopicSummaryMutation({
		onSuccess: () => {
			toast.success("Summary generation started. It will appear shortly.");
			// Invalidate immediately
			queryClient.invalidateQueries(getTopicByIdQueryKey(topicId));

			// Invalidate again after a delay to allow background job to finish
			setTimeout(() => {
				queryClient.invalidateQueries(getTopicByIdQueryKey(topicId));
			}, 2000);
		},
		onError: () => {
			toast.error("Failed to start summary generation");
		},
	});

	const handleRegenerateSummary = () => {
		generateSummaryMutation.mutate(topicId);
	};

	const archiveMutation = useArchiveTopicMutation({
		onSuccess: () => {
			toast.success("Topic archived successfully!");
			router.push("/admin/topics");
		},
		onError: () => {
			toast.error("Failed to archive topic");
		},
	});

	const handleArchiveClick = () => {
		if (confirm("Are you sure you want to archive this topic?")) {
			archiveMutation.mutate(topicId);
		}
	};

	const updateStatusMutation = useUpdateTopicStatusMutation({
		onSuccess: () => {
			setStatusDialogOpen(false);
			setStatusMessage("");
		},
	});

	const postUpdateMutation = usePostTopicUpdateMutation({
		onSuccess: () => {
			setUpdateDialogOpen(false);
			setUpdateMessage("");
		},
	});

	const handleStatusUpdate = () => {
		if (!selectedStatus) return;
		updateStatusMutation.mutate({
			topicId,
			data: {
				status: selectedStatus,
				message: statusMessage,
			},
		});
	};

	const handlePostUpdate = () => {
		if (!updateMessage) return;
		postUpdateMutation.mutate({
			topicId,
			data: {
				message: updateMessage,
			},
		});
	};

	const openStatusDialog = () => {
		setSelectedStatus(topic?.status || "Submitted");
		setStatusMessage("");
		setStatusDialogOpen(true);
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

	// Calculate stats from inputs
	const calculateStats = () => {
		if (!topic?.inputs) return null;

		const inputs = topic.inputs;
		const totalResponses = inputs.length;

		const sentimentBreakdown = {
			Positive: inputs.filter(i => i.sentiment === "Positive").length,
			Neutral: inputs.filter(i => i.sentiment === "Neutral").length,
			Negative: inputs.filter(i => i.sentiment === "Negative").length,
		};

		const severityBreakdown = {
			Low: inputs.filter(i => i.metrics?.severity === 1).length,
			Medium: inputs.filter(i => i.metrics?.severity === 2).length,
			High: inputs.filter(i => i.metrics?.severity === 3).length,
		};

		const averageQuality = totalResponses > 0
			? inputs.reduce((sum, i) => sum + (i.metrics?.quality || 0), 0) / totalResponses * 10 // Convert 0-1 to 0-10
			: 0;

		return {
			totalResponses,
			sentimentBreakdown,
			severityBreakdown,
			averageQuality
		};
	};

	const stats = calculateStats();

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
					<Box sx={{ display: "flex", justifyContent: "flex-end", mb: -5 }}>
						<Button
							variant="outlined"
							color="warning"
							startIcon={<ArchiveIcon />}
							onClick={handleArchiveClick}
							disabled={archiveMutation.isLoading}
						>
							Archive Topic
						</Button>
					</Box>

					{/* Header */}
					<Box sx={{ mb: 4 }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
							<Typography variant="h3" fontWeight={800} color="text.primary">
								{topic.name}
							</Typography>
							{/* {topic.department && (
								<Chip
									label={topic.department}
									color="primary"
									variant="filled"
									size="medium"
									sx={{ fontWeight: 600 }}
								/>
							)} */}

						</Box>
						<Stack direction="row" justifyContent="space-between" alignItems="center" gap={2} >
						<Typography variant="body1" color="text.secondary">
							Topic created on {DateTime.fromISO(topic.createdAt).toFormat("MMMM dd, yyyy")}
						</Typography>
						<Stack direction="row" gap={2} alignItems="center">
							<Chip
								label={topic.status || "Submitted"}
								color={
									topic.status === "Completed"
										? "success"
										: topic.status === "InProgress"
										? "info"
										: topic.status === "Rejected"
										? "error"
										: "default"
								}
								variant="filled"
								size="medium"
								sx={{ fontWeight: 600 }}
							/>
							<Button
								size="small"
								startIcon={<EditIcon />}
								onClick={openStatusDialog}
							>
								Change Status
							</Button>
						</Stack>
						</Stack>
					</Box>

					{/* Stats Overview */}
					{stats && <StatsOverview stats={stats} />}

					{/* Tabs */}
					<Paper elevation={2}>
						<Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
							<Tab label="Overview" />
							<Tab label={`Responses (${topic.inputCount || 0})`} />
							<Tab label={`Updates (${topic.updates?.length || 0})`} />
						</Tabs>

						{/* Tab 1: Overview */}
						<TabPanel value={activeTab} index={0}>
							<Box
								sx={{
									px: 3,
								}}
							>
							{/* AI Summary Section */}
							{topic.aiSummary ? (
								<AiSummaryCard
									summary={topic.aiSummary}
									onRegenerate={handleRegenerateSummary}
									isRegenerating={generateSummaryMutation.isLoading}
									title="Topic Executive Summary"
								/>
							) : (
								<Box>
									<Alert severity="info" sx={{ mb: 2 }}>
										No AI summary generated yet. Summaries are generated periodically for active topics.
									</Alert>
									<Button
										startIcon={<RefreshIcon />}
										onClick={handleRegenerateSummary}
										disabled={generateSummaryMutation.isLoading}
										variant="contained"
									>
										Generate Summary Now
									</Button>
								</Box>
							)}
							</Box>
						</TabPanel>

						{/* Tab 2: Inputs */}
						<TabPanel value={activeTab} index={1}>
							<Box
								sx={{
									px: 3,
								}}
							>
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
							</Box>
						</TabPanel>
						{/* Tab 3: Updates */}
						<TabPanel value={activeTab} index={2}>
							<Box sx={{ px: 3 }}>
								<Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
									<Button
										variant="contained"
										startIcon={<SendIcon />}
										onClick={() => setUpdateDialogOpen(true)}
									>
										Post Update
									</Button>
								</Box>

								{topic.updates && topic.updates.length > 0 ? (
									<Box sx={{ mt: 2 }}>
										{topic.updates.map((update, index) => (
											<Box key={update.id} sx={{ display: "flex", mb: 3 }}>
												{/* Time and Author */}
												<Box sx={{ minWidth: 120, textAlign: "right", mr: 2, pt: 0.5 }}>
													<Typography variant="body2" color="text.secondary" fontWeight={500}>
														{DateTime.fromISO(update.createdAt).toFormat("MMM dd, HH:mm")}
													</Typography>
													<Typography variant="caption" color="text.secondary">
														{update.adminName}
													</Typography>
												</Box>

												{/* Timeline Line and Dot */}
												<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mr: 2 }}>
													<Box
														sx={{
															width: 32,
															height: 32,
															borderRadius: "50%",
															bgcolor: update.newStatus ? "primary.main" : "grey.300",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															color: "white",
															zIndex: 1,
														}}
													>
														{update.newStatus ? (
															<EditIcon fontSize="small" />
														) : (
															<SendIcon fontSize="small" />
														)}
													</Box>
													{index < topic.updates.length - 1 && (
														<Box
															sx={{
																width: 2,
																flexGrow: 1,
																bgcolor: "grey.300",
																my: 0.5,
															}}
														/>
													)}
												</Box>

												{/* Content */}
												<Box sx={{ flexGrow: 1, pb: index < topic.updates.length - 1 ? 2 : 0 }}>
													<Paper elevation={1} sx={{ p: 2, bgcolor: "grey.50" }}>
														{update.newStatus && (
															<Chip
																label={`Status changed to: ${update.newStatus}`}
																size="small"
																color="primary"
																sx={{ mb: 1 }}
															/>
														)}
														<Typography variant="body1">{update.message}</Typography>
													</Paper>
												</Box>
											</Box>
										))}
									</Box>
								) : (
									<Alert severity="info">
										No updates posted yet. Post an update to inform students about
										progress.
									</Alert>
								)}
							</Box>
						</TabPanel>
					</Paper>
				</Box>

				{/* Status Update Dialog */}
				<Dialog
					open={statusDialogOpen}
					onClose={() => setStatusDialogOpen(false)}
					maxWidth="sm"
					fullWidth
				>
					<DialogTitle>Update Topic Status</DialogTitle>
					<DialogContent>
						<Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
							<TextField
								select
								label="Status"
								value={selectedStatus}
								onChange={e => setSelectedStatus(e.target.value)}
								fullWidth
							>
								<MenuItem value="Submitted">Submitted</MenuItem>
								<MenuItem value="UnderReview">Under Review</MenuItem>
								<MenuItem value="InProgress">In Progress</MenuItem>
								<MenuItem value="Completed">Completed</MenuItem>
								<MenuItem value="Planned">Planned</MenuItem>
								<MenuItem value="Rejected">Rejected</MenuItem>
							</TextField>
							<TextField
								label="Message (Optional)"
								multiline
								rows={3}
								value={statusMessage}
								onChange={e => setStatusMessage(e.target.value)}
								placeholder="Explain why the status is changing..."
								fullWidth
							/>
						</Box>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
						<Button
							onClick={handleStatusUpdate}
							variant="contained"
							disabled={updateStatusMutation.isLoading}
						>
							Update Status
						</Button>
					</DialogActions>
				</Dialog>

				{/* Post Update Dialog */}
				<Dialog
					open={updateDialogOpen}
					onClose={() => setUpdateDialogOpen(false)}
					maxWidth="sm"
					fullWidth
				>
					<DialogTitle>Post Update</DialogTitle>
					<DialogContent>
						<Box sx={{ mt: 2 }}>
							<TextField
								label="Update Message"
								multiline
								rows={4}
								value={updateMessage}
								onChange={e => setUpdateMessage(e.target.value)}
								placeholder="Share progress or information with students..."
								fullWidth
								required
							/>
						</Box>
					</DialogContent>
					<DialogActions>
						<Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
						<Button
							onClick={handlePostUpdate}
							variant="contained"
							disabled={postUpdateMutation.isLoading || !updateMessage}
						>
							Post Update
						</Button>
					</DialogActions>
				</Dialog>
			</MainContainer>
		</RootLayout>
	);
}

export default withAdmin(TopicDetailPage);
