import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { LoadingButton } from "modules/shared/components";
import { INPUT_MIN_LENGTH, INPUT_MAX_LENGTH } from "../../input.config";

/**
 * Validation schema for input form
 */
const inputSchema = z.object({
	body: z
		.string()
		.min(INPUT_MIN_LENGTH, `Minimum ${INPUT_MIN_LENGTH} characters required`)
		.max(INPUT_MAX_LENGTH, `Maximum ${INPUT_MAX_LENGTH} characters allowed`),
});

/**
 * Input submission form component
 * @param {Object} props
 * @param {string} [props.inquiryId] - Optional inquiry ID to link input to
 * @param {Object} [props.inquiryDetails] - Optional inquiry details to display
 * @param {Function} props.onSubmit - Submit handler function
 * @param {boolean} [props.isLoading] - Loading state
 * @param {string} [props.error] - Error message to display
 */
export function InputForm({
	inquiryId,
	inquiryDetails,
	onSubmit,
	isLoading = false,
	error,
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		reset,
	} = useForm({
		resolver: zodResolver(inputSchema),
		defaultValues: {
			body: "",
		},
	});

	const bodyValue = watch("body");
	const characterCount = bodyValue?.length || 0;

	const handleFormSubmit = data => {
		onSubmit({ ...data, inquiryId });
	};

	const handleSuccess = () => {
		reset();
	};

	React.useEffect(() => {
		if (!isLoading && !error) {
			// Form was successfully submitted
			handleSuccess();
		}
	}, [isLoading, error]);

	return (
		<Box
			component="form"
			onSubmit={handleSubmit(handleFormSubmit)}
			sx={{ width: "100%" }}
		>
			{/* Inquiry Details (if linked) */}
			{inquiryDetails && (
				<Box sx={{ mb: 3 }}>
					<Typography variant="body1" gutterBottom>
						{inquiryDetails.title}:
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{inquiryDetails.description}
					</Typography>
				</Box>
			)}

			{/* Error Alert */}
			{error && (
				<Alert severity="error" sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			{/* Input Field */}
			<TextField
				{...register("body")}
				label={inquiryId ? "Your Feedback" : "Share Your Feedback"}
				placeholder={
					inquiryId
						? "Share your detailed thoughts and experiences..."
						: "Tell us about any aspect of your university experience..."
				}
				multiline
				rows={8}
				fullWidth
				error={!!errors.body}
				helperText={errors.body?.message}
				sx={{ mb: 1, fontSize: "1.1rem" }}
			/>

			{/* Character Count */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 3,
				}}
			>
				<Typography
					variant="caption"
					color={
						characterCount < INPUT_MIN_LENGTH
							? "error"
							: characterCount > INPUT_MAX_LENGTH
							? "error"
							: "text.secondary"
					}
				>
					{characterCount} / {INPUT_MAX_LENGTH} characters
					{characterCount < INPUT_MIN_LENGTH &&
						` (${INPUT_MIN_LENGTH - characterCount} more required)`}
				</Typography>
			</Box>

			{/* Submit Button */}
			<LoadingButton
				type="submit"
				variant="contained"
				size="large"
				loading={isLoading}
				disabled={isLoading}
				fullWidth
			>
				Submit Feedback
			</LoadingButton>

			{/* Anonymous Notice */}
			<Alert severity="info" sx={{ mt: 2 }}>
				Your feedback is anonymous. Your identity will not be shared with
				anyone.
			</Alert>
		</Box>
	);
}

export default InputForm;
