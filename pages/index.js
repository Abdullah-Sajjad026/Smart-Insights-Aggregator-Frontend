import { useEffect } from "react";
import { useRouter } from "next/router";
import { Typography } from "@mui/material";
import { MainContainer, RootLayout, Loader } from "modules/shared";
import { useUser, userTypeAdmin, userTypeStudent } from "modules/user";

function PageContent() {
	const router = useRouter();
	const { user, isLoading } = useUser();

	// Redirect to role-specific dashboard
	useEffect(() => {
		if (!isLoading && user) {
			if (user.role === userTypeAdmin) {
				router.push("/admin/dashboard");
			} else if (user.role === userTypeStudent) {
				router.push("/student/home");
			}
		}
	}, [user, isLoading, router]);

	// Show loader while checking auth or redirecting
	if (isLoading || user) {
		return <Loader />;
	}

	// If no user, show landing page
	return (
		<>
			<Typography variant="h1">Smart Insights Aggregator</Typography>
			<Typography variant="h2">University Feedback Management System</Typography>
			<Typography variant="h3">
				Please sign in to access your dashboard
			</Typography>
		</>
	);
}

function Page() {
	return (
		<RootLayout>
			<MainContainer>
				<PageContent />
			</MainContainer>
		</RootLayout>
	);
}

export default Page;
