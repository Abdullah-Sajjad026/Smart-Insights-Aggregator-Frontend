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
import { DateTime } from "luxon";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader, AiSummaryCard, StatsOverview } from "modules/shared/components";
import { useGetTopicById, useGenerateTopicSummaryMutation, getTopicByIdQueryKey } from "modules/topic";
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
						<Typography variant="body1" color="text.secondary">
							Topic created on {DateTime.fromISO(topic.createdAt).toFormat("MMMM dd, yyyy")}
						</Typography>
					</Box>

					{/* Stats Overview */}
					{stats && <StatsOverview stats={stats} />}

					{/* Tabs */}
					<Paper elevation={2}>
						<Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
							<Tab label="Overview" />
							<Tab label={`Responses (${topic.inputCount || 0})`} />
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
					</Paper>
				</Box>
			</MainContainer>
		</RootLayout>
	);
}

export default withAdmin(TopicDetailPage);
