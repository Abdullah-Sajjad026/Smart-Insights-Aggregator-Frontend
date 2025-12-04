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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReplyIcon from "@mui/icons-material/Reply";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
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
	useRespondToRevealMutation,
	getInputByIdQueryKey,
	getInputRepliesQueryKey,
	InputCard,
} from "modules/input";
import { withStudent } from "modules/user";
import { getApiErrorMessage } from "modules/shared/shared.utils";
import {
	InputStatus,
	RevealStatus,
} from "types/api";
import {
	INPUT_STATUS_COLORS,
	REVEAL_STATUS_LABELS,
} from "constants/enums";

function StudentInputDetailPage() {
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

	// Respond to reveal request mutation
	const respondToRevealMutation = useRespondToRevealMutation({
		onSuccess: (response) => {
			queryClient.invalidateQueries(getInputByIdQueryKey(inputId));
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to respond to reveal request"));
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

	const handleRespondToReveal = (approved) => {
		const message = approved
			? "Are you sure you want to reveal your identity to the admin?"
			: "Are you sure you want to deny the identity reveal request?";

		if (!confirm(message)) {
			return;
		}

		respondToRevealMutation.mutate({ inputId, approved });
	};

	// Check if there's a pending reveal request
	const hasPendingRevealRequest = input.isAnonymous &&
		input.revealRequested &&
		!input.revealApproved &&
		input.revealApproved !== false;

	return (
		<RootLayout>
			<MainContainer>
				<Box sx={{ py: 4, maxWidth: 1000, mx: "auto" }}>
					{/* Back Button */}
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={() => router.push("/input/my-inputs")}
						sx={{ mb: 3 }}
					>
						Back to My Submissions
					</Button>

					{/* Input Card */}
					<InputCard
						input={input}
						showAIAnalysis={true}
						showInquiryLink={true}
					/>

					{/* Identity Reveal Request Section */}
					{hasPendingRevealRequest && (
						<Paper elevation={2} sx={{ p: 3, mb: 3, borderLeft: 4, borderLeftColor: "warning.main" }}>
							<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
								<Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
									Identity Reveal Request
								</Typography>
								<Chip label="Action Required" color="warning" size="small" />
							</Box>
							<Alert severity="warning" sx={{ mb: 2 }}>
								An admin has requested to know your identity for this feedback submission.
								You can choose to approve or deny this request.
							</Alert>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
								<strong>Note:</strong> If you approve, the admin will be able to see your name and contact you directly.
								This action cannot be undone.
							</Typography>
							<Box sx={{ display: "flex", gap: 2 }}>
								<LoadingButton
									variant="contained"
									color="success"
									startIcon={<CheckCircleIcon />}
									onClick={() => handleRespondToReveal(true)}
									loading={respondToRevealMutation.isLoading}
								>
									Approve - Reveal Identity
								</LoadingButton>
								<LoadingButton
									variant="outlined"
									color="error"
									startIcon={<CancelIcon />}
									onClick={() => handleRespondToReveal(false)}
									loading={respondToRevealMutation.isLoading}
								>
									Deny Request
								</LoadingButton>
							</Box>
						</Paper>
					)}

					{/* Show reveal status if not pending */}
					{input.isAnonymous && input.revealRequested && !hasPendingRevealRequest && (
						<Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
							<Typography variant="body2" color="text.secondary">
								<strong>Identity Reveal Status:</strong>{" "}
								{input.revealApproved
									? "You have revealed your identity to the admin"
									: "You have denied the identity reveal request"}
							</Typography>
						</Paper>
					)}

					{/* Conversation Section */}
					<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
						<Typography variant="h6" gutterBottom fontWeight={600}>
							Conversation
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
							Discuss your feedback with administrators. They may ask for clarification or provide updates.
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
											bgcolor: reply.userRole === "Admin" ? "primary.50" : "grey.50",
											borderLeft: 4,
											borderLeftColor: reply.userRole === "Admin" ? "primary.main" : "success.main",
										}}
									>
										<Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
											<Typography
												variant="caption"
												fontWeight={600}
												color={reply.userRole === "Admin" ? "primary.main" : "success.main"}
											>
												{reply.userRole === "Admin" ? "Admin" : "You"}
											</Typography>
											<Typography variant="caption" color="text.secondary">
												{DateTime.fromISO(reply.createdAt).toFormat("MMM dd, yyyy 'at' hh:mm a")}
											</Typography>
										</Box>
										<Typography variant="body2">{reply.message}</Typography>
									</Paper>
								))}
							</Box>
						) : (
							<Alert severity="info" sx={{ mb: 3 }}>
								No conversation yet. You can send a message to the admin below.
							</Alert>
						)}

						{/* Reply Form */}
						<Divider sx={{ my: 2 }} />
						<Box>
							<Typography variant="subtitle2" gutterBottom>
								Send Message to Admin
							</Typography>
							<TextField
								value={replyText}
								onChange={e => setReplyText(e.target.value)}
								placeholder="Type your message to the admin..."
								multiline
								rows={3}
								fullWidth
								sx={{ mb: 1 }}
								helperText={`${replyText.length} characters`}
							/>
							<LoadingButton
								variant="contained"
								startIcon={<ReplyIcon />}
								onClick={handleSendReply}
								loading={createReplyMutation.isLoading}
								disabled={!replyText.trim()}
							>
								Send Message
							</LoadingButton>
						</Box>
					</Paper>

					{/* Submission Details */}
					<Paper elevation={2} sx={{ p: 3 }}>
						<Typography variant="h6" gutterBottom fontWeight={600}>
							Submission Details
						</Typography>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
							<Box sx={{ display: "flex", justifyContent: "space-between" }}>
								<Typography variant="body2" color="text.secondary">
									Status:
								</Typography>
								<Chip
									label={input.status}
									color={INPUT_STATUS_COLORS[input.status] || "default"}
									size="small"
								/>
							</Box>
							<Box sx={{ display: "flex", justifyContent: "space-between" }}>
								<Typography variant="body2" color="text.secondary">
									Submitted:
								</Typography>
								<Typography variant="body2" fontWeight={500}>
									{DateTime.fromISO(input.createdAt).toFormat("MMM dd, yyyy 'at' hh:mm a")}
								</Typography>
							</Box>
							{input.updatedAt && input.updatedAt !== input.createdAt && (
								<Box sx={{ display: "flex", justifyContent: "space-between" }}>
									<Typography variant="body2" color="text.secondary">
										Last Updated:
									</Typography>
									<Typography variant="body2" fontWeight={500}>
										{DateTime.fromISO(input.updatedAt).toFormat("MMM dd, yyyy 'at' hh:mm a")}
									</Typography>
								</Box>
							)}
							<Box sx={{ display: "flex", justifyContent: "space-between" }}>
								<Typography variant="body2" color="text.secondary">
									Type:
								</Typography>
								<Typography variant="body2" fontWeight={500}>
									{input.type === "General" ? "General Feedback" : "Inquiry Response"}
								</Typography>
							</Box>
							{input.isAnonymous && (
								<Box sx={{ display: "flex", justifyContent: "space-between" }}>
									<Typography variant="body2" color="text.secondary">
										Anonymity:
									</Typography>
									<Chip label="Anonymous" size="small" color="default" />
								</Box>
							)}
						</Box>
					</Paper>
				</Box>
			</MainContainer>
		</RootLayout>
	);
}

export default withStudent(StudentInputDetailPage);
