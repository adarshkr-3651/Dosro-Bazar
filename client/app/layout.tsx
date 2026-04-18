import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { ThemeSync } from "./components/theme-sync";
import Chatbot from "./components/Chatbot";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dosro Bazar",
  description: "Join thousands of happy buyers and sellers. Find great deals or sell your items quickly and easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeSync />
            {children}
            <Chatbot />
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

