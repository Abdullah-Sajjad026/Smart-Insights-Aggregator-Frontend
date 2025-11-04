import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function LogoIcon(props) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 0.5,
				...props.sx,
			}}
			{...props}
		>
			<Typography
				variant="h5"
				sx={{
					fontWeight: 700,
					background: "linear-gradient(135deg, #43a047 0%, #66bb6a 100%)",
					backgroundClip: "text",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",
					letterSpacing: "-0.5px",
				}}
			>
				Smart Insights
			</Typography>
			<Typography
				variant="caption"
				sx={{
					fontWeight: 600,
					color: "text.secondary",
					letterSpacing: "1px",
					textTransform: "uppercase",
					fontSize: "0.65rem",
				}}
			>
				Aggregator
			</Typography>
		</Box>
	);
}
