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
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Pagination from "@mui/material/Pagination";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
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
	useGetAllUsers,
	useCreateUserMutation,
	useUpdateUserMutation,
	useDeleteUserMutation,
	getAllUsersQueryKey,
} from "modules/user";
import { withAdmin } from "modules/user";
import { getApiErrorMessage } from "modules/shared/shared.utils";
import { Role } from "types/api";
import { ROLE_LABELS, roleOptions } from "constants/enums";

// Validation schema for user form
const userSchema = z.object({
	fullName: z.string().min(2, "Full name must be at least 2 characters"),
	email: z.string().email("Invalid email address"),
	role: z.nativeEnum(Role),
	password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
});

function UserFormDialog({ open, onClose, user = null, isLoading }) {
	const isEdit = !!user;
	const queryClient = useQueryClient();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(userSchema),
		defaultValues: {
			fullName: user?.fullName || "",
			email: user?.email || "",
			role: user?.role || Role.Student,
			password: "",
		},
	});

	const createMutation = useCreateUserMutation({
		onSuccess: (response) => {
			toast.success(response.message || "User created successfully!");
			queryClient.invalidateQueries(getAllUsersQueryKey());
			reset();
			onClose();
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to create user"));
		},
	});

	const updateMutation = useUpdateUserMutation({
		onSuccess: (response) => {
			toast.success(response.message || "User updated successfully!");
			queryClient.invalidateQueries(getAllUsersQueryKey());
			reset();
			onClose();
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to update user"));
		},
	});

	const onSubmit = (data) => {
		if (isEdit) {
			// Remove password if empty (don't update password)
			const updateData = { ...data };
			if (!updateData.password) {
				delete updateData.password;
			}
			updateMutation.mutate({ id: user.id, data: updateData });
		} else {
			createMutation.mutate(data);
		}
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>{isEdit ? "Edit User" : "Create New User"}</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
						<Controller
							name="fullName"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Full Name"
									fullWidth
									error={!!errors.fullName}
									helperText={errors.fullName?.message}
								/>
							)}
						/>

						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Email"
									type="email"
									fullWidth
									error={!!errors.email}
									helperText={errors.email?.message}
									disabled={isEdit} // Can't change email when editing
								/>
							)}
						/>

						<Controller
							name="role"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									select
									label="Role"
									fullWidth
									error={!!errors.role}
									helperText={errors.role?.message}
								>
									{roleOptions.map((option) => (
										<MenuItem key={option.value} value={option.value}>
											{option.label}
										</MenuItem>
									))}
								</TextField>
							)}
						/>

						<Controller
							name="password"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label={isEdit ? "New Password (leave blank to keep current)" : "Password"}
									type="password"
									fullWidth
									error={!!errors.password}
									helperText={errors.password?.message}
									required={!isEdit}
								/>
							)}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} disabled={isLoading}>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="contained"
						disabled={isLoading || createMutation.isLoading || updateMutation.isLoading}
					>
						{isEdit ? "Update" : "Create"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

function AdminUsersPage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [roleFilter, setRoleFilter] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);

	// Fetch users
	const { data, isLoading, isError } = useGetAllUsers({
		role: roleFilter,
		page,
		pageSize,
	});

	// Delete user mutation
	const deleteMutation = useDeleteUserMutation({
		onSuccess: (response) => {
			toast.success(response.message || "User deleted successfully!");
			queryClient.invalidateQueries(getAllUsersQueryKey());
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Failed to delete user"));
		},
	});

	const handleTabChange = (event, newValue) => {
		setRoleFilter(newValue);
		setPage(1);
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleCreateClick = () => {
		setSelectedUser(null);
		setDialogOpen(true);
	};

	const handleEditClick = (user) => {
		setSelectedUser(user);
		setDialogOpen(true);
	};

	const handleDeleteClick = (user) => {
		if (confirm(`Are you sure you want to delete user "${user.fullName}"?`)) {
			deleteMutation.mutate(user.id);
		}
	};

	const handleDialogClose = () => {
		setSelectedUser(null);
		setDialogOpen(false);
	};

	const getRoleColor = (role) => {
		return role === Role.Admin ? "error" : "primary";
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
								User Management
							</Typography>
							<Typography variant="body1" color="text.secondary">
								Manage system users and their access levels
							</Typography>
						</Box>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={handleCreateClick}
						>
							Add User
						</Button>
					</Box>

					{/* Role Filter Tabs */}
					<Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
						<Tabs value={roleFilter} onChange={handleTabChange}>
							<Tab label="All Users" value="" />
							<Tab label="Admins" value={Role.Admin} />
							<Tab label="Students" value={Role.Student} />
						</Tabs>
					</Box>

					{/* Loading State */}
					{isLoading && <Loader height="auto" />}

					{/* Error State */}
					{isError && (
						<Alert severity="error">
							Failed to load users. Please try again later.
						</Alert>
					)}

					{/* Users Table */}
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
										Total Users
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
													<TableCell>Name</TableCell>
													<TableCell>Email</TableCell>
													<TableCell>Role</TableCell>
													<TableCell>Created</TableCell>
													<TableCell align="right">Actions</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{data.data.map((user) => (
													<TableRow key={user.id} hover>
														<TableCell>
															<Typography variant="body2" fontWeight={600}>
																{user.fullName}
															</Typography>
														</TableCell>
														<TableCell>
															<Typography variant="body2" color="text.secondary">
																{user.email}
															</Typography>
														</TableCell>
														<TableCell>
															<Chip
																label={ROLE_LABELS[user.role] || user.role}
																size="small"
																color={getRoleColor(user.role)}
															/>
														</TableCell>
														<TableCell>
															<Typography variant="caption" color="text.secondary">
																{user.createdAt
																	? DateTime.fromISO(user.createdAt).toFormat("MMM dd, yyyy")
																	: "N/A"}
															</Typography>
														</TableCell>
														<TableCell align="right">
															<IconButton
																size="small"
																color="primary"
																onClick={() => handleEditClick(user)}
															>
																<EditIcon fontSize="small" />
															</IconButton>
															<IconButton
																size="small"
																color="error"
																onClick={() => handleDeleteClick(user)}
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
										No users found
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mb: 3 }}
									>
										{roleFilter
											? `No ${ROLE_LABELS[roleFilter]?.toLowerCase()} users found`
											: "Get started by creating your first user"}
									</Typography>
									<Button
										variant="contained"
										startIcon={<AddIcon />}
										onClick={handleCreateClick}
									>
										Add First User
									</Button>
								</Box>
							)}
						</>
					)}
				</Box>

				{/* User Form Dialog */}
				<UserFormDialog
					open={dialogOpen}
					onClose={handleDialogClose}
					user={selectedUser}
				/>
			</MainContainer>
		</RootLayout>
	);
}

export default withAdmin(AdminUsersPage);
