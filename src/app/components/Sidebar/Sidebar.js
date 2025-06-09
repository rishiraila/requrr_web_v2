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

export default function Sidebar() {

  const pathname = usePathname()

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


      <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme" style={{backgroundColor:"#FFFFFF !important"}}>
        <div className="app-brand demo py-4">
          <Link href="/" className="app-brand-link">
            <div style={{backgroundColor:"#666CFF", borderRadius:"10px"}} className='p-2'>
              < i class="ri-time-line" style={{fontSize:"25px", color:"#ffffff"}}></i>
            </div>
            <span className="app-brand-text demo menu-text fw-semibold ms-2">ReQurr</span>
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
            </Link>
          </li>

          <li className={`menu-item ${pathname == '/Expense/Services' ? 'active' : ''}`}>
            <Link href="/Expense/Services" className="menu-link ">
              <i className="menu-icon tf-icons ri-cloud-line"></i>
              <div >Services</div>
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

          <li className={`menu-item ${pathname == '/Accounts/Account' ||  pathname == '/notification-preferences' ||  pathname == '/Accounts/Security' ? 'active' : ''}`}>
            <Link href="/notification-preferences" className="menu-link ">
              <i className="menu-icon tf-icons ri-settings-2-line"></i>
              <div >Settings</div>
            </Link>
          </li>

        
        </ul>
      </aside>



    </>
  )
}
