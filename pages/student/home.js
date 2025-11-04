import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import { DateTime } from "luxon";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer } from "modules/shared/components";
import { mockInputsSimplified } from "modules/shared/shared.mock-data-v2";

export default function StudentHomePage() {
	const router = useRouter();

	// Mock: Get current user's inputs (first 3)
	const myInputs = mockInputsSimplified.slice(0, 3);

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
								My Feedback History
							</Typography>
							<Typography variant="body1" color="text.secondary">
								View all your submitted feedback
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
								Total Submissions
							</Typography>
							<Typography variant="h6" fontWeight={600}>
								{myInputs.length}
							</Typography>
						</Box>
					</Box>

					{/* Inputs List */}
					{myInputs.length > 0 ? (
						<Box>
							{myInputs.map(input => (
								<Paper
									key={input.id}
									variant="outlined"
									sx={{
										p: 3,
										mb: 2,
									}}
								>
									{/* Date */}
									<Typography variant="caption" color="text.secondary" gutterBottom>
										{DateTime.fromISO(input.createdAt).toFormat(
											"MMMM dd, yyyy 'at' hh:mm a",
										)}
									</Typography>

									{/* Input Text */}
									<Typography variant="body1" sx={{ my: 2, lineHeight: 1.7 }}>
										{input.body}
									</Typography>

									{/* Type Badge */}
									<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
										{input.type === "INQUIRY_LINKED" && input.inquiryTitle ? (
											<Chip
												label={`Response to: ${input.inquiryTitle}`}
												size="small"
												color="primary"
											/>
										) : (
											<Chip
												label="General Feedback"
												size="small"
												variant="outlined"
											/>
										)}

										{/* Admin Reply Indicator */}
										{input.adminReply && (
											<Chip
												label="Admin Replied"
												size="small"
												color="success"
											/>
										)}
									</Box>

									{/* Admin Reply Display */}
									{input.adminReply && (
										<Paper
											variant="outlined"
											sx={{
												mt: 2,
												p: 2,
												bgcolor: "success.50",
												borderColor: "success.main",
											}}
										>
											<Typography variant="caption" color="success.dark" fontWeight={600}>
												Admin Response
											</Typography>
											<Typography variant="body2" sx={{ mt: 0.5 }}>
												{input.adminReply.message}
											</Typography>
											<Typography variant="caption" color="text.secondary">
												{DateTime.fromISO(input.adminReply.repliedAt).toFormat(
													"MMM dd, yyyy",
												)}
											</Typography>
										</Paper>
									)}
								</Paper>
							))}
						</Box>
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
