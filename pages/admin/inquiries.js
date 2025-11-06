import { useState } from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Pagination from "@mui/material/Pagination";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import {
	MainContainer,
	Loader,
	DeleteIconButton,
} from "modules/shared/components";
import { InquiryCard } from "modules/input/components";
import { CreateInquiryDialog } from "modules/inquiry/components";
import {
	useGetInquiries,
	useCreateInquiryMutation,
	useDeleteInquiryMutation,
	getInquiriesQueryKey,
} from "modules/inquiry";
import { getApiErrorMessage } from "modules/shared/shared.utils";
import { InquiryStatus } from "types/api";
import { withAdmin } from "modules/user";

function AdminInquiriesPage() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [statusFilter, setStatusFilter] = useState("");
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [page, setPage] = useState(1);
	const [pageSize] = useState(10);

	// Fetch inquiries
	const { data, isLoading, isError } = useGetInquiries({
		status: statusFilter,
		page,
		pageSize,
	});

	// Create inquiry mutation
	const createMutation = useCreateInquiryMutation({
		onSuccess: response => {
			toast.success(response.message || "Inquiry created successfully!");
			setCreateDialogOpen(false);
			// Invalidate queries to refetch
			queryClient.invalidateQueries(getInquiriesQueryKey());
		},
		onError: error => {
			toast.error(getApiErrorMessage(error, "Failed to create inquiry"));
		},
	});

	// Delete inquiry mutation
	const deleteMutation = useDeleteInquiryMutation({
		onSuccess: response => {
			toast.success(response.message || "Inquiry deleted successfully!");
			queryClient.invalidateQueries(getInquiriesQueryKey());
		},
		onError: error => {
			toast.error(getApiErrorMessage(error, "Failed to delete inquiry"));
		},
	});

	const handleTabChange = (event, newValue) => {
		setStatusFilter(newValue);
		setPage(1); // Reset to first page when filter changes
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleCreate = data => {
		createMutation.mutate(data);
	};

	const handleDelete = inquiryId => {
		if (confirm("Are you sure you want to delete this inquiry?")) {
			deleteMutation.mutate(inquiryId);
		}
	};

	const handleViewDetails = inquiry => {
		router.push(`/admin/inquiries/${inquiry.id}`);
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
								Manage Inquiries
							</Typography>
							<Typography variant="body1" color="text.secondary">
								Create and manage inquiries to gather targeted student feedback
							</Typography>
						</Box>
						<Button
							variant="contained"
							startIcon={<AddIcon />}
							onClick={() => setCreateDialogOpen(true)}
						>
							Create Inquiry
						</Button>
					</Box>

					{/* Status Tabs */}
					<Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
						<Tabs value={statusFilter} onChange={handleTabChange}>
							<Tab label="All" value="" />
							<Tab label="Sent" value={InquiryStatus.Sent} />
							<Tab label="Draft" value={InquiryStatus.Draft} />
							<Tab label="Closed" value={InquiryStatus.Closed} />
						</Tabs>
					</Box>

					{/* Loading State */}
					{isLoading && <Loader height="auto" />}

					{/* Error State */}
					{isError && (
						<Alert severity="error">
							Failed to load inquiries. Please try again later.
						</Alert>
					)}

					{/* Success State */}
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
										Total Inquiries
									</Typography>
									<Typography variant="h6" fontWeight={600}>
										{data.pagination?.totalItems || 0}
									</Typography>
								</Box>
								<Box>
									<Typography variant="caption" color="text.secondary">
										Total Responses
									</Typography>
									<Typography
										variant="h6"
										fontWeight={600}
										color="success.main"
									>
										{data.data?.reduce(
											(sum, inq) => sum + (inq.totalInputs || 0),
											0,
										)}
									</Typography>
								</Box>
							</Box>

							{/* Inquiries List */}
							{data.data && data.data.length > 0 ? (
								<Box>
									{data.data.map(inquiry => (
										<Box key={inquiry.id} sx={{ position: "relative" }}>
											<InquiryCard
												inquiry={inquiry}
												showStatus={!statusFilter}
												onClick={handleViewDetails}
											/>
											{/* Delete Button */}
											<Box
												sx={{
													position: "absolute",
													top: 16,
													right: 16,
													zIndex: 1,
												}}
											>
												<DeleteIconButton
													onClick={e => {
														e.stopPropagation();
														handleDelete(inquiry.id);
													}}
													loading={deleteMutation.isLoading}
												/>
											</Box>
										</Box>
									))}
								</Box>
							) : (
								<Box
									sx={{
										textAlign: "center",
										py: 8,
										px: 2,
									}}
								>
									<Typography variant="h6" color="text.secondary" gutterBottom>
										No inquiries found
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mb: 3 }}
									>
										{statusFilter
											? `No ${statusFilter.toLowerCase()} inquiries at the moment`
											: "Get started by creating your first inquiry"}
									</Typography>
									<Button
										variant="contained"
										startIcon={<AddIcon />}
										onClick={() => setCreateDialogOpen(true)}
									>
										Create Your First Inquiry
									</Button>
								</Box>
							)}

							{/* Pagination */}
							{data?.pagination && data.pagination.totalPages > 1 && (
								<Box
									sx={{
										mt: 4,
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
					)}
				</Box>

				{/* Create Dialog */}
				<CreateInquiryDialog
					open={createDialogOpen}
					onClose={() => setCreateDialogOpen(false)}
					onSubmit={handleCreate}
					isLoading={createMutation.isLoading}
				/>
			</MainContainer>
		</RootLayout>
	);
}

export default withAdmin(AdminInquiriesPage);
