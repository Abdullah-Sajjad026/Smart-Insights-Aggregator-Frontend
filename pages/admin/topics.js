import { useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DateTime } from "luxon";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader } from "modules/shared/components";
import {
	useGetAllTopics,
	useCreateTopicMutation,
	useUpdateTopicMutation,
	useDeleteTopicMutation,
	getAllTopicsQueryKey,
} from "modules/topic";
import { withAdmin } from "modules/user";
import { getApiErrorMessage } from "modules/shared/shared.utils";

// Validation schema for topic form
const topicSchema = z.object({
	name: z.string().min(2, "Topic name must be at least 2 characters"),
	description: z.string().optional(),
});

function TopicFormDialog({ open, onClose, topic = null }) {
	const isEdit = !!topic;
	const queryClient = useQueryClient();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(topicSchema),
		defaultValues: {
			name: topic?.name || "",
			description: topic?.description || "",
		},
	});

	const createMutation = useCreateTopicMutation({
		onSuccess: (response) => {
			toast.success(response.message || "Topic created successfully!");
			queryClient.invalidateQueries(getAllTopicsQueryKey());
			reset();
			onClose();
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to create topic"));
		},
	});

	const updateMutation = useUpdateTopicMutation({
		onSuccess: (response) => {
			toast.success(response.message || "Topic updated successfully!");
			queryClient.invalidateQueries(getAllTopicsQueryKey());
			reset();
			onClose();
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to update topic"));
		},
	});

	const onSubmit = (data) => {
		if (isEdit) {
			updateMutation.mutate({ topicId: topic.id, data });
		} else {
			createMutation.mutate(data);
		}
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	const isLoading = createMutation.isLoading || updateMutation.isLoading;

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>{isEdit ? "Edit Topic" : "Create New Topic"}</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
						<Controller
							name="name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Topic Name"
									fullWidth
									error={!!errors.name}
									helperText={errors.name?.message}
									autoFocus
								/>
							)}
						/>

						<Controller
							name="description"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Description"
									multiline
									rows={3}
									fullWidth
									error={!!errors.description}
									helperText={errors.description?.message}
								/>
							)}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} disabled={isLoading}>
						Cancel
					</Button>
					<Button type="submit" variant="contained" disabled={isLoading}>
						{isEdit ? "Update" : "Create"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

function AdminTopicsPage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedTopic, setSelectedTopic] = useState(null);

	// Fetch topics
	const { data, isLoading, isError } = useGetAllTopics({
		page,
		pageSize,
	});

	// Delete topic mutation
	const deleteMutation = useDeleteTopicMutation({
		onSuccess: (response) => {
			toast.success(response.message || "Topic deleted successfully!");
			queryClient.invalidateQueries(getAllTopicsQueryKey());
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to delete topic"));
		},
	});

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleCreateClick = () => {
		setSelectedTopic(null);
		setDialogOpen(true);
	};

	const handleEditClick = (topic) => {
		setSelectedTopic(topic);
		setDialogOpen(true);
	};

	const handleDeleteClick = (topic) => {
		if (confirm(`Are you sure you want to delete topic "${topic.name}"?`)) {
			deleteMutation.mutate(topic.id);
		}
	};

	const handleDialogClose = () => {
		setSelectedTopic(null);
		setDialogOpen(false);
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
								Topic Management
							</Typography>
							<Typography variant="body1" color="text.secondary">
								Organize feedback into topics and themes
							</Typography>
						</Box>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={handleCreateClick}
						>
							Add Topic
						</Button>
					</Box>

					{/* Loading State */}
					{isLoading && <Loader height="auto" />}

					{/* Error State */}
					{isError && (
						<Alert severity="error">
							Failed to load topics. Please try again later.
						</Alert>
					)}

					{/* Topics Table */}
					{data && (
						<>
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
										Total Topics
									</Typography>
									<Typography variant="h6" fontWeight={600}>
										{data.pagination?.totalItems || 0}
									</Typography>
								</Box>
							</Box>

							{data.data && data.data.length > 0 ? (
								<>
									<TableContainer component={Paper} elevation={2}>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell>Topic Name</TableCell>
													<TableCell>Description</TableCell>
													<TableCell>Inputs Linked</TableCell>
													<TableCell>Created</TableCell>
													<TableCell align="right">Actions</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{data.data.map((topic) => (
													<TableRow key={topic.id} hover>
														<TableCell>
															<Typography
																variant="body2"
																fontWeight={600}
																sx={{
																	cursor: "pointer",
																	color: "primary.main",
																	"&:hover": { textDecoration: "underline" },
																}}
																onClick={() => router.push(`/admin/topics/${topic.id}`)}
															>
																{topic.name}
															</Typography>
														</TableCell>
														<TableCell>
															<Typography variant="body2" color="text.secondary">
																{topic.description || "-"}
															</Typography>
														</TableCell>
														<TableCell>
															<Typography variant="body2">
																{topic.inputCount || 0}
															</Typography>
														</TableCell>
														<TableCell>
															<Typography variant="caption" color="text.secondary">
																{topic.createdAt
																	? DateTime.fromISO(topic.createdAt).toFormat("MMM dd, yyyy")
																	: "N/A"}
															</Typography>
														</TableCell>
														<TableCell align="right">
															<IconButton
																size="small"
																color="primary"
																onClick={() => handleEditClick(topic)}
															>
																<EditIcon fontSize="small" />
															</IconButton>
															<IconButton
																size="small"
																color="error"
																onClick={() => handleDeleteClick(topic)}
																disabled={deleteMutation.isLoading}
															>
																<DeleteIcon fontSize="small" />
															</IconButton>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>

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
										No topics found
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mb: 3 }}
									>
										Get started by creating your first topic
									</Typography>
									<Button
										variant="contained"
										startIcon={<AddIcon />}
										onClick={handleCreateClick}
									>
										Add First Topic
									</Button>
								</Box>
							)}
						</>
					)}
				</Box>

				{/* Topic Form Dialog */}
				<TopicFormDialog
					open={dialogOpen}
					onClose={handleDialogClose}
					topic={selectedTopic}
				/>
			</MainContainer>
		</RootLayout>
	);
}

export default withAdmin(AdminTopicsPage);
