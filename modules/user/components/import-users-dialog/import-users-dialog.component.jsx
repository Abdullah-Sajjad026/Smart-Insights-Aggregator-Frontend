import React, { useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Box,
	Alert,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import { LoadingButton } from "modules/shared";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { useImportUsersInviteMutation } from "../../apis";
import { toast } from "react-toastify";

export const ImportUsersDialog = ({ open, onClose }) => {
	const [file, setFile] = useState(null);
	const [importResult, setImportResult] = useState(null);
	const importUsersMutation = useImportUsersInviteMutation();

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
		if (selectedFile && selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
			toast.error("Please select a valid CSV file");
			return;
		}
		setFile(selectedFile);
		setImportResult(null);
	};

	const handleUpload = () => {
		if (!file) return;

		importUsersMutation.mutate(file, {
			onSuccess: (data) => {
				setImportResult(data);
				if (data.failureCount === 0) {
					toast.success(`${data.successCount} invitation emails sent successfully`);
					setTimeout(() => {
						handleClose();
					}, 2000);
				} else {
					toast.warning(`Import completed with ${data.failureCount} errors`);
				}
			},
			onError: (error) => {
				toast.error(error.response?.data?.message || "Failed to import and invite users");
			},
		});
	};

	const handleClose = () => {
		setFile(null);
		setImportResult(null);
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
			<DialogTitle>Import & Invite Users from CSV</DialogTitle>
			<DialogContent>
				{!importResult ? (
					<>
						<Box sx={{ mb: 3 }}>
							<Typography variant="body2" color="text.secondary" paragraph>
								Upload a CSV file to bulk import and invite users. The CSV should have the following columns in order:
							</Typography>
							<Alert severity="info" sx={{ mb: 2 }}>
								Email, FirstName, LastName, Department, Program, Semester
							</Alert>
							<Typography variant="caption" display="block" gutterBottom>
								* All imported users will be assigned the "Student" role
								<br />
								* Department, Program, and Semester are required (use exact names/values)
								<br />
								* Invitation emails will be sent to all users automatically
								<br />
								* Users will set their own passwords when accepting invitations
							</Typography>
						</Box>

						<Box
							sx={{
								border: "2px dashed",
								borderColor: "divider",
								borderRadius: 1,
								p: 3,
								textAlign: "center",
								cursor: "pointer",
								"&:hover": { bgcolor: "action.hover" },
								display: 'flex',
								alignItems: 'center',
								gap: 4,
							}}
							component="label"
						>
							<input
								type="file"
								hidden
								accept=".csv"
								onChange={handleFileChange}
							/>
							<CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
							<Typography variant="body1" color="text.primary">
								{file ? file.name : "Click to select CSV file"}
							</Typography>
						</Box>
					</>
				) : (
					<Box>
						<Alert severity={importResult.failureCount > 0 ? "warning" : "success"} sx={{ mb: 2 }}>
							Import Completed: {importResult.successCount} successful, {importResult.failureCount} failed.
						</Alert>

						{importResult.results && importResult.results.length > 0 && (
							<Box sx={{ mt: 2, maxHeight: 300, overflow: "auto", border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
								<List dense disablePadding>
									{importResult.results.map((result, index) => (
										<ListItem key={index} divider>
											<ListItemText
												primary={
													<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
														{result.status === "Success" ? (
															<CheckCircleIcon color="success" fontSize="small" />
														) : (
															<ErrorIcon color="error" fontSize="small" />
														)}
														<Typography variant="body2" fontWeight={500}>
															{result.email}
														</Typography>
													</Box>
												}
												secondary={
													result.status === "Failure" ? (
														<Typography variant="caption" color="error">
															Row {result.rowNumber}: {result.errorMessage}
														</Typography>
													) : (
														<Typography variant="caption" color="text.secondary">
															Row {result.rowNumber}: Invitation sent successfully
														</Typography>
													)
												}
											/>
										</ListItem>
									))}
								</List>
							</Box>
						)}
					</Box>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Close</Button>
				{!importResult && (
					<LoadingButton
						variant="contained"
						onClick={handleUpload}
						loading={importUsersMutation.isPending}
						disabled={!file}
					>
						Import & Send Invitations
					</LoadingButton>
				)}
			</DialogActions>
		</Dialog>
	);
};
