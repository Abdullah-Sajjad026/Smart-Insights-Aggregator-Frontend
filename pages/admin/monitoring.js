import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { DateTime } from "luxon";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader } from "modules/shared/components";
import { withAdmin } from "modules/user";
import {
	useGetAiCostToday,
	useGetAiCostProjection,
	useGetAiUsageMonth,
	useGetProcessingStats,
	CostCard,
	UsageChart,
	ProcessingStats,
} from "modules/monitoring";

function MonitoringPage() {
	// Fetch data
	const {
		data: costToday,
		isLoading: isLoadingCostToday,
		isError: isErrorCostToday,
	} = useGetAiCostToday();

	const {
		data: costProjection,
		isLoading: isLoadingProjection,
		isError: isErrorProjection,
	} = useGetAiCostProjection();

	const {
		data: usageMonth,
		isLoading: isLoadingUsage,
		isError: isErrorUsage,
	} = useGetAiUsageMonth();

	const {
		data: processingStats,
		isLoading: isLoadingStats,
		isError: isErrorStats,
	} = useGetProcessingStats();

	const isLoading =
		isLoadingCostToday ||
		isLoadingProjection ||
		isLoadingUsage ||
		isLoadingStats;

	const isError =
		isErrorCostToday || isErrorProjection || isErrorUsage || isErrorStats;

	// Prepare chart data
	const chartData = usageMonth?.breakdown?.map(item => ({
		operation: item.operation,
		requestCount: item.requestCount,
	})) || [];

	return (
		<RootLayout>
			<MainContainer>
				<Box sx={{ py: 4 }}>
					{/* Header */}
					<Box sx={{ mb: 4 }}>
						<Typography variant="h4" gutterBottom fontWeight={600}>
							System Monitoring
						</Typography>
						<Typography variant="body1" color="text.secondary">
							Overview of AI usage, costs, and system processing statistics
						</Typography>
					</Box>

					{/* Loading State */}
					{isLoading && <Loader height="auto" />}

					{/* Error State */}
					{isError && (
						<Alert severity="error" sx={{ mb: 3 }}>
							Failed to load monitoring data. Please try again later.
						</Alert>
					)}

					{!isLoading && !isError && (
						<Grid container spacing={3}>
							{/* Cost Overview Cards */}
							<Grid item xs={12} md={4}>
								<CostCard
									title="Today's AI Cost"
									amount={costToday?.totalCost}
									subtitle={DateTime.now().toFormat("MMMM dd, yyyy")}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<CostCard
									title="Month to Date"
									amount={costProjection?.costToDate}
									subtitle={`${costProjection?.daysElapsed} days elapsed`}
								/>
							</Grid>
							<Grid item xs={12} md={4}>
								<CostCard
									title="Projected Monthly Cost"
									amount={costProjection?.projectedMonthCost}
									subtitle="Based on current usage"
									trend="Estimated"
								/>
							</Grid>

							{/* System Health */}
							<Grid item xs={12} md={6}>
								<ProcessingStats stats={processingStats} />
							</Grid>

							{/* Usage Chart */}
							<Grid item xs={12} md={6}>
								<UsageChart
									title="AI Usage by Operation (This Month)"
									data={chartData}
								/>
							</Grid>

							{/* Additional Stats */}
							<Grid item xs={12}>
								<Box
									sx={{
										p: 3,
										bgcolor: "grey.50",
										borderRadius: 2,
										display: "flex",
										gap: 4,
										flexWrap: "wrap",
									}}
								>
									<Box>
										<Typography variant="caption" color="text.secondary">
											Total Requests (Month)
										</Typography>
										<Typography variant="h6" fontWeight={600}>
											{usageMonth?.summary?.totalRequests || 0}
										</Typography>
									</Box>
									<Box>
										<Typography variant="caption" color="text.secondary">
											Average Daily Cost
										</Typography>
										<Typography variant="h6" fontWeight={600}>
											${Number(usageMonth?.summary?.averageDailyCost || 0).toFixed(4)}
										</Typography>
									</Box>
									<Box>
										<Typography variant="caption" color="text.secondary">
											Days Remaining in Month
										</Typography>
										<Typography variant="h6" fontWeight={600}>
											{costProjection?.daysRemaining || 0}
										</Typography>
									</Box>
								</Box>
							</Grid>
						</Grid>
					)}
				</Box>
			</MainContainer>
		</RootLayout>
	);
}

export default withAdmin(MonitoringPage);
