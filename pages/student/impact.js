import { useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CircleIcon from "@mui/icons-material/Circle";
import { DateTime } from "luxon";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader } from "modules/shared/components";
import { useGetMyContributions } from "modules/topic";
import { withStudent } from "modules/user";

function TopicImpactCard({ topic }) {
	const [expanded, setExpanded] = useState(false);

	const latestUpdate = topic.updates && topic.updates.length > 0 ? topic.updates[0] : null;

	return (
		<Card elevation={2} sx={{ mb: 2 }}>
			<CardContent>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
					<Box>
						<Typography variant="h6" fontWeight={600}>
							{topic.name}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							Started {DateTime.fromISO(topic.createdAt).toRelative()}
						</Typography>
					</Box>
					<Chip
						label={topic.status || "Submitted"}
						color={
							topic.status === "Completed"
								? "success"
								: topic.status === "InProgress"
								? "info"
								: topic.status === "Rejected"
								? "error"
								: "default"
						}
						size="small"
						sx={{ fontWeight: 600 }}
					/>
				</Box>

				{latestUpdate && (
					<Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1, mb: 2 }}>
						<Typography variant="subtitle2" gutterBottom color="primary">
							Latest Update
						</Typography>
						<Typography variant="body2">
							{latestUpdate.message}
						</Typography>
						<Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
							{DateTime.fromISO(latestUpdate.createdAt).toRelative()} by {latestUpdate.adminName}
						</Typography>
					</Box>
				)}

				<Typography variant="body2" color="text.secondary">
					You contributed to this topic
				</Typography>
			</CardContent>

			{topic.updates && topic.updates.length > 1 && (
				<>
					<CardActions>
						<Button
							size="small"
							onClick={() => setExpanded(!expanded)}
							endIcon={<ExpandMoreIcon sx={{ transform: expanded ? "rotate(180deg)" : "none", transition: "0.3s" }} />}
						>
							{expanded ? "Hide History" : "View Update History"}
						</Button>
					</CardActions>
					<Collapse in={expanded} timeout="auto" unmountOnExit>
						<CardContent>
							<Typography variant="subtitle2" gutterBottom>
								Update History
							</Typography>
							<Box sx={{ mt: 1 }}>
								{topic.updates.map((update, index) => (
									<Box key={update.id} sx={{ display: "flex", mb: 2 }}>
										{/* Timeline Line and Dot */}
										<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mr: 2, mt: 0.5 }}>
											<Box
												sx={{
													width: 12,
													height: 12,
													borderRadius: "50%",
													bgcolor: "primary.main",
													zIndex: 1,
												}}
											/>
											{index < topic.updates.length - 1 && (
												<Box
													sx={{
														width: 2,
														flexGrow: 1,
														bgcolor: "grey.200",
														my: 0.5,
													}}
												/>
											)}
										</Box>

										{/* Content */}
										<Box sx={{ flexGrow: 1, pb: index < topic.updates.length - 1 ? 1 : 0 }}>
											<Typography variant="caption" color="text.secondary" display="block">
												{DateTime.fromISO(update.createdAt).toFormat("MMM dd, HH:mm")}
											</Typography>
											<Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
												{update.newStatus && (
													<Chip
														label={update.newStatus}
														size="small"
														variant="outlined"
														sx={{ height: 20, fontSize: "0.6rem" }}
													/>
												)}
												<Typography variant="body2">
													{update.message}
												</Typography>
											</Box>
										</Box>
									</Box>
								))}
							</Box>
						</CardContent>
					</Collapse>
				</>
			)}
		</Card>
	);
}

function StudentImpactPage() {
	const router = useRouter();

	// Fetch topics contributed to
	const { data: topics, isLoading, isError } = useGetMyContributions();

	return (
		<RootLayout>
			<MainContainer>
				<Box sx={{ py: 4 }}>
					{/* Page Header */}
					<Box sx={{ mb: 4 }}>
						<Typography variant="h4" gutterBottom fontWeight={600}>
							My Impact
						</Typography>
						<Typography variant="body1" color="text.secondary">
							See how your feedback is driving change. These are the topics you've contributed to.
						</Typography>
					</Box>

					{/* Loading State */}
					{isLoading && <Loader height="auto" />}

					{/* Error State */}
					{isError && (
						<Alert severity="error" sx={{ mb: 3 }}>
							Failed to load your impact data. Please try again later.
						</Alert>
					)}

					{/* Topics List */}
					{topics && topics.length > 0 ? (
						<Grid container spacing={3}>
							{topics.map((topic) => (
								<Grid item xs={12} md={6} key={topic.id}>
									<TopicImpactCard topic={topic} />
								</Grid>
							))}
						</Grid>
					) : topics && (
						<Box
							sx={{
								textAlign: "center",
								py: 8,
								px: 2,
								bgcolor: "grey.50",
								borderRadius: 2
							}}
						>
							<Typography variant="h6" color="text.secondary" gutterBottom>
								No impact data yet
							</Typography>
							<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
								Once your feedback is grouped into topics, you'll see them here along with status updates.
							</Typography>
							<Button
								variant="contained"
								onClick={() => router.push("/input/submit")}
							>
								Submit Feedback
							</Button>
						</Box>
					)}
				</Box>
			</MainContainer>
		</RootLayout>
	);
}

export default withStudent(StudentImpactPage);
