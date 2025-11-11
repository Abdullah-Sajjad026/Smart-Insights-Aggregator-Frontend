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
import { useGetAllInputs } from "modules/input";
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
										{data.data.map((input) => (
											<Paper
												key={input.id}
												variant="outlined"
												sx={{
													p: 3,
													mb: 2,
													cursor: "pointer",
													"&:hover": { bgcolor: "grey.50" },
												}}
												onClick={() => handleInputClick(input)}
											>
												{/* Header */}
												<Box
													sx={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "flex-start",
														mb: 2,
														flexWrap: "wrap",
														gap: 1,
													}}
												>
													<Box>
														<Typography variant="caption" color="text.secondary">
															{DateTime.fromISO(input.createdAt).toFormat(
																"MMM dd, yyyy 'at' hh:mm a"
															)}
														</Typography>
														{input.userName && (
															<Typography variant="body2" fontWeight={600} sx={{ mt: 0.5 }}>
																By: {input.userName}
															</Typography>
														)}
													</Box>
													<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
														{input.status && (
															<Chip
																label={input.status}
																size="small"
																color={INPUT_STATUS_COLORS[input.status]}
															/>
														)}
														{input.sentiment && (
															<Chip
																label={input.sentiment}
																size="small"
																color={SENTIMENT_COLORS[input.sentiment]}
															/>
														)}
														{input.isAnonymous && !input.identityRevealedAt && (
															<Chip label="Anonymous" size="small" variant="outlined" />
														)}
													</Box>
												</Box>

												{/* Body */}
												<Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
													{input.body}
												</Typography>

												{/* Meta */}
												<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
													{input.inquiryId && input.inquiryBody && (
														<Chip
															label={`Response to: ${input.inquiryBody.substring(0, 50)}...`}
															size="small"
															color="primary"
															variant="outlined"
														/>
													)}
													{!input.inquiryId && (
														<Chip label="General Feedback" size="small" variant="outlined" />
													)}
													{input.topicName && (
														<Chip
															label={`Topic: ${input.topicName}`}
															size="small"
															variant="outlined"
														/>
													)}
													{input.qualityScore !== undefined && (
														<Chip
															label={`Quality: ${input.qualityScore}/10`}
															size="small"
															color="primary"
															variant="outlined"
														/>
													)}
												</Box>
											</Paper>
										))}
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
