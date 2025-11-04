import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { DateTime } from "luxon";

/**
 * Display an inquiry card
 * @param {Object} props
 * @param {Object} props.inquiry - Inquiry data object
 * @param {Function} [props.onRespond] - Handler when user clicks to respond
 * @param {Function} [props.onClick] - Handler when card is clicked (for admin view)
 * @param {boolean} [props.showStatus=true] - Whether to show status badge
 */
export function InquiryCard({
	inquiry,
	onRespond,
	onClick,
	showStatus = true,
}) {
	const formatDate = dateString => {
		if (!dateString) return "";
		return DateTime.fromISO(dateString).toFormat("MMM dd, yyyy");
	};

	const isActive = inquiry.status === "ACTIVE";
	const isPastDeadline = inquiry.endDate
		? DateTime.fromISO(inquiry.endDate) < DateTime.now()
		: false;

	return (
		<Card
			sx={{
				mb: 2,
				border: isActive ? "2px solid" : "1px solid",
				borderColor: isActive ? "primary.main" : "divider",
				cursor: onClick ? "pointer" : "default",
				"&:hover": onClick ? { bgcolor: "grey.50" } : {},
			}}
			onClick={onClick ? () => onClick(inquiry) : undefined}
		>
			<CardContent>
				{/* Header: Question + Status */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "flex-start",
						mb: 2,
					}}
				>
					<Typography variant="h6" fontWeight={600} sx={{ flex: 1, mr: 2 }}>
						Inquiry Question
					</Typography>
					{showStatus && (
						<Chip
							label={inquiry.status}
							size="small"
							color={
								inquiry.status === "ACTIVE"
									? "success"
									: inquiry.status === "DRAFT"
										? "warning"
										: "default"
							}
						/>
					)}
				</Box>

				{/* Body (Question Prompt) */}
				<Typography
					variant="body2"
					color="text.secondary"
					sx={{ mb: 2, lineHeight: 1.6 }}
				>
					{inquiry.body ? (inquiry.body.length > 200 ? `${inquiry.body.substring(0, 200)}...` : inquiry.body) : (inquiry.description || '')}
				</Typography>

				{/* Date Range */}
				<Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
					<Box>
						<Typography variant="caption" color="text.secondary">
							Start Date
						</Typography>
						<Typography variant="body2" fontWeight={500}>
							{formatDate(inquiry.startDate)}
						</Typography>
					</Box>
					<Box>
						<Typography variant="caption" color="text.secondary">
							End Date
						</Typography>
						<Typography
							variant="body2"
							fontWeight={500}
							color={isPastDeadline ? "error.main" : "inherit"}
						>
							{formatDate(inquiry.endDate)}
							{isPastDeadline && " (Expired)"}
						</Typography>
					</Box>
					{inquiry.totalInputs !== undefined && (
						<Box>
							<Typography variant="caption" color="text.secondary">
								Responses
							</Typography>
							<Typography variant="body2" fontWeight={500}>
								{inquiry.totalInputs}
							</Typography>
						</Box>
					)}
				</Box>

				{/* Target Filters */}
				{(inquiry.targetDepartments?.length > 0 ||
					inquiry.targetPrograms?.length > 0 ||
					inquiry.targetSemesters?.length > 0) && (
					<Box sx={{ mt: 2 }}>
						<Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
							Target Audience:
						</Typography>
						<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
							{inquiry.targetDepartments?.map(dept => (
								<Chip key={dept} label={dept} size="small" variant="outlined" />
							))}
							{inquiry.targetPrograms?.map(prog => (
								<Chip key={prog} label={prog} size="small" variant="outlined" />
							))}
							{inquiry.targetSemesters?.map(sem => (
								<Chip
									key={sem}
									label={`Semester ${sem}`}
									size="small"
									variant="outlined"
								/>
							))}
						</Box>
					</Box>
				)}
			</CardContent>

			{/* Actions */}
			{onRespond && isActive && !isPastDeadline && (
				<CardActions sx={{ px: 2, pb: 2 }}>
					<Button
						variant="contained"
						endIcon={<ArrowForwardIcon />}
						onClick={() => onRespond(inquiry)}
						fullWidth
					>
						Respond to This Inquiry
					</Button>
				</CardActions>
			)}
		</Card>
	);
}

export default InquiryCard;
