import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { RootLayout } from "modules/shared/layouts/root/root.layout";
import { MainContainer, Loader } from "modules/shared/components";
import { InquiryCard } from "modules/input/components";
import { useGetActiveInquiries } from "modules/input/apis";

export default function ActiveInquiriesPage() {
	const router = useRouter();
	const { data: inquiries, isLoading, isError } = useGetActiveInquiries();

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
					{isLoading && <Loader />}

					{/* Error State */}
					{isError && (
						<Alert severity="error">
							Failed to load active inquiries. Please try again later.
						</Alert>
					)}

					{/* Success State */}
					{inquiries && (
						<>
							{inquiries.length > 0 ? (
								<Box>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{ mb: 3 }}
									>
										{inquiries.length} active{" "}
										{inquiries.length === 1 ? "inquiry" : "inquiries"} available
									</Typography>

									{inquiries.map(inquiry => (
										<InquiryCard
											key={inquiry.id}
											inquiry={inquiry}
											onRespond={handleRespond}
											showStatus={true}
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
