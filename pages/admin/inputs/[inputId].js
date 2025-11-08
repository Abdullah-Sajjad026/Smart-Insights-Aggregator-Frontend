import { useState } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReplyIcon from "@mui/icons-material/Reply";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { DateTime } from "luxon";
import { toast } from "react-toastify";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import {
	MainContainer,
	Loader,
	LoadingButton,
} from "modules/shared/components";
import {
	useGetInputById,
	useGetInputReplies,
	useCreateInputReplyMutation,
	useRequestRevealMutation,
	getInputByIdQueryKey,
	getInputRepliesQueryKey,
} from "modules/input";
import { withAdmin } from "modules/user";
import { getApiErrorMessage } from "modules/shared/shared.utils";
import {
	Sentiment,
	Tone,
	InputStatus,
	RevealStatus,
} from "types/api";
import {
	SENTIMENT_COLORS,
	TONE_LABELS,
	INPUT_STATUS_COLORS,
	REVEAL_STATUS_LABELS,
} from "constants/enums";

function InputDetailPage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { inputId } = router.query;
	const [replyText, setReplyText] = useState("");

	// Fetch input details
	const { data: input, isLoading: inputLoading, isError: inputError } = useGetInputById(inputId, {
		enabled: !!inputId,
	});

	// Fetch input replies (conversation)
	const { data: repliesData, isLoading: repliesLoading } = useGetInputReplies(inputId, {
		enabled: !!inputId,
	});

	const replies = repliesData || [];

	// Create reply mutation
	const createReplyMutation = useCreateInputReplyMutation({
		onSuccess: (response) => {
			toast.success(response.message || "Reply sent successfully!");
			setReplyText("");
			queryClient.invalidateQueries(getInputRepliesQueryKey(inputId));
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to send reply"));
		},
	});

	// Request reveal mutation
	const requestRevealMutation = useRequestRevealMutation({
		onSuccess: (response) => {
			toast.success(response.message || "Identity reveal request sent!");
			queryClient.invalidateQueries(getInputByIdQueryKey(inputId));
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to request identity reveal"));
		},
	});

	// Loading state
	if (inputLoading || !inputId) {
		return (
			<RootLayout>
				<MainContainer>
					<Loader />
				</MainContainer>
			</RootLayout>
		);
	}

	// Error state
	if (inputError || !input) {
		return (
			<RootLayout>
				<MainContainer>
					<Alert severity="error">Input not found</Alert>
				</MainContainer>
			</RootLayout>
		);
	}

	const handleSendReply = () => {
		if (!replyText.trim()) {
			toast.error("Please enter a reply message");
			return;
		}

		createReplyMutation.mutate({
			inputId,
			data: { message: replyText },
		});
	};

	const handleRequestReveal = () => {
		if (input.revealStatus && input.revealStatus !== RevealStatus.NotRequested) {
			toast.info("Identity reveal already requested");
			return;
		}

		if (
			!confirm(
				"Are you sure you want to request identity reveal for this input?"
			)
		) {
			return;
		}

		requestRevealMutation.mutate({ inputId });
	};

	return (
		<RootLayout>
			<MainContainer>
				<Box sx={{ py: 4, maxWidth: 1000, mx: "auto" }}>
					{/* Back Button */}
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={() => router.back()}
						sx={{ mb: 3 }}
					>
						Back
					</Button>

					{/* Input Card */}
					<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
						<Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, flexWrap: "wrap", gap: 1 }}>
							<Typography variant="caption" color="text.secondary">
								{DateTime.fromISO(input.createdAt).toFormat(
									"MMMM dd, yyyy 'at' hh:mm a",
								)}
							</Typography>
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
								{input.tone && (
									<Chip
										label={TONE_LABELS[input.tone] || input.tone}
										size="small"
										variant="outlined"
									/>
								)}
								{input.isAnonymous && !input.revealedAt && (
									<Chip label="Anonymous" size="small" variant="outlined" />
								)}
							</Box>
						</Box>

						<Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
							{input.body}
						</Typography>

						{/* AI Analysis Scores */}
						{(input.qualityScore !== undefined || input.importanceScore !== undefined || input.urgencyScore !== undefined) && (
							<Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
								<Typography variant="subtitle2" gutterBottom fontWeight={600}>
									AI Analysis Scores
								</Typography>
								<Grid container spacing={2} sx={{ mt: 1 }}>
									{input.qualityScore !== undefined && (
										<Grid item xs={6} sm={4}>
											<Box sx={{ textAlign: "center" }}>
												<Typography variant="h5" fontWeight={600} color="primary.main">
													{input.qualityScore}/10
												</Typography>
												<Typography variant="caption" color="text.secondary">
													Quality
												</Typography>
											</Box>
										</Grid>
									)}
									{input.importanceScore !== undefined && (
										<Grid item xs={6} sm={4}>
											<Box sx={{ textAlign: "center" }}>
												<Typography variant="h5" fontWeight={600} color="warning.main">
													{input.importanceScore}/10
												</Typography>
												<Typography variant="caption" color="text.secondary">
													Importance
												</Typography>
											</Box>
										</Grid>
									)}
									{input.urgencyScore !== undefined && (
										<Grid item xs={6} sm={4}>
											<Box sx={{ textAlign: "center" }}>
												<Typography variant="h5" fontWeight={600} color="error.main">
													{input.urgencyScore}/10
												</Typography>
												<Typography variant="caption" color="text.secondary">
													Urgency
												</Typography>
											</Box>
										</Grid>
									)}
								</Grid>
							</Paper>
						)}

						{/* Input Type and Inquiry Link */}
						<Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
							{input.inquiryId && input.inquiryTitle && (
								<Chip
									label={`Response to: ${input.inquiryTitle}`}
									size="small"
									color="primary"
									variant="outlined"
								/>
							)}
							{!input.inquiryId && (
								<Chip label="General Feedback" size="small" variant="outlined" />
							)}
						</Box>

						{/* Student Metadata */}
						<Divider sx={{ my: 2 }} />
						<Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
							{input.department && (
								<Box>
									<Typography variant="caption" color="text.secondary">
										Department
									</Typography>
									<Typography variant="body2">{input.department}</Typography>
								</Box>
							)}
							{input.program && (
								<Box>
									<Typography variant="caption" color="text.secondary">
										Program
									</Typography>
									<Typography variant="body2">{input.program}</Typography>
								</Box>
							)}
							{input.semester && (
								<Box>
									<Typography variant="caption" color="text.secondary">
										Semester
									</Typography>
									<Typography variant="body2">{input.semester}</Typography>
								</Box>
							)}
							<Box>
								<Typography variant="caption" color="text.secondary">
									Identity Status
								</Typography>
								<Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0.5 }}>
									<Typography variant="body2" fontWeight={600}>
										{input.revealedAt ? "Revealed" : "Anonymous"}
									</Typography>
									{input.revealStatus && input.revealStatus !== RevealStatus.NotRequested && (
										<Chip
											label={REVEAL_STATUS_LABELS[input.revealStatus] || input.revealStatus}
											size="small"
											color={input.revealStatus === RevealStatus.Approved ? "success" : "warning"}
										/>
									)}
								</Box>
								{input.revealedAt && input.studentName && (
									<Typography variant="caption" color="primary.main">
										Student: {input.studentName}
									</Typography>
								)}
							</Box>
						</Box>
					</Paper>

					{/* Conversation Section */}
					<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
						<Typography variant="h6" gutterBottom fontWeight={600}>
							Conversation
						</Typography>

						{/* Display replies */}
						{repliesLoading ? (
							<Box sx={{ py: 2 }}>
								<Loader height="auto" />
							</Box>
						) : replies.length > 0 ? (
							<Box sx={{ mb: 3 }}>
								{replies.map((reply, index) => (
									<Paper
										key={reply.id || index}
										variant="outlined"
										sx={{
											p: 2,
											mb: 2,
											bgcolor: reply.isAdmin ? "primary.50" : "grey.50",
											borderLeft: 4,
											borderLeftColor: reply.isAdmin ? "primary.main" : "grey.400",
										}}
									>
										<Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
											<Typography variant="caption" fontWeight={600} color={reply.isAdmin ? "primary.main" : "text.secondary"}>
												{reply.isAdmin ? "Admin" : (input.studentName || "Student")}
											</Typography>
											<Typography variant="caption" color="text.secondary">
												{DateTime.fromISO(reply.createdAt).toFormat("MMM dd, yyyy 'at' hh:mm a")}
											</Typography>
										</Box>
										<Typography variant="body2">{reply.body}</Typography>
									</Paper>
								))}
							</Box>
						) : (
							<Alert severity="info" sx={{ mb: 3 }}>
								No conversation yet. Start by sending a reply below.
							</Alert>
						)}

						{/* Reply Form */}
						<Divider sx={{ my: 2 }} />
						<Box>
							<Typography variant="subtitle2" gutterBottom>
								Send Reply to Student
							</Typography>
							<TextField
								value={replyText}
								onChange={e => setReplyText(e.target.value)}
								placeholder="Type your reply message..."
								multiline
								rows={3}
								fullWidth
								sx={{ mb: 1 }}
							/>
							<LoadingButton
								variant="contained"
								startIcon={<ReplyIcon />}
								onClick={handleSendReply}
								loading={createReplyMutation.isLoading}
								disabled={!replyText.trim()}
							>
								Send Reply
							</LoadingButton>
						</Box>
					</Paper>

					{/* Admin Actions */}
					{input.isAnonymous && !input.revealedAt && (
						<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
							<Typography variant="h6" gutterBottom fontWeight={600}>
								Identity Management
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
								Request the student to reveal their identity for this feedback.
								The student can approve or deny this request.
							</Typography>
							<LoadingButton
								variant="outlined"
								color="warning"
								startIcon={<LockOpenIcon />}
								onClick={handleRequestReveal}
								loading={requestRevealMutation.isLoading}
								disabled={input.revealStatus && input.revealStatus !== RevealStatus.NotRequested}
							>
								{input.revealStatus === RevealStatus.Pending
									? "Request Pending - Awaiting Student Response"
									: input.revealStatus === RevealStatus.Denied
									? "Request Denied by Student"
									: "Request Identity Reveal"}
							</LoadingButton>
						</Paper>
					)}

				</Box>
			</MainContainer>
		</RootLayout>
	);
}

export default withAdmin(InputDetailPage);
