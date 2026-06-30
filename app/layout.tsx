import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "Invoicely — Smart Invoicing",
  description: "Create, send, and collect payments on invoices — all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "hsl(252, 95%, 70%)",
          colorBackground: "hsl(240, 10%, 4%)",
          colorInputBackground: "hsl(240, 8%, 7%)",
          colorText: "hsl(0, 0%, 98%)",
          colorTextSecondary: "hsl(240, 5%, 65%)",
          borderRadius: "0.75rem",
        },
      }}
    >
      <html lang="en" className="dark" style={{ ["--font-sans" as string]: "Inter, system-ui, sans-serif" }}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
