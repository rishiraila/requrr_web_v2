'use client'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname, useRouter  } from "next/navigation";
import { useEffect } from "react";

import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer"

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
  const isAuthPage  = ["/login", "/signup"].includes(pathname.toLowerCase()); 
  
  useEffect(() => {
    const token = localStorage.getItem("token");

    // If no token and not already on login/signup, redirect to /login
    if (!token && !isAuthPage) {
      router.push("/Login");
    }
  }, [pathname]); // Runs when pathname changes
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>

        <div className="layout-wrapper layout-content-navbar">
          <div className="layout-container">

            {/* <Sidebar /> */}
            {!isAuthPage && <Sidebar />}

            <div className="layout-page">

              {/* <Navbar /> */}
              {!isAuthPage && <Navbar />}

              <div className="content-wrapper">

                {children}

                {/* <Footer /> */}
                {!isAuthPage && <Footer />}

              </div>

            </div>

          </div>

        </div>

      </body>

    </html>
  );
}
