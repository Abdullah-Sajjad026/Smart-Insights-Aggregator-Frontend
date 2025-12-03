import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader } from "modules/shared/components";
import { InputForm } from "modules/input/components";
import { useSubmitInputMutation, useGetInquiryById } from "modules/input/apis";
import { getApiErrorMessage } from "modules/shared/shared.utils";
import { DateTime } from "luxon";
import { useState } from "react";

import { withStudent } from "modules/user";

function InquiryDetailPage() {
	const router = useRouter();
	const { inquiryId } = router.query;
	const [showSuccess, setShowSuccess] = useState(false);

	// Fetch inquiry details
	const {
		data: inquiry,
		isLoading: isLoadingInquiry,
		isError: isErrorInquiry,
	} = useGetInquiryById(inquiryId);

	// Submit input mutation
	const submitInputMutation = useSubmitInputMutation({
		onSuccess: response => {
			setShowSuccess(true);
			toast.success(
				response.message || "Your response has been submitted successfully!",
			);

			// Hide success message after 5 seconds
			setTimeout(() => {
				setShowSuccess(false);
			}, 5000);
		},
		onError: error => {
			const errorMessage = getApiErrorMessage(
				error,
				"Failed to submit response",
			);
			toast.error(errorMessage);
		},
	});

	const handleSubmit = data => {
		if (inquiry?.id) {
			submitInputMutation.mutate({ ...data, inquiryId: inquiry.id });
		}
	};

	const handleGoBack = () => {
		router.push("/student/inquiries");
	};

	// Check if inquiry is still active
	const isActive = inquiry?.status?.toUpperCase() === "ACTIVE";
	const isPastDeadline = inquiry?.closedAt
		? DateTime.fromISO(inquiry.closedAt) < DateTime.now()
		: false;
	const canSubmit = isActive && !isPastDeadline;

	return (
		<RootLayout>
			<MainContainer>
				<Box sx={{ py: 4 }}>
					{/* Back Button */}
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={handleGoBack}
						sx={{ mb: 3 }}
					>
						Back to Active Inquiries
					</Button>

					{/* Loading State */}
					{isLoadingInquiry && <Loader />}

					{/* Error State */}
					{isErrorInquiry && (
						<Alert severity="error">
							Failed to load inquiry details. The inquiry may not exist or you
							may not have access to it.
						</Alert>
					)}

					{/* Success State */}
					{inquiry && (
						<>
							{/* Page Header */}
							<Box sx={{ mb: 4 }}>
								<Typography variant="h4" gutterBottom fontWeight={600}>
									{inquiry.title}
								</Typography>
								<Typography variant="body1" fontWeight={600}>
									Description:{" "}
									{inquiry.body || "No details provided for this inquiry."}
								</Typography>
							</Box>

							{/* Inactive/Expired Warning */}
							{!canSubmit && (
								<Alert severity="warning" sx={{ mb: 3 }}>
									{isPastDeadline
										? "This inquiry has expired and is no longer accepting responses."
										: "This inquiry is currently not active."}
								</Alert>
							)}

							{/* Success Message */}
							{showSuccess && (
								<Alert
									severity="success"
									icon={<CheckCircleIcon />}
									sx={{ mb: 3 }}
									onClose={() => setShowSuccess(false)}
								>
									<Typography variant="body2" fontWeight={600}>
										Thank you for your response!
									</Typography>
									<Typography variant="body2">
										Your feedback has been received and will be processed. You
										can view it in{" "}
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
							{canSubmit && (
								<Paper
									elevation={2}
									sx={{
										p: { xs: 3, md: 4 },
										maxWidth: 800,
										mx: "auto",
									}}
								>
									<InputForm
										inquiryId={inquiry.id}
										inquiryDetails={{
											title: "Respond to the Inquiry",
											description: "",
										}}
										onSubmit={handleSubmit}
										isLoading={submitInputMutation.isLoading}
										error={
											submitInputMutation.isError
												? getApiErrorMessage(
														submitInputMutation.error,
														"Failed to submit response",
												  )
												: null
										}
									/>
								</Paper>
							)}
						</>
					)}
				</Box>
			</MainContainer>
		</RootLayout>
	);
}

export default withStudent(InquiryDetailPage);
