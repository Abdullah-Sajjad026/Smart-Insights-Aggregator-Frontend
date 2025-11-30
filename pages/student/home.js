import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import { DateTime } from "luxon";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader } from "modules/shared/components";
import { useGetMyInputs, InputCard } from "modules/input";
import { withStudent } from "modules/user";
import { SENTIMENT_COLORS, INPUT_STATUS_COLORS } from "constants/enums";

function StudentHomePage() {
	const router = useRouter();

	// Fetch user's recent inputs
	const { data, isLoading, isError } = useGetMyInputs({
		page: 1,
		pageSize: 5,
	});

	const myInputs = data?.data || [];

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
								My Feedback
							</Typography>
							<Typography variant="body1" color="text.secondary">
								View your recent feedback submissions
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
					{isLoading && <Loader height="auto" />}

					{/* Error State */}
					{isError && (
						<Alert severity="error" sx={{ mb: 3 }}>
							Failed to load your feedback. Please try again later.
						</Alert>
					)}

					{/* Stats */}
					{data && (
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
									Showing Recent
								</Typography>
								<Typography variant="h6" fontWeight={600}>
									{myInputs.length}
								</Typography>
							</Box>
						</Box>
					)}

					{/* Inputs List */}
					{data && myInputs.length > 0 ? (
						<Box>
							{myInputs.map((input) => (
								<InputCard
									key={input.id}
									input={input}
									onClick={() => router.push(`/input/my-inputs`)}
									showAIAnalysis={false}
									showInquiryLink={true}
								/>
							))}

							{/* View All Button */}
							{data.pagination?.totalItems > myInputs.length && (
								<Box sx={{ textAlign: "center", mt: 2 }}>
									<Button
										variant="outlined"
										onClick={() => router.push("/input/my-inputs")}
									>
										View All ({data.pagination.totalItems} total)
									</Button>
								</Box>
							)}
						</Box>
					) : data && (
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
								Start sharing your feedback to help improve the university
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
				</Box>
			</MainContainer>
		</RootLayout>
	);
}

export default withStudent(StudentHomePage);
