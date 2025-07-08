'use client'
import React from 'react'

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

import { usePathname } from 'next/navigation'
import { useAppContext } from '@/app/context/AppContext';

export default function Sidebar() {

  const { clientCount, serviceCount } = useAppContext();

  const pathname = usePathname()

  function decodeJWT(token) {
    if (!token) return null;
    const payload = token.split('.')[1];
    try {
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const userData = decodeJWT(token);
  const isAdmin = userData?.role === 'admin';


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


      <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
        <div className="app-brand demo ">
          <Link href="/" className="app-brand-link">
            <img src='/images/logo.png' style={{ width: "70%" }} />
          </Link>

          <Link href="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-auto hideOnPc ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.47365 11.7183C8.11707 12.0749 8.11707 12.6531 8.47365 13.0097L12.071 16.607C12.4615 16.9975 12.4615 17.6305 12.071 18.021C11.6805 18.4115 11.0475 18.4115 10.657 18.021L5.83009 13.1941C5.37164 12.7356 5.37164 11.9924 5.83009 11.5339L10.657 6.707C11.0475 6.31653 11.6805 6.31653 12.071 6.707C12.4615 7.09747 12.4615 7.73053 12.071 8.121L8.47365 11.7183Z"
                fill-opacity="0.9" />
              <path
                d="M14.3584 11.8336C14.0654 12.1266 14.0654 12.6014 14.3584 12.8944L18.071 16.607C18.4615 16.9975 18.4615 17.6305 18.071 18.021C17.6805 18.4115 17.0475 18.4115 16.657 18.021L11.6819 13.0459C11.3053 12.6693 11.3053 12.0587 11.6819 11.6821L16.657 6.707C17.0475 6.31653 17.6805 6.31653 18.071 6.707C18.4615 7.09747 18.4615 7.73053 18.071 8.121L14.3584 11.8336Z"
                fill-opacity="0.4" />
            </svg>
          </Link>

        </div>

        <div className="menu-inner-shadow"></div>

        <ul className="menu-inner py-1">


          <li className={`menu-item ${pathname == '/' ? 'active' : ''}`}>
            <Link href="/" className="menu-link ">
              <i className="menu-icon tf-icons ri-bar-chart-fill"></i>
              <div >Dashboard</div>
            </Link>
          </li>

          <li className={`menu-item ${pathname == '/Expense/Clients' ? 'active' : ''}`}>
            <Link href="/Expense/Clients" className="menu-link ">
              <i className="menu-icon tf-icons ri-group-line"></i>
              <div >Clients</div>
              <div className="badge bg-danger rounded-pill ms-auto">{clientCount}</div>
            </Link>
          </li>

          <li className={`menu-item ${pathname == '/Expense/Services' ? 'active' : ''}`}>
            <Link href="/Expense/Services" className="menu-link ">
              <i className="menu-icon tf-icons ri-cloud-line"></i>
              <div >Services</div>
              <div className="badge bg-danger rounded-pill ms-auto">{serviceCount}</div>
            </Link>
          </li>

          <li className={`menu-item ${pathname == '/Expense/Renewals' ? 'active' : ''}`}>
            <Link href="/Expense/Renewals" className="menu-link ">
              <i className="menu-icon tf-icons ri-time-line"></i>
              <div >Renewals</div>
            </Link>
          </li>

          <li className={`menu-item ${pathname == '/Expense/Calendar' ? 'active' : ''}`}>
            <Link href="/Expense/Calendar" className="menu-link ">
              <i className="menu-icon tf-icons ri-calendar-line"></i>
              <div >Calendar</div>
            </Link>
          </li>

          <li className={`menu-item ${pathname == '/Subscriptions' ? 'active' : ''}`}>
            <Link href="/Subscriptions" className="menu-link ">
              <i className="menu-icon tf-icons ri-money-dollar-circle-line"></i>
              <div >Subscriptions</div>
            </Link>
          </li>

          <li className={`menu-item ${pathname == '/Accounts/Account' || pathname == '/notification-preferences' || pathname == '/Accounts/Security' ? 'active' : ''}`}>
            <Link href="/notification-preferences" className="menu-link ">
              <i className="menu-icon tf-icons ri-settings-2-line"></i>
              <div >Settings</div>
            </Link>
          </li>

          {isAdmin && (
            <>



              <li className="menu-header mt-5">
                <span className="menu-header-text">Admin Boards</span>
              </li>

              <li className={`menu-item ${pathname == '/Admin/Users' ? 'active' : ''}`}>
                <Link href="/Admin/Users" className="menu-link ">
                  <i className="menu-icon tf-icons ri-user-line"></i>
                  <div >Users</div>
                </Link>
              </li>

              <li className={`menu-item ${pathname == '/Admin/Coupons' ? 'active' : ''}`}>
                <Link href="/Admin/Coupons" className="menu-link ">
                  <i className="menu-icon tf-icons ri-discount-percent-line"></i>
                  <div >Coupons</div>
                </Link>
              </li>

              <li className={`menu-item ${pathname == '/Admin/Plans' ? 'active' : ''}`}>
                <Link href="/Admin/Plans" className="menu-link ">
                  <i className="menu-icon tf-icons ri-box-3-line"></i>
                  <div >Plans</div>
                </Link>
              </li>

              <li className={`menu-item ${pathname == '/Admin/Transactions' ? 'active' : ''}`}>
                <Link href="/Admin/Transactions" className="menu-link ">
                  <i className="menu-icon tf-icons ri-bank-card-line"></i>
                  <div >Transactions </div>
                </Link>
              </li>

            </>
          )}




        </ul>
      </aside>



    </>
  )
}
