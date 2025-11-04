import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer } from "modules/shared/components";
import { mockTopics } from "modules/shared/shared.mock-data-v2";

export default function TopicsPage() {
	const router = useRouter();

	const handleTopicClick = topicId => {
		router.push(`/admin/topics/${topicId}`);
	};

	return (
		<RootLayout>
			<MainContainer>
				<Box sx={{ py: 4 }}>
					{/* Page Header */}
					<Box sx={{ mb: 4 }}>
						<Typography variant="h4" gutterBottom fontWeight={600}>
							Topics
						</Typography>
						<Typography variant="body1" color="text.secondary">
							Auto-generated topics from general student feedback
						</Typography>
					</Box>

					{/* Stats */}
					<Box
						sx={{
							mb: 3,
							p: 2,
							bgcolor: "grey.50",
							borderRadius: 1,
							display: "flex",
							gap: 3,
							flexWrap: "wrap",
						}}
					>
						<Box>
							<Typography variant="caption" color="text.secondary">
								Total Topics
							</Typography>
							<Typography variant="h6" fontWeight={600}>
								{mockTopics.length}
							</Typography>
						</Box>
						<Box>
							<Typography variant="caption" color="text.secondary">
								Total Inputs
							</Typography>
							<Typography variant="h6" fontWeight={600}>
								{mockTopics.reduce((sum, topic) => sum + topic.totalInputs, 0)}
							</Typography>
						</Box>
					</Box>

					{/* Topics Grid */}
					<Grid container spacing={3}>
						{mockTopics.map(topic => (
							<Grid item xs={12} md={6} key={topic.id}>
								<Paper
									elevation={2}
									sx={{
										p: 3,
										cursor: "pointer",
										transition: "all 0.2s",
										"&:hover": {
											boxShadow: 6,
											transform: "translateY(-4px)",
										},
									}}
									onClick={() => handleTopicClick(topic.id)}
								>
									{/* Header */}
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "flex-start",
											mb: 2,
										}}
									>
										<Typography variant="h6" fontWeight={600}>
											{topic.name}
										</Typography>
										<Chip
											label={topic.status}
											size="small"
											color={topic.status === "ACTIVE" ? "success" : "default"}
										/>
									</Box>

									{/* Description */}
									<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
										{topic.description}
									</Typography>

									{/* Stats */}
									<Box sx={{ display: "flex", gap: 3, mb: 2 }}>
										<Box>
											<Typography variant="caption" color="text.secondary">
												Inputs
											</Typography>
											<Typography variant="h6" fontWeight={600}>
												{topic.totalInputs}
											</Typography>
										</Box>
										<Box>
											<Typography variant="caption" color="text.secondary">
												Dominant Sentiment
											</Typography>
											<Typography variant="body2" fontWeight={600}>
												{topic.aiAnalysis.overallSentiment.dominant}
											</Typography>
										</Box>
									</Box>

									{/* Sentiment Breakdown */}
									<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
										<Chip
											label={`${topic.aiAnalysis.overallSentiment.positive} Positive`}
											size="small"
											color="success"
											variant="outlined"
										/>
										<Chip
											label={`${topic.aiAnalysis.overallSentiment.negative} Negative`}
											size="small"
											color="error"
											variant="outlined"
										/>
										<Chip
											label={`${topic.aiAnalysis.overallSentiment.neutral} Neutral`}
											size="small"
											variant="outlined"
										/>
									</Box>
								</Paper>
							</Grid>
						))}
					</Grid>
				</Box>
			</MainContainer>
		</RootLayout>
	);
}
