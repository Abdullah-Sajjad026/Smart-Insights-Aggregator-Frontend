import { useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Pagination from "@mui/material/Pagination";
import Chip from "@mui/material/Chip";
import { DateTime } from "luxon";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader } from "modules/shared/components";
import { useGetAllInputs, InputCard } from "modules/input";
import { withAdmin } from "modules/user";
import { InputStatus, Sentiment } from "types/api";
import { INPUT_STATUS_COLORS, SENTIMENT_COLORS } from "constants/enums";

function AdminInputsPage() {
	const router = useRouter();
	const [statusFilter, setStatusFilter] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);

	// Fetch inputs
	const { data, isLoading, isError } = useGetAllInputs({
		status: statusFilter,
		page,
		pageSize,
	});

	const handleTabChange = (event, newValue) => {
		setStatusFilter(newValue);
		setPage(1);
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleInputClick = (input) => {
		router.push(`/admin/inputs/${input.id}`);
	};

	return (
		<RootLayout>
			<MainContainer>
				<Box sx={{ py: 4 }}>
					{/* Page Header */}
					<Box sx={{ mb: 4 }}>
						<Typography variant="h4" gutterBottom fontWeight={600}>
							All Inputs
						</Typography>
						<Typography variant="body1" color="text.secondary">
							View and manage all student feedback submissions
						</Typography>
					</Box>

					{/* Status Tabs */}
					<Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
						<Tabs value={statusFilter} onChange={handleTabChange}>
							<Tab label="All" value="" />
							<Tab label="Pending" value={InputStatus.Pending} />
							<Tab label="Reviewed" value={InputStatus.Reviewed} />
							<Tab label="Resolved" value={InputStatus.Resolved} />
							<Tab label="Archived" value={InputStatus.Archived} />
						</Tabs>
					</Box>

					{/* Loading State */}
					{isLoading && <Loader height="auto" />}

					{/* Error State */}
					{isError && (
						<Alert severity="error">
							Failed to load inputs. Please try again later.
						</Alert>
					)}

					{/* Inputs List */}
					{data && (
						<>
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
										Total Inputs
									</Typography>
									<Typography variant="h6" fontWeight={600}>
										{data.pagination?.totalItems || 0}
									</Typography>
								</Box>
								{statusFilter && (
									<Box>
										<Typography variant="caption" color="text.secondary">
											Showing {statusFilter}
										</Typography>
										<Typography variant="h6" fontWeight={600}>
											{data.data?.length || 0}
										</Typography>
									</Box>
								)}
							</Box>

							{data.data && data.data.length > 0 ? (
								<>
									<Box>
									<Box>
										{data.data.map((input) => (
											<InputCard
												key={input.id}
												input={input}
												onClick={() => handleInputClick(input)}
												showAIAnalysis={false}
											/>
										))}
									</Box>
									</Box>

									{/* Pagination */}
									{data.pagination && data.pagination.totalPages > 1 && (
										<Box
											sx={{
												mt: 4,
												display: "flex",
												justifyContent: "center",
											}}
										>
											<Pagination
												count={data.pagination.totalPages}
												page={page}
												onChange={handlePageChange}
												color="primary"
												size="large"
												showFirstButton
												showLastButton
											/>
										</Box>
									)}
								</>
							) : (
								<Box
									sx={{
										textAlign: "center",
										py: 8,
										px: 2,
									}}
								>
									<Typography variant="h6" color="text.secondary" gutterBottom>
										No inputs found
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{statusFilter
											? `No ${statusFilter.toLowerCase()} inputs at the moment`
											: "No feedback submissions yet"}
									</Typography>
								</Box>
							)}
						</>
					)}
				</Box>
			</MainContainer>
		</RootLayout>
	);
}

export default withAdmin(AdminInputsPage);
