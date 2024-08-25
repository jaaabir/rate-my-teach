import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Script from 'next/script'
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "U-Rankly",
  description: "",
};

export default function RootLayout({ children }) {

  return (
   <ClerkProvider>
    <html lang="en">
      <head>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-G0NQ2G408R" strategy="afterInteractive"/>
        <Script id='google-analytics' strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-G0NQ2G408R');
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
    </ClerkProvider>
  );
}
