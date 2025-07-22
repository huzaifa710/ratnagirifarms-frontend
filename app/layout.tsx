import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script"; // Add this import
import "./globals.css";
import Navbar from "@/app/component/navbar/page";
import Footer from "@/app/component/footer/page";
import { CartProvider } from "@/app/cart-context/page";
import { AuthProvider } from "@/app/auth-context/page";
import { Toaster, toast } from "react-hot-toast"; // Import toast
import BreadcrumbSchema from "@/app/component/breadcrumb-schema/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Premium Alphonso Mangoes Direct from Orchards",
  description:
    "Order premium Ratnagiri Alphonso mangoes online - handpicked, naturally ripened, and directly delivered from our family orchards with 25+ years of expertise. Pure taste, guaranteed quality.",
  keywords: [
    "Alphonso mangoes",
    "Ratnagiri mangoes",
    "premium mangoes",
    "organic mangoes",
    "mango delivery",
    "mango box",
    "hapus",
    "direct from farm",
    "Mumbai mango delivery",
    "Pune mango delivery",
    "Hapus mangoes",
    "Ratnagiri mangoes online",
    "Alphonso mangoes online",
  ],
  authors: [{ name: "Ratnagiri Farms" }],
  creator: "Ratnagiri Farms",
  publisher: "Ratnagiri Farms",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://ratnagirifarms.com",
    siteName: "Ratnagiri Farms",
    title: "Premium Alphonso Mangoes from Ratnagiri Orchards",
    description:
      "Experience the authentic taste of premium Alphonso mangoes delivered directly from our Ratnagiri orchards to your doorstep.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: "https://ratnagirifarms.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BreadcrumbSchema />
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <Toaster
              position="top-center"
              reverseOrder={false}
              gutter={8}
              toastOptions={{
                className: "toast",
                success: {
                  className: "successToast",
                },
                error: {
                  className: "errorToast",
                },
              }}
            />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>

      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-KVEV31LFVH"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-KVEV31LFVH');
        `}
      </Script>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-16945474631"
      />
      <Script id="google-ads" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-16945474631');
        `}
      </Script>
    </html>
  );
}
