import { useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader } from "modules/shared/components";
import { useGetAllInputs, InputCard } from "modules/input";
import { withAdmin } from "modules/user";

function AdminInputsPage() {
	const router = useRouter();
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);

	// Filter states
	const [filters, setFilters] = useState({
		status: "",
		type: "",
		sentiment: "",
		severity: "",
		tone: "",
		search: "",
		sortBy: "createdAt",
		sortOrder: "desc",
	});

	// Fetch inputs with filters
	const { data, isLoading, isError } = useGetAllInputs({
		...filters,
		page,
		pageSize,
	});

	const handleFilterChange = (field, value) => {
		setFilters(prev => ({ ...prev, [field]: value }));
		setPage(1); // Reset to first page when filter changes
	};

	const handleClearFilters = () => {
		setFilters({
			status: "",
			type: "",
			sentiment: "",
			severity: "",
			tone: "",
			search: "",
			sortBy: "createdAt",
			sortOrder: "desc",
		});
		setPage(1);
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleInputClick = input => {
		router.push(`/admin/inputs/${input.id}`);
	};

	// Count active filters
	const activeFiltersCount = Object.entries(filters).filter(
		([key, value]) => value && key !== "sortBy" && key !== "sortOrder",
	).length;

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
							View and manage all student feedback with AI-powered filtering by
							severity, sentiment, and tone
						</Typography>
					</Box>

					{/* Filters Section */}
					<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<FilterListIcon sx={{ mr: 1, color: "primary.main" }} />
							<Typography variant="h6" fontWeight={600}>
								Filters
							</Typography>
							{activeFiltersCount > 0 && (
								<Chip
									label={`${activeFiltersCount} active`}
									size="small"
									color="primary"
									sx={{ ml: 2 }}
								/>
							)}
							<Box sx={{ flexGrow: 1 }} />
							{activeFiltersCount > 0 && (
								<Button
									startIcon={<ClearIcon />}
									onClick={handleClearFilters}
									size="small"
									color="error"
								>
									Clear All
								</Button>
							)}
						</Box>

						<Grid container spacing={2}>
							{/* Search - Full width on mobile, half on larger screens */}
							<Grid item xs={12} md={6}>
								<TextField
									fullWidth
									size="small"
									label="Search feedback"
									placeholder="Search by content..."
									value={filters.search}
									onChange={e => handleFilterChange("search", e.target.value)}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<SearchIcon />
											</InputAdornment>
										),
									}}
								/>
							</Grid>

							{/* Status */}
							<Grid item xs={12} sm={6} md={3}>
								<Tooltip
									placement="top"
									title="Filter by processing status of the feedback"
									arrow
								>
									<TextField
										fullWidth
										size="small"
										select
										label="Status"
										value={filters.status}
										onChange={e => handleFilterChange("status", e.target.value)}
									>
										<MenuItem value="">All Statuses</MenuItem>
										<MenuItem value="Pending">Pending</MenuItem>
										<MenuItem value="Processing">Processing</MenuItem>
										<MenuItem value="Processed">Processed</MenuItem>
										<MenuItem value="Reviewed">Reviewed</MenuItem>
										<MenuItem value="Resolved">Resolved</MenuItem>
										<MenuItem value="Archived">Archived</MenuItem>
									</TextField>
								</Tooltip>
							</Grid>

							{/* Type */}
							<Grid item xs={12} sm={6} md={3}>
								<Tooltip
									placement="top"
									title="Filter by whether it's general feedback or a response to a specific inquiry"
									arrow
								>
									<TextField
										fullWidth
										size="small"
										select
										label="Type"
										value={filters.type}
										onChange={e => handleFilterChange("type", e.target.value)}
									>
										<MenuItem value="">All Types</MenuItem>
										<MenuItem value="General">General Feedback</MenuItem>
										<MenuItem value="InquiryLinked">Inquiry Response</MenuItem>
									</TextField>
								</Tooltip>
							</Grid>

							{/* Importance - Most important AI filter */}
							<Grid item xs={12} sm={6} md={3}>
								<Tooltip
									title="Filter by AI-detected importance: High (critical matters requiring attention), Medium (significant topics), Low (routine suggestions)"
									arrow
									placement="top"
								>
									<TextField
										fullWidth
										size="small"
										select
										label="Importance"
										value={filters.severity}
										onChange={e =>
											handleFilterChange("severity", e.target.value)
										}
									>
										<MenuItem value="">All Levels</MenuItem>
										<MenuItem value="3">🟣 High Importance</MenuItem>
										<MenuItem value="2">🔵 Medium Importance</MenuItem>
										<MenuItem value="1">⚪ Low Importance</MenuItem>
									</TextField>
								</Tooltip>
							</Grid>

							{/* Sentiment */}
							<Grid item xs={12} sm={6} md={3}>
								<Tooltip
									placement="top"
									title="Filter by AI-detected emotional tone: Positive (satisfied), Negative (dissatisfied), Neutral (objective), Mixed (both)"
									arrow
								>
									<TextField
										fullWidth
										size="small"
										select
										label="Sentiment"
										value={filters.sentiment}
										onChange={e =>
											handleFilterChange("sentiment", e.target.value)
										}
									>
										<MenuItem value="">All Sentiments</MenuItem>
										<MenuItem value="Positive">😊 Positive</MenuItem>
										<MenuItem value="Neutral">😐 Neutral</MenuItem>
										<MenuItem value="Negative">😞 Negative</MenuItem>
										<MenuItem value="Mixed">😕 Mixed</MenuItem>
									</TextField>
								</Tooltip>
							</Grid>

							{/* Tone */}
							{/* <Grid item xs={12} sm={6} md={3}>
								<Tooltip
									placement="top"
									title="Filter by AI-detected communication style: Formal (structured, professional), Informal (casual, conversational)"
									arrow
								>
									<TextField
										fullWidth
										size="small"
										select
										label="Tone"
										value={filters.tone}
										onChange={e => handleFilterChange("tone", e.target.value)}
									>
										<MenuItem value="">All Tones</MenuItem>
										<MenuItem value="Formal">Formal</MenuItem>
										<MenuItem value="Informal">Informal</MenuItem>
										<MenuItem value="Neutral">Neutral</MenuItem>
										<MenuItem value="Professional">Professional</MenuItem>
										<MenuItem value="Casual">Casual</MenuItem>
									</TextField>
								</Tooltip>
							</Grid> */}

							{/* Sort By */}
							<Grid item xs={12} sm={6} md={3}>
								<Tooltip
									placement="top"
									title="Choose what to sort the results by"
									arrow
								>
									<TextField
										fullWidth
										size="small"
										select
										label="Sort By"
										value={filters.sortBy}
										onChange={e => handleFilterChange("sortBy", e.target.value)}
									>
										<MenuItem value="createdAt">📅 Date Created</MenuItem>
										<MenuItem value="severity">⭐ Importance Level</MenuItem>
										<MenuItem value="score">💯 Quality Score</MenuItem>
									</TextField>
								</Tooltip>
							</Grid>

							{/* Sort Order */}
							<Grid item xs={12} sm={6} md={3}>
								<Tooltip placement="top" title="Sort order direction" arrow>
									<TextField
										fullWidth
										size="small"
										select
										label="Order"
										value={filters.sortOrder}
										onChange={e =>
											handleFilterChange("sortOrder", e.target.value)
										}
									>
										<MenuItem value="desc">⬇️ Highest/Newest First</MenuItem>
										<MenuItem value="asc">⬆️ Lowest/Oldest First</MenuItem>
									</TextField>
								</Tooltip>
							</Grid>
						</Grid>
					</Paper>

					{/* Loading State */}
					{isLoading && <Loader height="auto" />}

					{/* Error State */}
					{isError && (
						<Alert severity="error">
							Failed to load inputs. Please try again later.
						</Alert>
					)}

					{/* Results */}
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
									alignItems: "center",
								}}
							>
								<Box>
									<Typography variant="caption" color="text.secondary">
										Total Inputs
									</Typography>
									<Typography variant="subtitle1">
										{data.pagination?.totalItems || 0}
									</Typography>
								</Box>
								<Box>
									<Typography variant="caption" color="text.secondary">
										Current Page
									</Typography>
									<Typography variant="subtitle1">
										{data.data?.length || 0} items
									</Typography>
								</Box>
								{activeFiltersCount > 0 && (
									<Box>
										<Typography variant="caption" color="text.secondary">
											Filters Applied
										</Typography>
										<Typography variant="subtitle1" color="primary.main">
											{activeFiltersCount}
										</Typography>
									</Box>
								)}
							</Box>

							{/* Inputs List */}
							{data.data && data.data.length > 0 ? (
								<>
									<Box>
										{data.data.map(input => (
											<InputCard
												key={input.id}
												input={input}
												onClick={() => handleInputClick(input)}
												showAIAnalysis={true}
											/>
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
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mb: 2 }}
									>
										{activeFiltersCount > 0
											? "Try adjusting your filters to see more results"
											: "No feedback submissions yet"}
									</Typography>
									{activeFiltersCount > 0 && (
										<Button
											variant="outlined"
											startIcon={<ClearIcon />}
											onClick={handleClearFilters}
										>
											Clear Filters
										</Button>
									)}
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
