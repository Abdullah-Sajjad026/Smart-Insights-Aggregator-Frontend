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
	InputCard,
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
					<InputCard
						input={input}
						showAIAnalysis={true}
						showInquiryLink={true}
					/>

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
