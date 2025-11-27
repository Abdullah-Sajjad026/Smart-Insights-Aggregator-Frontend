import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import { LoadingButton } from "modules/shared/components";
import {
	inquiryStatusOptions,
	INQUIRY_STATUS_DRAFT,
} from "../../inquiry.config";

/**
 * Validation schema for inquiry form
 */
const inquirySchema = z.object({
	title: z.string().min(5, "Title must be at least 5 characters"),
	description: z.string().min(20, "Description must be at least 20 characters"),
	status: z.string(),
	targetFaculties: z.array(z.any()),
	targetDepartments: z.array(z.any()), // Allow objects
	targetPrograms: z.array(z.any()),
	targetSemesters: z.array(z.any()),
	startDate: z.string().min(1, "Start date is required"),
	endDate: z.string().min(1, "End date is required"),
});

/**
 * Dialog for creating a new inquiry
 * @param {Object} props
 * @param {boolean} props.open - Whether dialog is open
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onSubmit - Submit handler
 * @param {boolean} [props.isLoading] - Loading state
 * @param {Array} [props.faculties] - List of faculties
 * @param {Array} [props.departments] - List of departments
 * @param {Array} [props.programs] - List of programs
 * @param {Array} [props.semesters] - List of semesters
 */
export function CreateInquiryDialog({
	open,
	onClose,
	onSubmit,
	isLoading,
	faculties = [],
	departments = [],
	programs = [],
	semesters = [],
}) {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm({
		resolver: zodResolver(inquirySchema),
		defaultValues: {
			title: "",
			description: "",
			status: INQUIRY_STATUS_DRAFT,
			targetFaculties: [],
			targetDepartments: [],
			targetPrograms: [],
			targetSemesters: [],
			startDate: "",
			endDate: "",
		},
	});

	const handleClose = () => {
		if (!isLoading) {
			reset();
			onClose();
		}
	};

	const handleFormSubmit = data => {
		onSubmit(data);
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth="md"
			fullWidth
			PaperProps={{
				sx: { minHeight: "80vh" },
			}}
		>
			<DialogTitle>Create New Inquiry</DialogTitle>
			<DialogContent>
				<Box
					component="form"
					id="create-inquiry-form"
					onSubmit={handleSubmit(handleFormSubmit)}
					sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}
				>
					{/* Title */}
					<TextField
						{...register("title")}
						label="Inquiry Title"
						placeholder="e.g., Lab Equipment Feedback - Fall 2024"
						fullWidth
						error={!!errors.title}
						helperText={errors.title?.message}
					/>

					{/* Description */}
					<TextField
						{...register("description")}
						label="Description"
						placeholder="Provide clear instructions for students..."
						multiline
						rows={4}
						fullWidth
						error={!!errors.description}
						helperText={errors.description?.message}
					/>

					{/* Status */}
					<TextField
						{...register("status")}
						select
						label="Status"
						fullWidth
						error={!!errors.status}
						helperText={errors.status?.message}
					>
						{inquiryStatusOptions.map(option => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</TextField>

					{/* Date Range */}
					<Box sx={{ display: "flex", gap: 2 }}>
						<TextField
							{...register("startDate")}
							label="Start Date"
							type="date"
							fullWidth
							InputLabelProps={{ shrink: true }}
							error={!!errors.startDate}
							helperText={errors.startDate?.message}
						/>
						<TextField
							{...register("endDate")}
							label="End Date"
							type="date"
							fullWidth
							InputLabelProps={{ shrink: true }}
							error={!!errors.endDate}
							helperText={errors.endDate?.message}
						/>
					</Box>

					{/* Target Faculties */}
					<Controller
						name="targetFaculties"
						control={control}
						render={({ field }) => (
							<Autocomplete
								{...field}
								multiple
								options={faculties}
								getOptionLabel={option => option.name}
								isOptionEqualToValue={(option, value) => option.id === value.id}
								onChange={(_, value) => field.onChange(value)}
								renderInput={params => (
									<TextField
										{...params}
										label="Target Faculties (Optional)"
										placeholder="Select faculties"
										error={!!errors.targetFaculties}
										helperText={
											errors.targetFaculties?.message ||
											"Leave empty to target all faculties"
										}
									/>
								)}
								renderTags={(value, getTagProps) =>
									value.map((option, index) => (
										<Chip
											label={option.name}
											{...getTagProps({ index })}
											key={option.id}
										/>
									))
								}
							/>
						)}
					/>

					{/* Target Departments */}
					<Controller
						name="targetDepartments"
						control={control}
						render={({ field }) => (
							<Autocomplete
								{...field}
								multiple
								options={departments}
								getOptionLabel={option => option.name}
								isOptionEqualToValue={(option, value) => option.id === value.id}
								onChange={(_, value) => field.onChange(value)}
								renderInput={params => (
									<TextField
										{...params}
										label="Target Departments (Optional)"
										placeholder="Select departments"
										error={!!errors.targetDepartments}
										helperText={
											errors.targetDepartments?.message ||
											"Leave empty to target all departments"
										}
									/>
								)}
								renderTags={(value, getTagProps) =>
									value.map((option, index) => (
										<Chip
											label={option.name}
											{...getTagProps({ index })}
											key={option.id}
										/>
									))
								}
							/>
						)}
					/>

					{/* Target Programs */}
					<Controller
						name="targetPrograms"
						control={control}
						render={({ field }) => (
							<Autocomplete
								{...field}
								multiple
								options={programs}
								getOptionLabel={option => option.name}
								isOptionEqualToValue={(option, value) => option.id === value.id}
								onChange={(_, value) => field.onChange(value)}
								renderInput={params => (
									<TextField
										{...params}
										label="Target Programs (Optional)"
										placeholder="Select programs"
										error={!!errors.targetPrograms}
										helperText={
											errors.targetPrograms?.message ||
											"Leave empty to target all programs"
										}
									/>
								)}
								renderTags={(value, getTagProps) =>
									value.map((option, index) => (
										<Chip
											label={option.name}
											{...getTagProps({ index })}
											key={option.id}
										/>
									))
								}
							/>
						)}
					/>

					{/* Target Semesters */}
					<Controller
						name="targetSemesters"
						control={control}
						render={({ field }) => (
							<Autocomplete
								{...field}
								multiple
								options={semesters}
								getOptionLabel={option => option.value}
								isOptionEqualToValue={(option, value) => option.id === value.id}
								onChange={(_, value) => field.onChange(value)}
								renderInput={params => (
									<TextField
										{...params}
										label="Target Semesters (Optional)"
										placeholder="Select semesters"
										error={!!errors.targetSemesters}
										helperText={
											errors.targetSemesters?.message ||
											"Leave empty to target all semesters"
										}
									/>
								)}
								renderTags={(value, getTagProps) =>
									value.map((option, index) => (
										<Chip
											label={`Semester ${option.value}`}
											{...getTagProps({ index })}
											key={option.id}
										/>
									))
								}
							/>
						)}
					/>
				</Box>
			</DialogContent>
			<DialogActions sx={{ px: 3, pb: 3 }}>
				<Button onClick={handleClose} disabled={isLoading}>
					Cancel
				</Button>
				<LoadingButton
					type="submit"
					form="create-inquiry-form"
					variant="contained"
					loading={isLoading}
				>
					Create Inquiry
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
}

export default CreateInquiryDialog;
