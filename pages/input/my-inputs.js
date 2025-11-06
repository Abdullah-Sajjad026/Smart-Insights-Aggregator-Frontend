import { useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import AddIcon from "@mui/icons-material/Add";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader } from "modules/shared/components";
import { InputCard } from "modules/input/components";
import { useGetMyInputs } from "modules/input/apis";
import { withStudent } from "modules/user";
import { InputStatus } from "types/api";

function MyInputsPage() {
	const router = useRouter();
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);

	const { data, isLoading, isError } = useGetMyInputs({
		page,
		pageSize,
	});

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	return (
		<RootLayout>
			<MainContainer>
				<Box sx={{ py: 4 }}>
					{/* Page Header */}
					<Box
						sx={{
							mb: 4,
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							flexWrap: "wrap",
							gap: 2,
						}}
					>
						<Box>
							<Typography variant="h4" gutterBottom fontWeight={600}>
								My Submissions
							</Typography>
							<Typography variant="body1" color="text.secondary">
								View all your feedback submissions and AI analysis results
							</Typography>
						</Box>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={() => router.push("/input/submit")}
						>
							Submit New Feedback
						</Button>
					</Box>

					{/* Loading State */}
					{isLoading && <Loader />}

					{/* Error State */}
					{isError && (
						<Alert severity="error">
							Failed to load your submissions. Please try again later.
						</Alert>
					)}

					{/* Success State */}
					{data && (
						<>
							{/* Stats Summary */}
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
										Total Submissions
									</Typography>
									<Typography variant="h6" fontWeight={600}>
										{data.pagination?.totalItems || 0}
									</Typography>
								</Box>
								<Box>
									<Typography variant="caption" color="text.secondary">
										Resolved
									</Typography>
									<Typography variant="h6" fontWeight={600} color="success.main">
										{data.data?.filter(i => i.status === InputStatus.Resolved).length || 0}
									</Typography>
								</Box>
								<Box>
									<Typography variant="caption" color="text.secondary">
										Pending
									</Typography>
									<Typography variant="h6" fontWeight={600} color="warning.main">
										{data.data?.filter(i => i.status === InputStatus.Pending).length || 0}
									</Typography>
								</Box>
							</Box>

							{/* Inputs List */}
							{data.data && data.data.length > 0 ? (
								<>
									<Box>
										{data.data.map(input => (
											<InputCard
												key={input.id}
												input={input}
												showAIAnalysis={true}
												showInquiryLink={true}
											/>
										))}
									</Box>

									{/* Pagination */}
									{data.pagination && data.pagination.totalPages > 1 && (
										<Box
											sx={{
												mt: 3,
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
										No submissions yet
									</Typography>
									<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
										Start sharing your feedback to help improve the university experience
									</Typography>
									<Button
										variant="contained"
										startIcon={<AddIcon />}
										onClick={() => router.push("/input/submit")}
									>
										Submit Your First Feedback
									</Button>
								</Box>
							)}
						</>
					)}
				</Box>
			</MainContainer>
		</RootLayout>
	);
}

export default withStudent(MyInputsPage);
