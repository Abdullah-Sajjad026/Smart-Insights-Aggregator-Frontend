import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";

export const StatCardSkeleton = () => (
	<Paper elevation={2} sx={{ p: 3, height: "100%" }}>
		<Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
		<Skeleton variant="text" width="40%" height={60} sx={{ mb: 1 }} />
		<Skeleton variant="text" width="80%" height={20} />
	</Paper>
);

export const ChartCardSkeleton = () => (
	<Paper elevation={2} sx={{ p: 3, height: "100%" }}>
		<Skeleton variant="text" width="40%" height={32} sx={{ mb: 3 }} />
		<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
			{[1, 2, 3].map((i) => (
				<Box key={i} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<Skeleton variant="circular" width={16} height={16} />
						<Skeleton variant="text" width={60} />
					</Box>
					<Skeleton variant="text" width={30} />
				</Box>
			))}
		</Box>
	</Paper>
);

export const QuickActionsSkeleton = () => (
	<Paper elevation={2} sx={{ p: 3, height: "100%" }}>
		<Skeleton variant="text" width="40%" height={32} sx={{ mb: 3 }} />
		<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
			{[1, 2, 3].map((i) => (
				<Skeleton key={i} variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
			))}
		</Box>
	</Paper>
);
