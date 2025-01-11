import React from 'react'

import "@/app/assets/vendor/css/pages/page-pricing.css"

export default function page() {
  return (
    <>
    
    <div className="container-xxl flex-grow-1 container-p-y">
              <div className="card">
                
                <div className="pb-sm-12 pb-2 rounded-top">
                  <div className="container py-12">
                    <h4 className="text-center mb-2 mt-0 mt-md-4">Pricing Plans</h4>
                    <p className="text-center mb-2">
                      All plans include 40+ advanced tools and features to boost your product. Choose the best plan to
                      fit your needs.
                    </p>
                    <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 pt-7 mb-6">
                      <label className="switch switch-sm ms-sm-5 ps-sm-5 me-0">
                        <span className="switch-label fw-medium text-body pe-1 fs-6">Monthly</span>
                        <input type="checkbox" className="switch-input price-duration-toggler" checked />
                        <span className="switch-toggle-slider">
                          <span className="switch-on"></span>
                          <span className="switch-off"></span>
                        </span>
                        <span className="switch-label fw-medium text-body ps-9 fs-6">Annual</span>
                      </label>
                      <div className="mt-n5 ms-n5 ml-2 mb-8 d-none d-sm-flex align-items-center gap-1">
                        <i className="ri-corner-left-down-fill ri-24px text-muted scaleX-n1-rtl"></i>
                        <span className="badge badge-sm bg-label-primary rounded-pill mb-2">Save up to 10%</span>
                      </div>
                    </div>

                    <div className="pricing-plans row mx-4 gy-3 px-lg-12">
                      
                      <div className="col-lg mb-lg-0 mb-3">
                        <div className="card border shadow-none">
                          <div className="card-body pt-12">
                            <div className="mt-3 mb-5 text-center">
                              <img
                                src="/assets/img/illustrations/pricing-basic.png"
                                alt="Basic Image"
                                height="100" />
                            </div>
                            <h4 className="card-title text-center text-capitalize mb-2">Basic</h4>
                            <p className="text-center mb-5">A simple start for everyone</p>
                            <div className="text-center">
                              <div className="d-flex justify-content-center">
                                <sup className="h6 pricing-currency mt-2 mb-0 me-1 text-body">$</sup>
                                <h1 className="mb-0 text-primary">0</h1>
                                <sub className="h6 pricing-duration mt-auto mb-1 text-body">/month</sub>
                              </div>
                            </div>

                            <ul className="list-group ps-6 my-5 pt-4">
                              <li className="mb-4">100 responses a month</li>
                              <li className="mb-4">Unlimited forms and surveys</li>
                              <li className="mb-4">Unlimited fields</li>
                              <li className="mb-4">Basic form creation tools</li>
                              <li className="mb-0">Up to 2 subdomains</li>
                            </ul>

                            <a href="auth-register-basic.html" className="btn btn-outline-success d-grid w-100"
                              >Your Current Plan</a
                            >
                          </div>
                        </div>
                      </div>

                      
                      <div className="col-lg mb-lg-0 mb-3">
                        <div className="card border-primary border shadow-none">
                          <div className="card-body position-relative pt-4">
                            <div className="position-absolute end-0 me-6 top-0 mt-6">
                              <span className="badge bg-label-primary rounded-pill">Popular</span>
                            </div>
                            <div className="my-5 pt-6 text-center">
                              <img
                                src="/assets/img/illustrations/pricing-standard.png"
                                alt="Standard Image"
                                height="100" />
                            </div>
                            <h4 className="card-title text-center text-capitalize mb-2">Standard</h4>
                            <p className="text-center mb-5">For small to medium businesses</p>
                            <div className="text-center">
                              <div className="d-flex justify-content-center">
                                <sup className="h6 pricing-currency mt-2 mb-0 me-1 text-body">$</sup>
                                <h1 className="price-toggle price-yearly text-primary mb-0">40</h1>
                                <h1 className="price-toggle price-monthly text-primary mb-0 d-none">49</h1>
                                <sub className="h6 text-body pricing-duration mt-auto mb-1">/month</sub>
                              </div>
                              <small className="price-yearly price-yearly-toggle text-muted">USD 480 / year</small>
                            </div>

                            <ul className="list-group ps-6 my-5 pt-4">
                              <li className="mb-4">Unlimited responses</li>
                              <li className="mb-4">Unlimited forms and surveys</li>
                              <li className="mb-4">Instagram profile page</li>
                              <li className="mb-4">Google Docs integration</li>
                              <li className="mb-0">Custom “Thank you” page</li>
                            </ul>

                            <a href="auth-register-basic.html" className="btn btn-primary d-grid w-100">Upgrade</a>
                          </div>
                        </div>
                      </div>

                      
                      <div className="col-lg">
                        <div className="card border shadow-none">
                          <div className="card-body pt-12">
                            <div className="mt-3 mb-5 text-center">
                              <img
                                src="/assets/img/illustrations/pricing-enterprise.png"
                                alt="Enterprise Image"
                                height="100" />
                            </div>
                            <h4 className="card-title text-center text-capitalize mb-2">Enterprise</h4>
                            <p className="text-center mb-5">Solution for big organizations</p>

                            <div className="text-center">
                              <div className="d-flex justify-content-center">
                                <sup className="h6 pricing-currency mt-2 mb-0 me-1 text-body">$</sup>
                                <h1 className="price-toggle price-yearly text-primary mb-0">80</h1>
                                <h1 className="price-toggle price-monthly text-primary mb-0 d-none">99</h1>
                                <sub className="h6 pricing-duration mt-auto mb-1 text-body">/month</sub>
                              </div>
                              <small className="price-yearly price-yearly-toggle text-muted">USD 960 / year</small>
                            </div>

                            <ul className="list-group ps-6 my-5 pt-4">
                              <li className="mb-4">PayPal payments</li>
                              <li className="mb-4">Logic Jumps</li>
                              <li className="mb-4">File upload with 5GB storage</li>
                              <li className="mb-4">Custom domain support</li>
                              <li className="mb-0">Stripe integration</li>
                            </ul>

                            <a href="auth-register-basic.html" className="btn btn-outline-primary d-grid w-100">Upgrade</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>

    </>
  )
}
