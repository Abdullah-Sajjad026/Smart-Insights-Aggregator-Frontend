import { useState } from "react";
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
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader } from "modules/shared/components";
import {
	useGetAllSemesters,
	useCreateSemesterMutation,
	useUpdateSemesterMutation,
	useDeleteSemesterMutation,
	getAllSemestersQueryKey,
} from "modules/semester";
import { withAdmin } from "modules/user";
import { getApiErrorMessage } from "modules/shared/shared.utils";

// Validation schema for semester form
const semesterSchema = z.object({
	name: z.string().min(2, "Semester name must be at least 2 characters"),
	value: z.string().min(1, "Semester value is required"),
});

function SemesterFormDialog({ open, onClose, semester = null }) {
	const isEdit = !!semester;
	const queryClient = useQueryClient();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(semesterSchema),
		defaultValues: {
			name: semester?.name || "",
			value: semester?.value || "",
		},
	});

	const createMutation = useCreateSemesterMutation({
		onSuccess: response => {
			toast.success(response.message || "Semester created successfully!");
			queryClient.invalidateQueries(getAllSemestersQueryKey());
			reset();
			onClose();
		},
		onError: error => {
			toast.error(getApiErrorMessage(error, "Failed to create semester"));
		},
	});

	const updateMutation = useUpdateSemesterMutation({
		onSuccess: response => {
			toast.success(response.message || "Semester updated successfully!");
			queryClient.invalidateQueries(getAllSemestersQueryKey());
			reset();
			onClose();
		},
		onError: error => {
			toast.error(getApiErrorMessage(error, "Failed to update semester"));
		},
	});

	const onSubmit = data => {
		if (isEdit) {
			updateMutation.mutate({ id: semester.id, data });
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
			<DialogTitle>
				{isEdit ? "Edit Semester" : "Create New Semester"}
			</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
						<Controller
							name="name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Semester Name (e.g., Fall 2023)"
									fullWidth
									error={!!errors.name}
									helperText={errors.name?.message}
									autoFocus
								/>
							)}
						/>
						<Controller
							name="value"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Value (e.g., 1, 2, 3)"
									fullWidth
									error={!!errors.value}
									helperText={errors.value?.message}
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

function AdminSemestersPage() {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedSemester, setSelectedSemester] = useState(null);

	// Fetch semesters
	const { data, isLoading, isError } = useGetAllSemesters({
		page,
		pageSize,
	});

	// Delete semester mutation
	const deleteMutation = useDeleteSemesterMutation({
		onSuccess: response => {
			toast.success(response.message || "Semester deleted successfully!");
			queryClient.invalidateQueries(getAllSemestersQueryKey());
		},
		onError: error => {
			toast.error(getApiErrorMessage(error, "Failed to delete semester"));
		},
	});

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleCreateClick = () => {
		setSelectedSemester(null);
		setDialogOpen(true);
	};

	const handleEditClick = semester => {
		setSelectedSemester(semester);
		setDialogOpen(true);
	};

	const handleDeleteClick = semester => {
		if (
			confirm(`Are you sure you want to delete semester "${semester.name}"?`)
		) {
			deleteMutation.mutate(semester.id);
		}
	};

	const handleDialogClose = () => {
		setSelectedSemester(null);
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
								Semester Management
							</Typography>
							<Typography variant="body1" color="text.secondary">
								Manage academic semesters
							</Typography>
						</Box>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={handleCreateClick}
						>
							Add Semester
						</Button>
					</Box>

					{/* Loading State */}
					{isLoading && <Loader height="auto" />}

					{/* Error State */}
					{isError && (
						<Alert severity="error">
							Failed to load semesters. Please try again later.
						</Alert>
					)}

					{/* Semesters Table */}
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
										Total Semesters
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
													<TableCell>Semester</TableCell>
													<TableCell align="right">Actions</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{data.data.map(semester => (
													<TableRow key={semester.id} hover>
														<TableCell>
															<Typography variant="body2">
																{semester.value}
															</Typography>
														</TableCell>
														<TableCell align="right">
															<IconButton
																size="small"
																color="primary"
																onClick={() => handleEditClick(semester)}
															>
																<EditIcon fontSize="small" />
															</IconButton>
															<IconButton
																size="small"
																color="error"
																onClick={() => handleDeleteClick(semester)}
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
										No semesters found
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mb: 3 }}
									>
										Get started by creating your first semester
									</Typography>
									<Button
										variant="contained"
										startIcon={<AddIcon />}
										onClick={handleCreateClick}
									>
										Add First Semester
									</Button>
								</Box>
							)}
						</>
					)}
				</Box>

				{/* Semester Form Dialog */}
				<SemesterFormDialog
					open={dialogOpen}
					onClose={handleDialogClose}
					semester={selectedSemester}
				/>
			</MainContainer>
		</RootLayout>
	);
}

export default withAdmin(AdminSemestersPage);
