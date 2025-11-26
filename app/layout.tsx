import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: "Catálogo Online Mult Kits Brasil",
    description: "Gerencie e visualize seus produtos de forma simples e eficiente.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={`${poppins.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
                {children}
            </body>
        </html>
    );
}
