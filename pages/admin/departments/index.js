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
	useGetAllDepartments,
	useCreateDepartmentMutation,
	useUpdateDepartmentMutation,
	useDeleteDepartmentMutation,
	getAllDepartmentsQueryKey,
} from "modules/department";
import { withAdmin } from "modules/user";
import { getApiErrorMessage } from "modules/shared/shared.utils";

// Validation schema for department form
const departmentSchema = z.object({
	name: z.string().min(2, "Department name must be at least 2 characters"),
});

function DepartmentFormDialog({ open, onClose, department = null }) {
	const isEdit = !!department;
	const queryClient = useQueryClient();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(departmentSchema),
		defaultValues: {
			name: department?.name || "",
		},
	});

	const createMutation = useCreateDepartmentMutation({
		onSuccess: (response) => {
			toast.success(response.message || "Department created successfully!");
			queryClient.invalidateQueries(getAllDepartmentsQueryKey());
			reset();
			onClose();
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to create department"));
		},
	});

	const updateMutation = useUpdateDepartmentMutation({
		onSuccess: (response) => {
			toast.success(response.message || "Department updated successfully!");
			queryClient.invalidateQueries(getAllDepartmentsQueryKey());
			reset();
			onClose();
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to update department"));
		},
	});

	const onSubmit = (data) => {
		if (isEdit) {
			updateMutation.mutate({ departmentId: department.id, data });
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
			<DialogTitle>{isEdit ? "Edit Department" : "Create New Department"}</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
						<Controller
							name="name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Department Name"
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

function AdminDepartmentsPage() {
	const queryClient = useQueryClient();
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedDepartment, setSelectedDepartment] = useState(null);

	// Fetch departments
	const { data, isLoading, isError } = useGetAllDepartments({
		page,
		pageSize,
	});

	// Delete department mutation
	const deleteMutation = useDeleteDepartmentMutation({
		onSuccess: (response) => {
			toast.success(response.message || "Department deleted successfully!");
			queryClient.invalidateQueries(getAllDepartmentsQueryKey());
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to delete department"));
		},
	});

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleCreateClick = () => {
		setSelectedDepartment(null);
		setDialogOpen(true);
	};

	const handleEditClick = (department) => {
		setSelectedDepartment(department);
		setDialogOpen(true);
	};

	const handleDeleteClick = (department) => {
		if (confirm(`Are you sure you want to delete department "${department.name}"?`)) {
			deleteMutation.mutate(department.id);
		}
	};

	const handleDialogClose = () => {
		setSelectedDepartment(null);
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
								Department Management
							</Typography>
							<Typography variant="body1" color="text.secondary">
								Manage university departments
							</Typography>
						</Box>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={handleCreateClick}
						>
							Add Department
						</Button>
					</Box>

					{/* Loading State */}
					{isLoading && <Loader height="auto" />}

					{/* Error State */}
					{isError && (
						<Alert severity="error">
							Failed to load departments. Please try again later.
						</Alert>
					)}

					{/* Departments Table */}
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
										Total Departments
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
													<TableCell>Department Name</TableCell>
													<TableCell align="right">Actions</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{data.data.map((department) => (
													<TableRow key={department.id} hover>
														<TableCell>
															<Typography variant="body2" fontWeight={600}>
																{department.name}
															</Typography>
														</TableCell>
														<TableCell align="right">
															<IconButton
																size="small"
																color="primary"
																onClick={() => handleEditClick(department)}
															>
																<EditIcon fontSize="small" />
															</IconButton>
															<IconButton
																size="small"
																color="error"
																onClick={() => handleDeleteClick(department)}
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
										No departments found
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mb: 3 }}
									>
										Get started by creating your first department
									</Typography>
									<Button
										variant="contained"
										startIcon={<AddIcon />}
										onClick={handleCreateClick}
									>
										Add First Department
									</Button>
								</Box>
							)}
						</>
					)}
				</Box>

				{/* Department Form Dialog */}
				<DepartmentFormDialog
					open={dialogOpen}
					onClose={handleDialogClose}
					department={selectedDepartment}
				/>
			</MainContainer>
		</RootLayout>
	);
}

export default withAdmin(AdminDepartmentsPage);
