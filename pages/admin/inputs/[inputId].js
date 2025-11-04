import { useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Timeline from "@mui/material/Timeline";
import TimelineItem from "@mui/material/TimelineItem";
import TimelineSeparator from "@mui/material/TimelineSeparator";
import TimelineConnector from "@mui/material/TimelineConnector";
import TimelineContent from "@mui/material/TimelineContent";
import TimelineDot from "@mui/material/TimelineDot";
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
import { mockInputsSimplified } from "modules/shared/shared.mock-data-v2";

const getSeverityLabel = severity => {
	if (severity === 3) return "HIGH";
	if (severity === 2) return "MEDIUM";
	return "LOW";
};

const getSeverityColor = severity => {
	if (severity === 3) return "error";
	if (severity === 2) return "warning";
	return "success";
};

export default function InputDetailPage() {
	const router = useRouter();
	const { inputId } = router.query;
	const [replyText, setReplyText] = useState("");
	const [isReplying, setIsReplying] = useState(false);
	const [isRequestingReveal, setIsRequestingReveal] = useState(false);

	// Mock: Find input
	const input = mockInputsSimplified.find(i => i.id === inputId);

	if (!input) {
		return (
			<RootLayout>
				<MainContainer>
					<Alert severity="error">Input not found</Alert>
				</MainContainer>
			</RootLayout>
		);
	}

	const handleSendReply = async () => {
		if (!replyText.trim()) {
			toast.error("Please enter a reply message");
			return;
		}

		setIsReplying(true);
		// Mock API call
		await new Promise(resolve => setTimeout(resolve, 1000));
		setIsReplying(false);
		toast.success("Reply sent successfully!");
		setReplyText("");
	};

	const handleRequestReveal = async () => {
		if (input.identityRevealRequested) {
			toast.info("Identity reveal already requested");
			return;
		}

		if (
			!confirm(
				"Are you sure you want to request identity reveal for this input?",
			)
		) {
			return;
		}

		setIsRequestingReveal(true);
		// Mock API call
		await new Promise(resolve => setTimeout(resolve, 1000));
		setIsRequestingReveal(false);
		toast.success("Identity reveal request sent!");
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
						<Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
							<Typography variant="caption" color="text.secondary">
								{DateTime.fromISO(input.createdAt).toFormat(
									"MMMM dd, yyyy 'at' hh:mm a",
								)}
							</Typography>
							<Box sx={{ display: "flex", gap: 1 }}>
								<Chip label={input.sentiment} size="small" color="primary" />
								<Chip
									label={getSeverityLabel(input.severity)}
									size="small"
									color={getSeverityColor(input.severity)}
								/>
							</Box>
						</Box>

						<Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
							{input.body}
						</Typography>

						{/* Quality Metrics */}
						<Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}>
							<Typography variant="subtitle2" gutterBottom fontWeight={600}>
								Quality Metrics
							</Typography>
							<Grid container spacing={2} sx={{ mt: 1 }}>
								<Grid item xs={6} sm={3}>
									<Box sx={{ textAlign: "center" }}>
										<Typography variant="h5" fontWeight={600}>
											{(parseFloat(input.urgencyPct) * 100).toFixed(0)}%
										</Typography>
										<Typography variant="caption" color="text.secondary">
											Urgency
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={6} sm={3}>
									<Box sx={{ textAlign: "center" }}>
										<Typography variant="h5" fontWeight={600}>
											{(parseFloat(input.importancePct) * 100).toFixed(0)}%
										</Typography>
										<Typography variant="caption" color="text.secondary">
											Importance
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={6} sm={3}>
									<Box sx={{ textAlign: "center" }}>
										<Typography variant="h5" fontWeight={600}>
											{(parseFloat(input.clarityPct) * 100).toFixed(0)}%
										</Typography>
										<Typography variant="caption" color="text.secondary">
											Clarity
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={6} sm={3}>
									<Box sx={{ textAlign: "center" }}>
										<Typography variant="h5" fontWeight={600}>
											{(parseFloat(input.qualityPct) * 100).toFixed(0)}%
										</Typography>
										<Typography variant="caption" color="text.secondary">
											Overall Quality
										</Typography>
									</Box>
								</Grid>
							</Grid>

							{/* Additional Info */}
							<Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
								<Chip
									label={`Score: ${input.score}`}
									size="small"
									color="primary"
									variant="outlined"
								/>
								<Chip
									label={`Tone: ${input.tone}`}
									size="small"
									variant="outlined"
								/>
							</Box>
						</Paper>

						<Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
							{/* Show AI theme only for general inputs */}
							{input.type === "GENERAL" && input.aiTheme && (
								<Chip
									label={`Theme: ${input.aiTheme}`}
									size="small"
									color="primary"
								/>
							)}

							{input.type === "INQUIRY_LINKED" && input.inquiryTitle && (
								<Chip label={`Inquiry: ${input.inquiryTitle}`} size="small" />
							)}
							{input.type === "GENERAL" && (
								<Chip label="General Feedback" size="small" variant="outlined" />
							)}
						</Box>

						{/* Student Metadata */}
						<Divider sx={{ my: 2 }} />
						<Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
							<Box>
								<Typography variant="caption" color="text.secondary">
									Department
								</Typography>
								<Typography variant="body2">{input.department}</Typography>
							</Box>
							<Box>
								<Typography variant="caption" color="text.secondary">
									Program
								</Typography>
								<Typography variant="body2">{input.program}</Typography>
							</Box>
							<Box>
								<Typography variant="caption" color="text.secondary">
									Semester
								</Typography>
								<Typography variant="body2">{input.semester}</Typography>
							</Box>
							<Box>
								<Typography variant="caption" color="text.secondary">
									Identity Status
								</Typography>
								<Typography variant="body2" fontWeight={600}>
									{input.identityRevealed ? "Revealed" : "Anonymous"}
								</Typography>
							</Box>
						</Box>
					</Paper>

					{/* Admin Actions */}
					<Paper elevation={2} sx={{ p: 3, mb: 3 }}>
						<Typography variant="h6" gutterBottom fontWeight={600}>
							Admin Actions
						</Typography>

						{/* Reply to Input */}
						<Box sx={{ mb: 3 }}>
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
								loading={isReplying}
							>
								Send Reply
							</LoadingButton>
						</Box>

						{/* Request Identity Reveal */}
						<Box>
							<Typography variant="subtitle2" gutterBottom>
								Request Identity Reveal
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
								Request the student to reveal their identity for this specific
								feedback.
							</Typography>
							<LoadingButton
								variant="outlined"
								color="warning"
								startIcon={<LockOpenIcon />}
								onClick={handleRequestReveal}
								loading={isRequestingReveal}
								disabled={input.identityRevealRequested}
							>
								{input.identityRevealRequested
									? "Already Requested"
									: "Request Identity Reveal"}
							</LoadingButton>
						</Box>
					</Paper>

					{/* History Timeline */}
					<Paper elevation={2} sx={{ p: 3 }}>
						<Typography variant="h6" gutterBottom fontWeight={600}>
							Activity History
						</Typography>

						<Timeline>
							{/* Input Created */}
							<TimelineItem>
								<TimelineSeparator>
									<TimelineDot color="primary" />
									<TimelineConnector />
								</TimelineSeparator>
								<TimelineContent>
									<Typography variant="body2" fontWeight={600}>
										Input Submitted
									</Typography>
									<Typography variant="caption" color="text.secondary">
										{DateTime.fromISO(input.createdAt).toFormat(
											"MMM dd, yyyy 'at' hh:mm a",
										)}
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Student submitted this feedback
									</Typography>
								</TimelineContent>
							</TimelineItem>

							{/* Admin Reply */}
							{input.adminReply && (
								<TimelineItem>
									<TimelineSeparator>
										<TimelineDot color="success" />
										<TimelineConnector />
									</TimelineSeparator>
									<TimelineContent>
										<Typography variant="body2" fontWeight={600}>
											Admin Reply Sent
										</Typography>
										<Typography variant="caption" color="text.secondary">
											{DateTime.fromISO(input.adminReply.repliedAt).toFormat(
												"MMM dd, yyyy 'at' hh:mm a",
											)}
										</Typography>
										<Paper variant="outlined" sx={{ p: 1.5, mt: 1, bgcolor: "grey.50" }}>
											<Typography variant="body2">
												{input.adminReply.message}
											</Typography>
											<Typography variant="caption" color="text.secondary">
												By: {input.adminReply.repliedBy}
											</Typography>
										</Paper>
									</TimelineContent>
								</TimelineItem>
							)}

							{/* Identity Reveal Request */}
							{input.identityRevealRequested && (
								<TimelineItem>
									<TimelineSeparator>
										<TimelineDot color="warning" />
									</TimelineSeparator>
									<TimelineContent>
										<Typography variant="body2" fontWeight={600}>
											Identity Reveal Requested
										</Typography>
										<Typography variant="caption" color="text.secondary">
											{DateTime.fromISO(
												input.identityRevealRequestedAt,
											).toFormat("MMM dd, yyyy 'at' hh:mm a")}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											Waiting for student approval
										</Typography>
									</TimelineContent>
								</TimelineItem>
							)}
						</Timeline>
					</Paper>
				</Box>
			</MainContainer>
		</RootLayout>
	);
}
