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
import { useImportUsersMutation } from "../../apis";
import { toast } from "react-toastify";

export const ImportUsersDialog = ({ open, onClose }) => {
	const [file, setFile] = useState(null);
	const importUsersMutation = useImportUsersMutation();

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];
		if (selectedFile && selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
			toast.error("Please select a valid CSV file");
			return;
		}
		setFile(selectedFile);
	};

	const handleUpload = () => {
		if (!file) return;

		importUsersMutation.mutate(file, {
			onSuccess: (data) => {
				const count = Array.isArray(data) ? data.length : 0;
				toast.success(`${count} users imported successfully`);
				handleClose();
			},
			onError: (error) => {
				toast.error(error.response?.data?.message || "Failed to import users");
			},
		});
	};

	const handleClose = () => {
		setFile(null);
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>Import Users from CSV</DialogTitle>
			<DialogContent>
				<Box sx={{ mb: 3 }}>
					<Typography variant="body2" color="text.secondary" paragraph>
						Upload a CSV file to bulk import users. The CSV should have the following columns in order:
					</Typography>
					<Alert severity="info" sx={{ mb: 2 }}>
						Email, FirstName, LastName, Password, Role, Department, Program, Semester
					</Alert>
					<Typography variant="caption" display="block" gutterBottom>
						* Role must be "Student" or "Admin"
						<br />
						* Department, Program, and Semester are required for Students (use exact names/values)
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
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<LoadingButton
					variant="contained"
					onClick={handleUpload}
					loading={importUsersMutation.isPending}
					disabled={!file}
				>
					Import
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};
