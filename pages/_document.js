import {
	documentGetInitialProps,
	DocumentHeadTags,
} from "@mui/material-nextjs/v13-pagesRouter";
import { Head, Html, Main, NextScript } from "next/document";

export default function MyDocument(props) {
	return (
		<Html lang="en">
			<Head>
				<DocumentHeadTags />
				{/* Import Inter font from Google Fonts */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link
					href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
					rel="stylesheet"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

MyDocument.getInitialProps = async ctx => {
	const finalProps = await documentGetInitialProps(ctx);
	return finalProps;
};
