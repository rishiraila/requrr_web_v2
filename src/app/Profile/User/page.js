'use client'
import React from 'react'

import "@/app/assets/vendor/css/pages/page-profile.css"


export default function page() {
  return (
    <>

      <div className="container-xxl flex-grow-1 container-p-y">
       
        <div className="row">
          <div className="col-12">
            <div className="card mb-6">
              <div className="user-profile-header-banner">
                <img src="/assets/img/pages/profile-banner.png" alt="Banner image" className="rounded-top" />
              </div>
              <div className="user-profile-header d-flex flex-column flex-sm-row text-sm-start text-center mb-5">
                <div className="flex-shrink-0 mt-n2 mx-sm-0 mx-auto">
                  <img
                    src="/assets/img/avatars/1.png"
                    alt="user image"
                    className="d-block h-auto ms-0 ms-sm-5 rounded-4 user-profile-img" />
                </div>
                <div className="flex-grow-1 mt-4 mt-sm-12">
                  <div
                    className="d-flex align-items-md-end align-items-sm-start align-items-center justify-content-md-between justify-content-start mx-5 flex-md-row flex-column gap-6">
                    <div className="user-profile-info">
                      <h4 className="mb-2">John Doe</h4>
                      <ul
                        className="list-inline mb-0 d-flex align-items-center flex-wrap justify-content-sm-start justify-content-center gap-4">
                        <li className="list-inline-item">
                          <i className="ri-palette-line me-2 ri-24px"></i><span className="fw-medium">UX Designer</span>
                        </li>
                        <li className="list-inline-item">
                          <i className="ri-map-pin-line me-2 ri-24px"></i><span className="fw-medium">Vatican City</span>
                        </li>
                        <li className="list-inline-item">
                          <i className="ri-calendar-line me-2 ri-24px"></i
                          ><span className="fw-medium"> Joined April 2021</span>
                        </li>
                      </ul>
                    </div>
                    <a href="javascript:void(0)" className="btn btn-primary">
                      <i className="ri-user-follow-line ri-16px me-2"></i>Connected
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        



        <div className="row">
          <div className="col-md-12">
            <div className="nav-align-top">
              <ul className="nav nav-pills flex-column flex-sm-row mb-6 row-gap-2">
                <li className="nav-item">
                  <a className="nav-link active" href="javascript:void(0);"
                  ><i className="ri-user-3-line me-2"></i>Profile</a>
                </li>

                
                <li className="nav-item">
                  <a className="nav-link" href="/Profile/Teams"><i className="ri-team-line me-2"></i>Teams</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Profile/Project"
                  ><i className="ri-computer-line me-2"></i>Projects</a
                  >
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Profile/Connections"
                  ><i className="ri-link-m me-2"></i>Connections</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
        

        
        <div className="row">
          <div className="col-xl-4 col-lg-5 col-md-5">
           
            <div className="card mb-6">
              <div className="card-body">
                <small className="card-text text-uppercase text-muted small">About</small>
                <ul className="list-unstyled my-3 py-1">
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-user-3-line ri-24px"></i><span className="fw-medium mx-2">Full Name:</span>
                    <span>John Doe</span>
                  </li>
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-check-line ri-24px"></i><span className="fw-medium mx-2">Status:</span>
                    <span>Active</span>
                  </li>
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-star-smile-line ri-24px"></i><span className="fw-medium mx-2">Role:</span>
                    <span>Developer</span>
                  </li>
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-flag-2-line ri-24px"></i><span className="fw-medium mx-2">Country:</span>
                    <span>USA</span>
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <i className="ri-translate-2 ri-24px"></i><span className="fw-medium mx-2">Languages:</span>
                    <span>English</span>
                  </li>
                </ul>
                <small className="card-text text-uppercase text-muted small">Contacts</small>
                <ul className="list-unstyled my-3 py-1">
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-phone-line ri-24px"></i><span className="fw-medium mx-2">Contact:</span>
                    <span>(123) 456-7890</span>
                  </li>
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-wechat-line ri-24px"></i><span className="fw-medium mx-2">Skype:</span>
                    <span>john.doe</span>
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <i className="ri-mail-open-line ri-24px"></i><span className="fw-medium mx-2">Email:</span>
                    <span>john.doe@example.com</span>
                  </li>
                </ul>
                <small className="card-text text-uppercase text-muted small">Teams</small>
                <ul className="list-unstyled mb-0 mt-3 pt-1">
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-github-line ri-24px text-body me-2"></i>
                    <div className="d-flex flex-wrap">
                      <span className="fw-medium me-2">Backend Developer</span><span>(126 Members)</span>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <i className="ri-reactjs-line ri-24px text-body me-2"></i>
                    <div className="d-flex flex-wrap">
                      <span className="fw-medium me-2">React Developer</span><span>(98 Members)</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            


            <div className="card mb-6">
              <div className="card-body">
                <small className="card-text text-uppercase text-muted small">Overview</small>
                <ul className="list-unstyled mb-0 mt-3 pt-1">
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-check-line ri-24px"></i><span className="fw-medium mx-2">Task Compiled:</span>
                    <span>13.5k</span>
                  </li>
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-user-3-line ri-24px"></i><span className="fw-medium mx-2">Projects Compiled:</span>
                    <span>146</span>
                  </li>
                  <li className="d-flex align-items-center">
                    <i className="ri-star-smile-line ri-24px"></i><span className="fw-medium mx-2">Connections:</span>
                    <span>897</span>
                  </li>
                </ul>
              </div>
            </div>
            
          </div>
          <div className="col-xl-8 col-lg-7 col-md-7">
           
            <div className="card card-action mb-6">
              <div className="card-header align-items-center">
                <h5 className="card-action-title mb-0">
                  <i className="ri-bar-chart-2-line ri-24px text-body me-4"></i>Activity Timeline
                </h5>
                <div className="card-action-element">
                  <div className="dropdown">
                    <button
                      type="button"
                      className="btn dropdown-toggle hide-arrow p-0"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      <i className="ri-more-2-line ri-22px text-muted"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><a className="dropdown-item" href="javascript:void(0);">Share timeline</a></li>
                      <li><a className="dropdown-item" href="javascript:void(0);">Suggest edits</a></li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li><a className="dropdown-item" href="javascript:void(0);">Report bug</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body pt-5">
                <ul className="timeline mb-0">
                  <li className="timeline-item timeline-item-transparent">
                    <span className="timeline-point timeline-point-primary"></span>
                    <div className="timeline-event">
                      <div className="timeline-header mb-3">
                        <h6 className="mb-0">12 Invoices have been paid</h6>
                        <small className="text-muted">12 min ago</small>
                      </div>
                      <p className="mb-2">Invoices have been paid to the company</p>
                      <div className="d-flex align-items-center">
                        <div className="badge bg-lighter rounded-3">
                          <img src="/assets//img/icons/misc/pdf.png" alt="img" width="15" className="me-2" />
                          <span className="h6 mb-0 text-body">invoices.pdf</span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="timeline-item timeline-item-transparent">
                    <span className="timeline-point timeline-point-success"></span>
                    <div className="timeline-event">
                      <div className="timeline-header mb-3">
                        <h6 className="mb-0">Client Meeting</h6>
                        <small className="text-muted">45 min ago</small>
                      </div>
                      <p className="mb-2">Project meeting with john @10:15am</p>
                      <div className="d-flex justify-content-between flex-wrap gap-2">
                        <div className="d-flex flex-wrap align-items-center">
                          <div className="avatar avatar-sm me-2">
                            <img src="/assets/img/avatars/1.png" alt="Avatar" className="rounded-circle" />
                          </div>
                          <div>
                            <p className="mb-0 small fw-medium">Lester McCarthy (Client)</p>
                            <small>CEO of ThemeSelection</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="timeline-item timeline-item-transparent">
                    <span className="timeline-point timeline-point-info"></span>
                    <div className="timeline-event">
                      <div className="timeline-header mb-3">
                        <h6 className="mb-0">Create a new project for client</h6>
                        <small className="text-muted">2 Day Ago</small>
                      </div>
                      <p className="mb-2">6 team members in a project</p>
                      <ul className="list-group list-group-flush">
                        <li
                          className="list-group-item d-flex justify-content-between align-items-center flex-wrap p-0">
                          <div className="d-flex flex-wrap align-items-center">
                            <ul className="list-unstyled users-list d-flex align-items-center avatar-group m-0 me-2">
                              <li
                                data-bs-toggle="tooltip"
                                data-popup="tooltip-custom"
                                data-bs-placement="top"
                                title="Vinnie Mostowy"
                                className="avatar pull-up">
                                <img className="rounded-circle" src="/assets/img/avatars/5.png" alt="Avatar" />
                              </li>
                              <li
                                data-bs-toggle="tooltip"
                                data-popup="tooltip-custom"
                                data-bs-placement="top"
                                title="Allen Rieske"
                                className="avatar pull-up">
                                <img className="rounded-circle" src="/assets/img/avatars/12.png" alt="Avatar" />
                              </li>
                              <li
                                data-bs-toggle="tooltip"
                                data-popup="tooltip-custom"
                                data-bs-placement="top"
                                title="Julee Rossignol"
                                className="avatar pull-up">
                                <img className="rounded-circle" src="/assets/img/avatars/6.png" alt="Avatar" />
                              </li>
                              <li className="avatar">
                                <span
                                  className="avatar-initial rounded-circle pull-up text-heading"
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="bottom"
                                  title="3 more"
                                >+3</span
                                >
                              </li>
                            </ul>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
           
            <div className="row">
              
              <div className="col-lg-12 col-xl-6">
                <div className="card card-action mb-6">
                  <div className="card-header align-items-center">
                    <h5 className="card-action-title mb-0">Connections</h5>
                    <div className="card-action-element">
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn dropdown-toggle hide-arrow p-0"
                          data-bs-toggle="dropdown"
                          aria-expanded="false">
                          <i className="ri-more-2-line ri-22px text-muted"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li><a className="dropdown-item" href="javascript:void(0);">Share connections</a></li>
                          <li><a className="dropdown-item" href="javascript:void(0);">Suggest edits</a></li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li><a className="dropdown-item" href="javascript:void(0);">Report bug</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled mb-0">
                      <li className="mb-4">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="avatar me-2">
                              <img src="/assets/img/avatars/2.png" alt="Avatar" className="rounded-circle" />
                            </div>
                            <div className="me-2">
                              <h6 className="mb-1">Cecilia Payne</h6>
                              <small>45 Connections</small>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <button className="btn btn-outline-primary btn-icon">
                              <i className="ri-user-add-line ri-22px"></i>
                            </button>
                          </div>
                        </div>
                      </li>
                      <li className="mb-4">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="avatar me-2">
                              <img src="/assets/img/avatars/3.png" alt="Avatar" className="rounded-circle" />
                            </div>
                            <div className="me-2">
                              <h6 className="mb-1">Curtis Fletcher</h6>
                              <small>1.32k Connections</small>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <button className="btn btn-primary btn-icon">
                              <i className="ri-user-3-line ri-22px"></i>
                            </button>
                          </div>
                        </div>
                      </li>
                      <li className="mb-4">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="avatar me-2">
                              <img src="/assets/img/avatars/8.png" alt="Avatar" className="rounded-circle" />
                            </div>
                            <div className="me-2">
                              <h6 className="mb-1">Alice Stone</h6>
                              <small>125 Connections</small>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <button className="btn btn-primary btn-icon">
                              <i className="ri-user-3-line ri-22px"></i>
                            </button>
                          </div>
                        </div>
                      </li>
                      <li className="mb-4">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="avatar me-2">
                              <img src="/assets/img/avatars/7.png" alt="Avatar" className="rounded-circle" />
                            </div>
                            <div className="me-2">
                              <h6 className="mb-1">Darrell Barnes</h6>
                              <small>456 Connections</small>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <button className="btn btn-outline-primary btn-icon">
                              <i className="ri-user-add-line ri-22px"></i>
                            </button>
                          </div>
                        </div>
                      </li>

                      <li className="mb-5">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="avatar me-2">
                              <img src="/assets/img/avatars/12.png" alt="Avatar" className="rounded-circle" />
                            </div>
                            <div className="me-2">
                              <h6 className="mb-1">Eugenia Moore</h6>
                              <small>1.2k Connections</small>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <button className="btn btn-outline-primary btn-icon">
                              <i className="ri-user-add-line ri-22px"></i>
                            </button>
                          </div>
                        </div>
                      </li>
                      <li className="text-center">
                        <a href="javascript:;">View all connections</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              

              <div className="col-lg-12 col-xl-6">
                <div className="card card-action mb-6">
                  <div className="card-header align-items-center">
                    <h5 className="card-action-title mb-0">Teams</h5>
                    <div className="card-action-element">
                      <div className="dropdown">
                        <button
                          type="button"
                          className="btn dropdown-toggle hide-arrow p-0"
                          data-bs-toggle="dropdown"
                          aria-expanded="false">
                          <i className="ri-more-2-line ri-24px text-muted"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li><a className="dropdown-item" href="javascript:void(0);">Share teams</a></li>
                          <li><a className="dropdown-item" href="javascript:void(0);">Suggest edits</a></li>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li><a className="dropdown-item" href="javascript:void(0);">Report bug</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled mb-0">
                      <li className="mb-4">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="avatar me-2">
                              <img
                                src="/assets/img/icons/brands/react-label.png"
                                alt="Avatar"
                                className="rounded-circle" />
                            </div>
                            <div className="me-2">
                              <h6 className="mb-1">React Developers</h6>
                              <small>72 Members</small>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <a href="javascript:;"
                            ><span className="badge bg-label-danger rounded-pill">Developer</span></a
                            >
                          </div>
                        </div>
                      </li>
                      <li className="mb-4">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="avatar me-2">
                              <img
                                src="/assets/img/icons/brands/support-label.png"
                                alt="Avatar"
                                className="rounded-circle" />
                            </div>
                            <div className="me-2">
                              <h6 className="mb-1">Support Team</h6>
                              <small>122 Members</small>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <a href="javascript:;"
                            ><span className="badge bg-label-primary rounded-pill">Support</span></a
                            >
                          </div>
                        </div>
                      </li>
                      <li className="mb-4">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="avatar me-2">
                              <img
                                src="/assets/img/icons/brands/figma-label.png"
                                alt="Avatar"
                                className="rounded-circle" />
                            </div>
                            <div className="me-2">
                              <h6 className="mb-1">UI Designers</h6>
                              <small>7 Members</small>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <a href="javascript:;"
                            ><span className="badge bg-label-info rounded-pill">Designer</span></a
                            >
                          </div>
                        </div>
                      </li>
                      <li className="mb-4">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="avatar me-2">
                              <img
                                src="/assets/img/icons/brands/vue-label.png"
                                alt="Avatar"
                                className="rounded-circle" />
                            </div>
                            <div className="me-2">
                              <h6 className="mb-1">Vue.js Developers</h6>
                              <small>289 Members</small>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <a href="javascript:;"
                            ><span className="badge bg-label-danger rounded-pill">Developer</span></a
                            >
                          </div>
                        </div>
                      </li>
                      <li className="mb-5">
                        <div className="d-flex align-items-center">
                          <div className="d-flex align-items-center">
                            <div className="avatar me-2">
                              <img
                                src="/assets/img/icons/brands/twitter-label.png"
                                alt="Avatar"
                                className="rounded-circle" />
                            </div>
                            <div className="me-w">
                              <h6 className="mb-1">Digital Marketing</h6>
                              <small>24 Members</small>
                            </div>
                          </div>
                          <div className="ms-auto">
                            <a href="javascript:;"
                            ><span className="badge bg-label-secondary rounded-pill">Marketing</span></a
                            >
                          </div>
                        </div>
                      </li>
                      <li className="text-center">
                        <a href="javascript:;">View all teams</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
            </div>

            
            <div className="card mb-4">
              <h5 className="card-header">Project List</h5>
              <div className="card-datatable table-responsive pb-0">
                <table className="table datatable-project table-border-bottom-0">
                  <thead>
                    <tr>
                      <th></th>
                      <th></th>
                      <th>Project</th>
                      <th>leader</th>
                      <th>teams</th>
                      <th>Progress</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>

    </>
  )
}
