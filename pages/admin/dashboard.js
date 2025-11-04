import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import {
	MainContainer,
	Loader,
	ImportanceBadge,
	SentimentIndicator,
	ThemeChip,
} from "modules/shared/components";
import { InputCard } from "modules/input/components";
import { useGetDashboardStats } from "modules/input/apis";

export default function AdminDashboardPage() {
	const router = useRouter();
	const { data: stats, isLoading, isError } = useGetDashboardStats();

	if (isLoading) {
		return (
			<RootLayout>
				<MainContainer>
					<Loader />
				</MainContainer>
			</RootLayout>
		);
	}

	if (isError) {
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
							Overview of student feedback and AI-powered insights
						</Typography>
					</Box>

					{/* Stats Cards */}
					<Grid container spacing={3} sx={{ mb: 4 }}>
						{/* Total Inputs */}
						<Grid item xs={12} sm={6} md={3}>
							<Paper elevation={2} sx={{ p: 3 }}>
								<Typography variant="caption" color="text.secondary">
									Total Inputs
								</Typography>
								<Typography variant="h4" fontWeight={700} color="primary.main">
									{stats.totalInputs}
								</Typography>
							</Paper>
						</Grid>

						{/* Total Inquiries */}
						<Grid item xs={12} sm={6} md={3}>
							<Paper elevation={2} sx={{ p: 3 }}>
								<Typography variant="caption" color="text.secondary">
									Total Inquiries
								</Typography>
								<Typography variant="h4" fontWeight={700}>
									{stats.totalInquiries}
								</Typography>
							</Paper>
						</Grid>

						{/* Active Inquiries */}
						<Grid item xs={12} sm={6} md={3}>
							<Paper elevation={2} sx={{ p: 3 }}>
								<Typography variant="caption" color="text.secondary">
									Active Inquiries
								</Typography>
								<Typography variant="h4" fontWeight={700} color="success.main">
									{stats.activeInquiries}
								</Typography>
							</Paper>
						</Grid>

						{/* Processing Rate */}
						<Grid item xs={12} sm={6} md={3}>
							<Paper elevation={2} sx={{ p: 3 }}>
								<Typography variant="caption" color="text.secondary">
									AI Processing Rate
								</Typography>
								<Typography variant="h4" fontWeight={700} color="primary.main">
									{stats.processingRate}%
								</Typography>
							</Paper>
						</Grid>
					</Grid>

					{/* Sentiment & Importance Breakdown */}
					<Grid container spacing={3} sx={{ mb: 4 }}>
						{/* Sentiment Breakdown */}
						<Grid item xs={12} md={6}>
							<Paper elevation={2} sx={{ p: 3 }}>
								<Typography variant="h6" gutterBottom fontWeight={600}>
									Sentiment Distribution
								</Typography>
								<Box sx={{ mt: 2 }}>
									{[
										{ label: "Positive", count: stats.sentimentBreakdown.positive, sentiment: "POSITIVE" },
										{ label: "Negative", count: stats.sentimentBreakdown.negative, sentiment: "NEGATIVE" },
										{ label: "Neutral", count: stats.sentimentBreakdown.neutral, sentiment: "NEUTRAL" },
										{ label: "Mixed", count: stats.sentimentBreakdown.mixed, sentiment: "MIXED" },
									].map(item => (
										<Box
											key={item.label}
											sx={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												mb: 2,
											}}
										>
											<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
												<SentimentIndicator sentiment={item.sentiment} variant="icon" />
												<Typography variant="body2">{item.label}</Typography>
											</Box>
											<Typography variant="h6" fontWeight={600}>
												{item.count}
											</Typography>
										</Box>
									))}
								</Box>
							</Paper>
						</Grid>

						{/* Importance Breakdown */}
						<Grid item xs={12} md={6}>
							<Paper elevation={2} sx={{ p: 3 }}>
								<Typography variant="h6" gutterBottom fontWeight={600}>
									Priority Distribution
								</Typography>
								<Box sx={{ mt: 2 }}>
									{[
										{ label: "High Priority", count: stats.importanceBreakdown.high, importance: "HIGH" },
										{ label: "Medium Priority", count: stats.importanceBreakdown.medium, importance: "MEDIUM" },
										{ label: "Low Priority", count: stats.importanceBreakdown.low, importance: "LOW" },
									].map(item => (
										<Box
											key={item.label}
											sx={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												mb: 2,
											}}
										>
											<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
												<ImportanceBadge importance={item.importance} />
												<Typography variant="body2">{item.label}</Typography>
											</Box>
											<Typography variant="h6" fontWeight={600}>
												{item.count}
											</Typography>
										</Box>
									))}
								</Box>
							</Paper>
						</Grid>
					</Grid>

					{/* Top Themes */}
					<Paper elevation={2} sx={{ p: 3, mb: 4 }}>
						<Typography variant="h6" gutterBottom fontWeight={600}>
							Top Themes
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
							Most frequently occurring themes in student feedback
						</Typography>
						<Box sx={{ mt: 2 }}>
							{stats.topThemes.map((item, index) => (
								<Box
									key={index}
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										mb: 2,
									}}
								>
									<Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
										<Typography
											variant="h6"
											fontWeight={700}
											color="text.secondary"
											sx={{ minWidth: 30 }}
										>
											#{index + 1}
										</Typography>
										<ThemeChip theme={item.theme} />
									</Box>
									<Typography variant="h6" fontWeight={600}>
										{item.count}
									</Typography>
								</Box>
							))}
						</Box>
					</Paper>

					{/* Department Breakdown */}
					<Paper elevation={2} sx={{ p: 3, mb: 4 }}>
						<Typography variant="h6" gutterBottom fontWeight={600}>
							Inputs by Department
						</Typography>
						<Box sx={{ mt: 2 }}>
							{stats.departmentBreakdown.map((item, index) => (
								<Box
									key={index}
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										mb: 2,
									}}
								>
									<Typography variant="body2">{item.department}</Typography>
									<Typography variant="h6" fontWeight={600}>
										{item.count}
									</Typography>
								</Box>
							))}
						</Box>
					</Paper>

					{/* Recent Inputs */}
					<Box>
						<Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
							Recent Inputs
						</Typography>
						{stats.recentInputs.map(input => (
							<InputCard
								key={input.id}
								input={input}
								showAIAnalysis={true}
								showInquiryLink={true}
								onClick={() => router.push(`/admin/inputs/${input.id}`)}
							/>
						))}
					</Box>
				</Box>
			</MainContainer>
		</RootLayout>
	);
}
