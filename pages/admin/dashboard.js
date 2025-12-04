import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader } from "modules/shared/components";
import { useGetDashboardStats } from "modules/input/apis";
import { useGetInquiryStats } from "modules/inquiry/apis";
import { useGetUserStats } from "modules/user/apis";
import { useGetTopicStats } from "modules/topic/apis";
import { withAdmin } from "modules/user";
import { Sentiment } from "types/api";

import {
	StatCardSkeleton,
	ChartCardSkeleton,
} from "modules/shared/components/dashboard-skeletons";

function AdminDashboardPage() {
	const router = useRouter();

	// Fetch all stats
	const {
		data: inputStats,
		isLoading: inputLoading,
		isError: inputError,
	} = useGetDashboardStats();
	const { data: inquiryStats, isLoading: inquiryLoading } =
		useGetInquiryStats();
	const { data: userStats, isLoading: userLoading } = useGetUserStats();
	const { data: topicStats, isLoading: topicLoading } = useGetTopicStats();

	if (inputError) {
		return (
			<RootLayout>
				<MainContainer>
					<Box sx={{ py: 4 }}>
						<Alert severity="error">
							Failed to load dashboard statistics. Please try again later.
						</Alert>
					</Box>
				</MainContainer>
			</RootLayout>
		);
	}

	return (
		<RootLayout>
			<MainContainer>
				<Box sx={{ py: 4 }}>
					{/* Page Header */}
					<Box sx={{ mb: 4 }}>
						<Typography variant="h4" gutterBottom fontWeight={600}>
							Dashboard & Analytics
						</Typography>
						<Typography variant="body1" color="text.secondary">
							Overview of student feedback and system statistics
						</Typography>
					</Box>

					{/* Stats Cards Row 1 */}
					<Grid container spacing={3} sx={{ mb: 4 }}>
						{/* Total Inputs */}
						<Grid item xs={12} sm={6} md={4}>
							{inputLoading ? (
								<StatCardSkeleton />
							) : (
								<Paper elevation={2} sx={{ p: 3, height: "100%" }}>
									<Typography
										variant="caption"
										color="text.secondary"
										fontWeight={600}
									>
										TOTAL FEEDBACK
									</Typography>
									<Typography
										variant="h3"
										fontWeight={700}
										color="primary.main"
									>
										{inputStats?.totalInputs || 0}
									</Typography>
									<Typography
										variant="caption"
										color="text.secondary"
										sx={{ mt: 1, display: "block" }}
									>
										{inputStats?.generalInputs || 0} general,{" "}
										{inputStats?.inquiryLinkedInputs || 0} responses
									</Typography>
								</Paper>
							)}
						</Grid>

						{/* Total Inquiries */}
						<Grid item xs={12} sm={6} md={4}>
							{inquiryLoading ? (
								<StatCardSkeleton />
							) : (
								<Paper elevation={2} sx={{ p: 3, height: "100%" }}>
									<Typography
										variant="caption"
										color="text.secondary"
										fontWeight={600}
									>
										ACTIVE INQUIRIES
									</Typography>
									<Typography
										variant="h3"
										fontWeight={700}
										color="secondary.main"
									>
										{inquiryStats?.activeInquiries || 0}
									</Typography>
									<Typography
										variant="caption"
										color="text.secondary"
										sx={{ mt: 1, display: "block" }}
									>
										{inquiryStats?.totalInquiries || 0} total created
									</Typography>
								</Paper>
							)}
						</Grid>

						{/* Avg Quality Score */}
						<Grid item xs={12} sm={6} md={4}>
							{inputLoading ? (
								<StatCardSkeleton />
							) : (
								<Paper
									elevation={2}
									sx={{ p: 3, height: "100%", bgcolor: "success.light" }}
								>
									<Typography
										variant="caption"
										color="success.dark"
										fontWeight={600}
									>
										AVG QUALITY SCORE
									</Typography>
									<Typography
										variant="h3"
										fontWeight={700}
										color="success.dark"
									>
										{inputStats?.averageQualityScore?.toFixed(1) || "N/A"}
										<Typography
											component="span"
											variant="h5"
											color="success.dark"
										>
											/10
										</Typography>
									</Typography>
									<Typography
										variant="caption"
										color="success.dark"
										sx={{ mt: 1, display: "block" }}
									>
										Based on AI analysis
									</Typography>
								</Paper>
							)}
						</Grid>
					</Grid>

					{/* Stats Cards Row 2 - Severity & Quality */}
					<Grid container spacing={3} sx={{ mb: 4 }}>
						<Grid item xs={12} sm={6} md={4}>
							{inputLoading ? (
								<StatCardSkeleton />
							) : (
								<Paper
									elevation={2}
									sx={{ p: 3, bgcolor: "error.light", height: "100%" }}
								>
									<Typography variant="caption" color="white" fontWeight={600}>
										HIGH SEVERITY
									</Typography>
									<Typography variant="h3" fontWeight={700} color="white">
										{inputStats?.highSeverity || 0}
									</Typography>
									<Typography
										variant="caption"
										color="white"
										sx={{ mt: 1, display: "block" }}
									>
										Requires immediate attention
									</Typography>
								</Paper>
							)}
						</Grid>

						<Grid item xs={12} sm={6} md={4}>
							{inputLoading ? (
								<StatCardSkeleton />
							) : (
								<Paper
									elevation={2}
									sx={{ p: 3, bgcolor: "warning.light", height: "100%" }}
								>
									<Typography
										variant="caption"
										color="warning.dark"
										fontWeight={600}
									>
										MEDIUM SEVERITY
									</Typography>
									<Typography
										variant="h3"
										fontWeight={700}
										color="warning.dark"
									>
										{inputStats?.mediumSeverity || 0}
									</Typography>
									<Typography
										variant="caption"
										color="warning.dark"
										sx={{ mt: 1, display: "block" }}
									>
										Should be addressed soon
									</Typography>
								</Paper>
							)}
						</Grid>

						<Grid item xs={12} sm={6} md={4}>
							{inputLoading ? (
								<StatCardSkeleton />
							) : (
								<Paper
									elevation={2}
									sx={{ p: 3, bgcolor: "info.light", height: "100%" }}
								>
									<Typography
										variant="caption"
										color="info.dark"
										fontWeight={600}
									>
										LOW SEVERITY
									</Typography>
									<Typography variant="h3" fontWeight={700} color="info.dark">
										{inputStats?.lowSeverity || 0}
									</Typography>
									<Typography
										variant="caption"
										color="info.dark"
										sx={{ mt: 1, display: "block" }}
									>
										General feedback & suggestions
									</Typography>
								</Paper>
							)}
						</Grid>
					</Grid>

					{/* Sentiment Distribution */}
					<Grid container spacing={3} sx={{ mb: 4 }}>
						<Grid item xs={12} md={6}>
							{inputLoading ? (
								<ChartCardSkeleton />
							) : (
								<Paper elevation={2} sx={{ p: 3, height: "100%" }}>
									<Typography variant="h6" gutterBottom fontWeight={600}>
										Sentiment Distribution
									</Typography>
									<Box sx={{ mt: 2 }}>
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												mb: 2,
											}}
										>
											<Box
												sx={{ display: "flex", alignItems: "center", gap: 1 }}
											>
												<Box
													sx={{
														width: 16,
														height: 16,
														borderRadius: "50%",
														bgcolor: "success.main",
													}}
												/>
												<Typography variant="body2">Positive</Typography>
											</Box>
											<Typography variant="h6" fontWeight={600}>
												{inputStats?.positiveCount || 0}
											</Typography>
										</Box>

										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												mb: 2,
											}}
										>
											<Box
												sx={{ display: "flex", alignItems: "center", gap: 1 }}
											>
												<Box
													sx={{
														width: 16,
														height: 16,
														borderRadius: "50%",
														bgcolor: "grey.500",
													}}
												/>
												<Typography variant="body2">Neutral</Typography>
											</Box>
											<Typography variant="h6" fontWeight={600}>
												{inputStats?.neutralCount || 0}
											</Typography>
										</Box>

										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												mb: 2,
											}}
										>
											<Box
												sx={{ display: "flex", alignItems: "center", gap: 1 }}
											>
												<Box
													sx={{
														width: 16,
														height: 16,
														borderRadius: "50%",
														bgcolor: "error.main",
													}}
												/>
												<Typography variant="body2">Negative</Typography>
											</Box>
											<Typography variant="h6" fontWeight={600}>
												{inputStats?.negativeCount || 0}
											</Typography>
										</Box>
									</Box>
								</Paper>
							)}
						</Grid>

						{/* Quick Actions */}
						<Grid item xs={12} md={6}>
							<Paper elevation={2} sx={{ p: 3, height: "100%" }}>
								<Typography variant="h6" gutterBottom fontWeight={600}>
									Quick Actions
								</Typography>
								<Box
									sx={{
										mt: 2,
										display: "flex",
										flexDirection: "column",
										gap: 2,
									}}
								>
									<Box
										onClick={() => router.push("/admin/inquiries")}
										sx={{
											p: 2,
											border: 1,
											borderColor: "divider",
											borderRadius: 1,
											cursor: "pointer",
											"&:hover": { bgcolor: "action.hover" },
										}}
									>
										<Typography variant="body1" fontWeight={600}>
											Manage Inquiries
										</Typography>
										<Typography variant="caption" color="text.secondary">
											Create and send targeted inquiries to students
										</Typography>
									</Box>

									<Box
										onClick={() => router.push("/admin/inputs/[inputId]")}
										sx={{
											p: 2,
											border: 1,
											borderColor: "divider",
											borderRadius: 1,
											cursor: "pointer",
											"&:hover": { bgcolor: "action.hover" },
										}}
									>
										<Typography variant="body1" fontWeight={600}>
											Review Feedback
										</Typography>
										<Typography variant="caption" color="text.secondary">
											View and respond to student feedback
										</Typography>
									</Box>

									<Box
										onClick={() => router.push("/admin/topics")}
										sx={{
											p: 2,
											border: 1,
											borderColor: "divider",
											borderRadius: 1,
											cursor: "pointer",
											"&:hover": { bgcolor: "action.hover" },
										}}
									>
										<Typography variant="body1" fontWeight={600}>
											Manage Topics
										</Typography>
										<Typography variant="caption" color="text.secondary">
											Organize feedback into topics and themes
										</Typography>
									</Box>
								</Box>
							</Paper>
						</Grid>
					</Grid>
				</Box>
			</MainContainer>
		</RootLayout>
	);
}

export default withAdmin(AdminDashboardPage);
