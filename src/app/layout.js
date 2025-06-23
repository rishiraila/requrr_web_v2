'use client'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer"

import Preloader from './components/Preloader';

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
  const isAuthPage = ["/login", "/signup", "/forgot"].includes(pathname.toLowerCase());

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If no token and not already on login/signup, redirect to /login
    if (!token && !isAuthPage) {
      router.push("/Login");
    } else {
      setIsAuthenticated(!!token);
    }
    // Either way, auth check is done
    setLoading(false);
  }, [pathname]); // Runs when pathname changes

  if (loading && !isAuthPage) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <span>Checking authentication... Please wait.</span>
          </div>
        </body>
      </html>
    );
  }
  return (
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

            {/* <Sidebar /> */}
            {!isAuthPage && isAuthenticated && <Sidebar />}

            <div className="layout-page">

              {/* <Navbar /> */}
              {!isAuthPage && isAuthenticated && <Navbar />}

              <div className="content-wrapper pt-2">
                {/* 
                {children}

                {!isAuthPage && isAuthenticated && <Footer />} */}

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

        <Script src="https://checkout.razorpay.com/v1/checkout.js"/>


      </body>

    </html>
  );
}
