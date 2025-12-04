import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import ForumIcon from "@mui/icons-material/Forum";
import { DateTime } from "luxon";
import {
	ImportanceBadge,
	SentimentIndicator,
	ThemeChip,
	ToneIndicator,
	SeverityBadge,
} from "modules/shared/components";

/**
 * Display a single input/feedback card
 * @param {Object} props
 * @param {Object} props.input - Input data object
 * @param {boolean} [props.showAIAnalysis=true] - Whether to show AI analysis section
 * @param {boolean} [props.showInquiryLink=true] - Whether to show linked inquiry
 * @param {Function} [props.onClick] - Optional click handler
 */
export function InputCard({
	input,
	showAIAnalysis = true,
	showInquiryLink = true,
	onClick,
}) {
	const formattedDate = input.createdAt
		? DateTime.fromISO(input.createdAt).toFormat("MMM dd, yyyy 'at' hh:mm a")
		: "";

	return (
		<Card
			sx={{
				mb: 2,
				cursor: onClick ? "pointer" : "default",
				transition: "all 0.2s",
				"&:hover": onClick
					? {
							boxShadow: 4,
							transform: "translateY(-2px)",
						}
					: {},
			}}
			onClick={onClick}
		>
			<CardContent>
				{/* Header: Type Badge + Date */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 2,
					}}
				>
					<Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
						<Chip
							label={
								input.type === "InquiryLinked"
									? "Inquiry Response"
									: input.type === "General"
										? "General Feedback"
										: input.type || "Feedback"
							}
							size="small"
							color={input.type === "InquiryLinked" ? "primary" : "default"}
							variant="outlined"
						/>
						{input.status && (
							<Chip
								label={input.status}
								size="small"
								color={
									input.status === "Reviewed" || input.status === "Processed"
										? "success"
										: input.status === "Processing" || input.status === "Pending"
											? "warning"
											: "default"
								}
							/>
						)}
						{/* Reply Count Indicator */}
						{input.replyCount > 0 && (
							<Chip
								icon={<ForumIcon />}
								label={`${input.replyCount} ${input.replyCount === 1 ? "reply" : "replies"}`}
								size="small"
								color="info"
								variant="outlined"
							/>
						)}
					</Box>
					<Typography variant="caption" color="text.secondary">
						{formattedDate}
					</Typography>
				</Box>

				{/* Linked Inquiry */}
				{showInquiryLink && input.inquiryTitle && (
					<Box sx={{ mb: 2 }}>
						<Typography variant="caption" color="text.secondary">
							Response to:
						</Typography>
						<Typography variant="body2" fontWeight={600} color="primary.main">
							{input.inquiryTitle}
						</Typography>
					</Box>
				)}

				{/* Input Body */}
				<Typography
					variant="body2"
					sx={{
						mb: 2,
						lineHeight: 1.6,
						color: "text.primary",
					}}
				>
					{input.body}
				</Typography>

				{/* AI Analysis Section */}
				{showAIAnalysis && (input.sentiment || input.tone || input.metrics || input.theme || input.topic) && (
					<Box
						sx={{
							mt: 2,
							pt: 2,
							borderTop: "1px solid",
							borderColor: "divider",
						}}
					>
						<Typography
							variant="caption"
							color="text.secondary"
							sx={{ mb: 1, display: "block" }}
						>
							AI Analysis
						</Typography>

						<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
							{/* Severity (High/Medium/Low) - Most important */}
							{input.metrics?.severity && (
								<SeverityBadge severity={input.metrics.severity} />
							)}

							{/* Sentiment */}
							{input.sentiment && (
								<SentimentIndicator sentiment={input.sentiment.toUpperCase()} />
							)}

							{/* Tone */}
							{input.tone && (
								<ToneIndicator tone={input.tone} />
							)}

							{/* Theme (if available) */}
							{input.theme?.name && (
								<ThemeChip theme={input.theme.name} />
							)}

							{/* Topic (if available) */}
							{input.topic?.name && (
								<Tooltip
									title={`Topic: ${input.topic.name} - Administrator-managed category for organizing and tracking feedback by specific areas or departments.`}
									arrow
									placement="top"
								>
									<Chip
										label={input.topic.name}
										size="small"
										variant="outlined"
										color="secondary"
										sx={{ cursor: "help" }}
									/>
								</Tooltip>
							)}
						</Box>
					</Box>
				)}

				{/* Student Metadata (for admin view) */}
				{input.department && input.program && (
					<Box
						sx={{
							mt: 2,
							pt: 2,
							borderTop: "1px solid",
							borderColor: "divider",
							display: "flex",
							gap: 2,
							flexWrap: "wrap",
						}}
					>
						<Typography variant="caption" color="text.secondary">
							<strong>Department:</strong> {input.department}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							<strong>Program:</strong> {input.program}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							<strong>Semester:</strong> {input.semester}
						</Typography>
					</Box>
				)}
			</CardContent>
		</Card>
	);
}

export default InputCard;
