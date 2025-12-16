import type { Metadata } from "next";
import { Geist, Geist_Mono, Kosugi_Maru } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const kosugiMaru = Kosugi_Maru({
	variable: "--font-kosugi-maru",
	weight: "400",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Mariage",
	description: "",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${geistSans.variable} ${geistMono.variable} ${kosugiMaru.variable}`}
		>
			<body className="antialiased">
				<Providers>
					{children}
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
