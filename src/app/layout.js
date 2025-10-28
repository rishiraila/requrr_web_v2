'use client';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppProvider } from "./context/AppContext";

import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Preloader from "./components/Preloader";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = ["/login", "/signup", "/forgot", "/docs"].includes(
    pathname.toLowerCase()
  );

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Detect mobile device or small screen
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && !isAuthPage) {
      router.push("/Login");
    } else {
      setIsAuthenticated(!!token);
    }
    setLoading(false);
  }, [pathname]);

  if (loading && !isAuthPage) {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable}`}
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span>Checking authentication... Please wait.</span>
        </body>
      </html>
    );
  }

  // ✅ If mobile, show the Download App Page instead of dashboard
 // ✅ If mobile, show the Download App Page instead of dashboard
if (isMobile && !isAuthPage) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: "#fff",
          padding: "1.5rem",
        }}
      >
        <img
          src="/images/appicon.png"
          alt="Requrr Logo"
          style={{ width: "120px", marginBottom: "20px" }}
        />
        <h3 className="fw-bold mb-3">Please download the Requrr mobile app</h3>
        <p style={{ maxWidth: "380px", color: "#555", marginBottom: "1.5rem" }}>
          Our web application is optimized for desktop.<br />
          For the best experience on mobile, please download our official Requrr app
          from the App Store or Google Play Store.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "nowrap",
            justifyContent: "center",
          }}
        >
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/App-Store.png" alt="App Store" width={150} height={50} style={{ objectFit: 'contain' }} />
          </a>
          <a
            href="https://play.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/Play-Store.png" alt="Google Play" width={130} height={50} style={{ objectFit: 'contain' }} />
          </a>
        </div>
      </body>
    </html>
  );
}


  // ✅ Desktop normal layout
  return (
    <AppProvider>
      <html lang="en" className="light-style layout-wide customizer-hide">
        <head>
          <link rel="stylesheet" href="/assets/vendor/css/pages/page-auth.css" />
          <link rel="stylesheet" href="/assets/vendor/css/pages/app-logistics-dashboard.css" />
          <link rel="stylesheet" href="/assets/vendor/css/pages/cards-statistics.css" />
          <link rel="stylesheet" href="/assets/vendor/css/pages/cards-analytics.css" />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
              {!isAuthPage && isAuthenticated && <Sidebar />}

              <div className="layout-page">
                {!isAuthPage && isAuthenticated && <Navbar />}

                <div className="content-wrapper pt-2">
                  {!isAuthPage && isAuthenticated && (
                    <>
                      {children}
                      <Footer />
                    </>
                  )}
                  {isAuthPage && children}
                </div>
              </div>
            </div>
          </div>
          <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        </body>
      </html>
    </AppProvider>
  );
}
