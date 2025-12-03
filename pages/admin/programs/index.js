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
	useGetAllPrograms,
	useCreateProgramMutation,
	useUpdateProgramMutation,
	useDeleteProgramMutation,
	getAllProgramsQueryKey,
} from "modules/program";
import { withAdmin } from "modules/user";
import { getApiErrorMessage } from "modules/shared/shared.utils";

// Validation schema for program form
const programSchema = z.object({
	name: z.string().min(2, "Program name must be at least 2 characters"),
});

function ProgramFormDialog({ open, onClose, program = null }) {
	const isEdit = !!program;
	const queryClient = useQueryClient();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(programSchema),
		defaultValues: {
			name: program?.name || "",
		},
	});

	const createMutation = useCreateProgramMutation({
		onSuccess: (response) => {
			toast.success(response.message || "Program created successfully!");
			queryClient.invalidateQueries(getAllProgramsQueryKey());
			reset();
			onClose();
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to create program"));
		},
	});

	const updateMutation = useUpdateProgramMutation({
		onSuccess: (response) => {
			toast.success(response.message || "Program updated successfully!");
			queryClient.invalidateQueries(getAllProgramsQueryKey());
			reset();
			onClose();
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to update program"));
		},
	});

	const onSubmit = (data) => {
		if (isEdit) {
			updateMutation.mutate({ programId: program.id, data });
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
			<DialogTitle>{isEdit ? "Edit Program" : "Create New Program"}</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
						<Controller
							name="name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Program Name"
									fullWidth
									error={!!errors.name}
									helperText={errors.name?.message}
									autoFocus
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

function AdminProgramsPage() {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedProgram, setSelectedProgram] = useState(null);

	// Fetch programs
	const { data, isLoading, isError } = useGetAllPrograms({
		page,
		pageSize,
	});

	// Delete program mutation
	const deleteMutation = useDeleteProgramMutation({
		onSuccess: (response) => {
			toast.success(response.message || "Program deleted successfully!");
			queryClient.invalidateQueries(getAllProgramsQueryKey());
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to delete program"));
		},
	});

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleCreateClick = () => {
		setSelectedProgram(null);
		setDialogOpen(true);
	};

	const handleEditClick = (program) => {
		setSelectedProgram(program);
		setDialogOpen(true);
	};

	const handleDeleteClick = (program) => {
		if (confirm(`Are you sure you want to delete program "${program.name}"?`)) {
			deleteMutation.mutate(program.id);
		}
	};

	const handleDialogClose = () => {
		setSelectedProgram(null);
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
								Program Management
							</Typography>
							<Typography variant="body1" color="text.secondary">
								Manage academic programs
							</Typography>
						</Box>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={handleCreateClick}
						>
							Add Program
						</Button>
					</Box>

					{/* Loading State */}
					{isLoading && <Loader height="auto" />}

					{/* Error State */}
					{isError && (
						<Alert severity="error">
							Failed to load programs. Please try again later.
						</Alert>
					)}

					{/* Programs Table */}
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
										Total Programs
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
													<TableCell>Program Name</TableCell>
													<TableCell align="right">Actions</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{data.data.map((program) => (
													<TableRow key={program.id} hover>
														<TableCell>
															<Typography variant="body2" fontWeight={600}>
																{program.name}
															</Typography>
														</TableCell>
														<TableCell align="right">
															<IconButton
																size="small"
																color="primary"
																onClick={() => handleEditClick(program)}
															>
																<EditIcon fontSize="small" />
															</IconButton>
															<IconButton
																size="small"
																color="error"
																onClick={() => handleDeleteClick(program)}
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
										No programs found
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mb: 3 }}
									>
										Get started by creating your first program
									</Typography>
									<Button
										variant="contained"
										startIcon={<AddIcon />}
										onClick={handleCreateClick}
									>
										Add First Program
									</Button>
								</Box>
							)}
						</>
					)}
				</Box>

				{/* Program Form Dialog */}
				<ProgramFormDialog
					open={dialogOpen}
					onClose={handleDialogClose}
					program={selectedProgram}
				/>
			</MainContainer>
		</RootLayout>
	);
}

export default withAdmin(AdminProgramsPage);
