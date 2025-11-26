import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader } from "modules/shared/components";
import { InquiryCard } from "modules/input/components";
import { useGetStudentInquiries } from "modules/inquiry";

import { withStudent } from "modules/user";

function StudentInquiriesPage() {
	const router = useRouter();

	// Fetch active inquiries for the student
	const { data, isLoading, isError } = useGetStudentInquiries();
	const activeInquiries = data || [];

	const handleRespond = inquiry => {
		router.push(`/input/inquiries/${inquiry.id}`);
	};

	return (
		<RootLayout>
			<MainContainer>
				<Box sx={{ py: 4 }}>
					{/* Page Header */}
					<Box sx={{ mb: 4 }}>
						<Typography variant="h4" gutterBottom fontWeight={600}>
							Active Inquiries
						</Typography>
						<Typography variant="body1" color="text.secondary">
							Browse and respond to inquiries from university administration
						</Typography>
					</Box>

					{/* Loading State */}
					{isLoading && <Loader height="auto" />}

					{/* Error State */}
					{isError && (
						<Alert severity="error" sx={{ mb: 3 }}>
							Failed to load inquiries. Please try again later.
						</Alert>
					)}

					{/* Inquiries List */}
					{data && (
						<>
							{activeInquiries.length > 0 ? (
								<Box>
									<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
										{activeInquiries.length} active{" "}
										{activeInquiries.length === 1 ? "inquiry" : "inquiries"} available
									</Typography>

									{activeInquiries.map(inquiry => (
										<InquiryCard
											key={inquiry.id}
											inquiry={inquiry}
											onRespond={handleRespond}
											showStatus={false}
										/>
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
										No active inquiries at the moment
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Check back later or submit general feedback instead
									</Typography>
								</Box>
							)}
						</>
					)}
				</Box>
			</MainContainer>
		</RootLayout>
	);
}

export default withStudent(StudentInquiriesPage);
