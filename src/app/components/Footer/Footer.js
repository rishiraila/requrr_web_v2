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

export default function Footer() {
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



           
            

    
    <footer class="content-footer footer bg-footer-theme">
              <div class="container-xxl">
                <div
                  class="footer-container d-flex align-items-center justify-content-center py-4 flex-md-row flex-column">
                  <div class="text-body mb-2 mb-md-0">
                    ©
                    <script>
                      document.write(new Date().getFullYear());
                    </script>
                    , made with <span class="text-danger"><i class="tf-icons ri-heart-fill"></i></span> by
                     <a href="https://coinage.in" target="_blank" class="footer-link">&nbsp;Coinage Software Pvt.Ltd</a>
                  </div>
                  
                </div>
              </div>
            </footer>

    </>
  )
}
