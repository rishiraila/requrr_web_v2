'use client'

import React, { useEffect, useState } from 'react'

import Script from "next/script";

import "@/app/assets/vendor/fonts/remixicon/remixicon.css"
import "@/app/assets/vendor/fonts/flag-icons.css"

import "@/app/assets/vendor/libs/node-waves/node-waves.css";
import "@/app/assets/vendor/css/rtl/core.css";

import "@/app/assets/vendor/css/rtl/theme-default.css";

import "@/app/assets/css/demo.css";

import '@/app/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css';

import "@/app/assets/vendor/libs/typeahead-js/typeahead.css"

import "@/app/assets/vendor/libs/apex-charts/apex-charts.css"

import "@/app/assets/vendor/libs/swiper/swiper.css"

import "@/app/assets/vendor/css/pages/cards-statistics.css"

import "@/app/assets/vendor/css/pages/cards-analytics.css"

import "@fontsource/inter"

import "@fontsource/inter/300.css"; // Weight 300
import "@fontsource/inter/400.css"; // Weight 400
import "@fontsource/inter/500.css"; // Weight 500
import "@fontsource/inter/600.css"; // Weight 600
import "@fontsource/inter/700.css"; // Weight 700

import Link from 'next/link';



export default function Navbar() {

    function decodeJWT(token) {
        if (!token) return null;
        const payload = token.split('.')[1];
        try {
            return JSON.parse(atob(payload)); // atob decodes Base64
        } catch (e) {
            console.error('Invalid token', e);
            return null;
        }
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userData = decodeJWT(token);

    // For debugging
    console.log("Decoded token:", userData);

    return (
        <>

            <Script src="/assets/vendor/js/helpers.js" strategy="beforeInteractive" />

            <Script src="/assets/vendor/js/template-customizer.js" strategy="beforeInteractive" />

            <Script src="/assets/js/config.js" strategy="beforeInteractive" />


            <Script src="/assets/vendor/libs/jquery/jquery.js" />
            <Script src="/assets/vendor/libs/popper/popper.js" />
            <Script src="/assets/vendor/js/bootstrap.js" />
            <Script src="/assets/vendor/libs/node-waves/node-waves.js" />
            <Script src="/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js" />
            <Script src="/assets/vendor/libs/hammer/hammer.js" />
            <Script src="/assets/vendor/libs/i18n/i18n.js" />
            <Script src="/assets/vendor/libs/typeahead-js/typeahead.js" />
            <Script src="/assets/vendor/js/menu.js" />


            <Script src="/assets/vendor/libs/apex-charts/apexcharts.js" />
            <Script src="/assets/vendor/libs/swiper/swiper.js" />


            <Script src="/assets/js/main.js" />


            <Script src="/assets/js/dashboards-analytics.js" />
            {/* bg-navbar-theme */}
            <nav
                className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center"
                id="layout-navbar" style={{ backgroundColor: "#ffffff !important", padding: "15px !important", marginBottom: "15px !important" }}>
                <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
                    <a className="nav-item nav-link px-0 me-xl-6" href="javascript:void(0)">
                        <i className="ri-menu-fill ri-22px"></i>
                    </a>
                </div>

                <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">

                    <div class="navbar-nav align-items-center">
                        <div class="nav-item navbar-search-wrapper mb-0">
                            {/* <h5>Bagde be here</h5> */}
                        </div>
                    </div>

                    <ul className="navbar-nav flex-row align-items-center ms-auto">

                        <li className="nav-item navbar-dropdown dropdown-user dropdown">
                            <a className="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
                                <div className="avatar avatar-online">
                                    <img src="/assets/img/avatars/1.png" alt className="rounded-circle" />
                                </div>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <Link className="dropdown-item" href="/Accounts/Account">
                                        <div className="d-flex">
                                            <div className="flex-shrink-0 me-2">
                                                <div className="avatar avatar-online">
                                                    <img src="/assets/img/avatars/1.png" alt className="rounded-circle" />
                                                </div>
                                            </div>
                                            <div className="flex-grow-1">
                                                <span className="fw-medium d-block small">{userData?.email || "No email"}</span>
                                                <small className="text-muted">User</small>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <div className="dropdown-divider"></div>
                                </li>
                                <li>
                                    <Link className="dropdown-item" href="/Accounts/Account">
                                        <i className="ri-user-3-line ri-22px me-3"></i><span className="align-middle">My Profile</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link className="dropdown-item" href="/Accounts/Security">
                                        <i className="ri-lock-line ri-22px me-3"></i><span className="align-middle">Security</span>
                                    </Link>
                                </li>

                                <li>
                                    <Link className="dropdown-item" href="/notification-preferences">
                                        <i className="ri-notification-2-line ri-22px me-3"></i><span className="align-middle">Notification</span>
                                    </Link>

                                </li>
                                <li>
                                    <div className="dropdown-divider"></div>
                                </li>

                                <li>
                                    <div className="d-grid px-4 pt-2 pb-1">
                                        <button className="btn btn-sm btn-danger d-flex" onClick={() => {
                                            localStorage.removeItem("token"); // Clear token
                                            window.location.href = "/Login"; // Redirect to login page
                                        }}>
                                            <small className="align-middle">Logout</small>
                                            <i className="ri-logout-box-r-line ms-2 ri-16px"></i>
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div className="navbar-search-wrapper search-input-wrapper d-none">
                    <input
                        type="text"
                        className="form-control search-input container-xxl border-0"
                        placeholder="Search..."
                        aria-label="Search..." />
                    <i className="ri-close-fill search-toggler cursor-pointer"></i>
                </div>
            </nav>





        </>
    )
}
