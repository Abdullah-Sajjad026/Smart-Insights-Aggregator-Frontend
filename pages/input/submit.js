import React from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { toast } from "react-toastify";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer } from "modules/shared/components";
import { InputForm } from "modules/input/components";
import { useSubmitInputMutation } from "modules/input/apis";
import { getApiErrorMessage } from "modules/shared/shared.utils";
import { withStudent } from "modules/user";

function SubmitInputPage() {
	const router = useRouter();
	const [showSuccess, setShowSuccess] = React.useState(false);

	const submitInputMutation = useSubmitInputMutation({
		onSuccess: response => {
			setShowSuccess(true);
			toast.success(response.message || "Feedback submitted successfully!");

			// Hide success message after 5 seconds
			setTimeout(() => {
				setShowSuccess(false);
			}, 5000);
		},
		onError: error => {
			const errorMessage = getApiErrorMessage(
				error,
				"Failed to submit feedback",
			);
			toast.error(errorMessage);
		},
	});

	const handleSubmit = data => {
		submitInputMutation.mutate(data);
	};

	return (
		<RootLayout>
			<MainContainer>
				<Box sx={{ py: 4 }}>
					{/* Page Header */}
					<Box sx={{ mb: 4 }}>
						<Typography variant="h4" gutterBottom fontWeight={600}>
							Submit Feedback
						</Typography>
						<Typography variant="body1" color="text.secondary">
							Share your thoughts, concerns, or suggestions about any aspect of
							your university experience.
						</Typography>
					</Box>

					{/* Success Message */}
					{showSuccess && (
						<Alert
							severity="success"
							icon={<CheckCircleIcon />}
							sx={{ mb: 3 }}
							onClose={() => setShowSuccess(false)}
						>
							<Typography variant="body2" fontWeight={600}>
								Thank you for your feedback!
							</Typography>
							<Typography variant="body2">
								Your input has been received and will be processed by our AI
								system. You can view your submissions in{" "}
								<Box
									component="span"
									sx={{
										textDecoration: "underline",
										cursor: "pointer",
										color: "primary.main",
									}}
									onClick={() => router.push("/input/my-inputs")}
								>
									My Submissions
								</Box>
								.
							</Typography>
						</Alert>
					)}

					{/* Form Container */}
					<Paper
						elevation={2}
						sx={{
							p: { xs: 3, md: 4 },
							maxWidth: 800,
							mx: "auto",
						}}
					>
						<InputForm
							onSubmit={handleSubmit}
							isLoading={submitInputMutation.isLoading}
							error={
								submitInputMutation.isError
									? getApiErrorMessage(
											submitInputMutation.error,
											"Failed to submit feedback",
										)
									: null
							}
						/>
					</Paper>

					{/* Info Box */}
					<Box
						sx={{
							mt: 4,
							maxWidth: 800,
							mx: "auto",
							p: 3,
							bgcolor: "grey.50",
							borderRadius: 1,
						}}
					>
						<Typography variant="subtitle2" gutterBottom fontWeight={600}>
							How Your Feedback is Used:
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
							• AI-powered analysis categorizes your feedback by theme and
							importance
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
							• University administration reviews insights to improve services
						</Typography>
						<Typography variant="body2" color="text.secondary">
							• Your identity remains completely anonymous throughout the process
						</Typography>
					</Box>
				</Box>
			</MainContainer>
		</RootLayout>
	);
}

export default withStudent(SubmitInputPage);
