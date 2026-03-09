import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Frl",
  description: "FRL-Forum for Responsible Living",
};

import { ThemeProvider } from "@/components/theme-provider";
import LayoutWrapper from "./components/LayoutWrapper";

import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster position="top-center" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
