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
                    className="d-block h-auto ms-0 ms-sm-5 rounded user-profile-img" />
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
                          <i className="ri-map-pin-line me-2 ri-24px"></i> <span className="fw-medium">Vatican City</span>
                        </li>
                        <li className="list-inline-item">
                          <i className="ri-calendar-line me-2 ri-24px"></i>
                          <span className="fw-medium"> Joined April 2021</span>
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
                  <a className="nav-link" href="/Profile/User"
                  ><i className="ri-user-3-line me-2"></i> Profile</a
                  >
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Profile/Teams"><i className="ri-team-line me-2"></i> Teams</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" href="javascript:void(0);"
                  ><i className="ri-computer-line me-2"></i> Projects</a
                  >
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/Profile/Connections"
                  ><i className="ri-link-m me-2"></i> Connections</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>



        <div className="row g-6">
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="card">
              <div className="card-header pb-4">
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="avatar me-4">
                      <img
                        src="/assets/img/icons/brands/social-label.png"
                        alt="Avatar"
                        className="rounded-circle" />
                    </div>
                    <div className="me-2">
                      <h5 className="mb-0">
                        <a href="javascript:;" className="stretched-link text-heading">Social Banners</a>
                      </h5>
                      <div className="client-info text-body">
                        <span className="fw-medium">Client: </span><span>Christian Jimenez</span>
                      </div>
                    </div>
                  </div>
                  <div className="ms-auto">
                    <div className="dropdown z-2">
                      <button
                        type="button"
                        className="btn dropdown-toggle hide-arrow p-0"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i className="ri-more-2-line ri-22px text-muted"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><a className="dropdown-item" href="javascript:void(0);">Rename project</a></li>
                        <li><a className="dropdown-item" href="javascript:void(0);">View details</a></li>
                        <li><a className="dropdown-item" href="javascript:void(0);">Add to favorites</a></li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li><a className="dropdown-item text-danger" href="javascript:void(0);">Leave Project</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center flex-wrap">
                  <div className="bg-lighter px-3 py-2 rounded-3 me-auto mb-4">
                    <p className="mb-1"><span className="fw-medium text-heading">$24.8k</span> <span>/ $18.2k</span></p>
                    <span className="text-body">Total Budget</span>
                  </div>
                  <div className="text-start mb-4">
                    <p className="mb-1">
                      <span className="text-heading fw-medium">Start Date: </span> <span>14/2/21</span>
                    </p>
                    <p className="mb-1">
                      <span className="text-heading fw-medium">Deadline: </span> <span>28/2/22</span>
                    </p>
                  </div>
                </div>
                <p className="mb-0">We are Consulting, Software Development and Web Development Services.</p>
              </div>
              <div className="card-body border-top">
                <div className="d-flex align-items-center mb-4">
                  <p className="mb-1"><span className="text-heading fw-medium">All Hours: </span> <span>380/244</span></p>
                  <span className="badge bg-label-danger ms-auto rounded-pill">Developer</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-body">Task: 290/344</small>
                  <small className="text-body">95% Completed</small>
                </div>
                <div className="progress mb-4 rounded rounded" style={{height: "8px"}}>
                  <div
                    className="progress-bar rounded"
                    role="progressbar"
                    style={{width: "95%"}}
                    aria-valuenow="95"
                    aria-valuemin="0"
                    aria-valuemax="100"></div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <ul className="list-unstyled d-flex align-items-center avatar-group mb-0 z-2">
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="Vinnie Mostowy"
                        className="avatar avatar-sm pull-up">
                        <img className="rounded-circle" src="/assets/img/avatars/5.png" alt="Avatar" />
                      </li>
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="Allen Rieske"
                        className="avatar avatar-sm pull-up">
                        <img className="rounded-circle" src="/assets/img/avatars/12.png" alt="Avatar" />
                      </li>
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="Julee Rossignol"
                        className="avatar avatar-sm pull-up me-3">
                        <img className="rounded-circle" src="/assets/img/avatars/6.png" alt="Avatar" />
                      </li>
                      <li><small className="text-muted">280 Members</small></li>
                    </ul>
                  </div>
                  <div className="ms-auto">
                    <a href="javascript:void(0);" className="text-muted d-flex align-items-center"
                    ><i className="ri-wechat-line ri-24px me-1"></i>15</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="card">
              <div className="card-header pb-4">
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="avatar me-4">
                      <img
                        src="/assets/img/icons/brands/react-label.png"
                        alt="Avatar"
                        className="rounded-circle" />
                    </div>
                    <div className="me-2">
                      <h5 className="mb-0">
                        <a href="javascript:;" className="stretched-link text-body">Admin Template</a>
                      </h5>
                      <div className="client-info text-body">
                        <span className="fw-medium">Client: </span><span>Jeffrey Phillips</span>
                      </div>
                    </div>
                  </div>
                  <div className="ms-auto">
                    <div className="dropdown z-2">
                      <button
                        type="button"
                        className="btn dropdown-toggle hide-arrow p-0"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i className="ri-more-2-line ri-22px text-muted"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><a className="dropdown-item" href="javascript:void(0);">Rename project</a></li>
                        <li><a className="dropdown-item" href="javascript:void(0);">View details</a></li>
                        <li><a className="dropdown-item" href="javascript:void(0);">Add to favorites</a></li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li><a className="dropdown-item text-danger" href="javascript:void(0);">Leave Project</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center flex-wrap">
                  <div className="bg-lighter px-3 py-2 rounded-3 me-auto mb-4">
                    <p className="mb-1"><span className="fw-medium text-heading">$2.4k</span> <span>/ 1.8k</span></p>
                    <span className="text-body">Total Budget</span>
                  </div>
                  <div className="text-start mb-4">
                    <p className="mb-1">
                      <span className="text-heading fw-medium">Start Date: </span> <span>18/8/21</span>
                    </p>
                    <p className="mb-1">
                      <span className="text-heading fw-medium">Deadline: </span> <span>21/6/22</span>
                    </p>
                  </div>
                </div>
                <p className="mb-0">
                  Time is our most valuable asset, that's why we want to help you save it by creating…
                </p>
              </div>
              <div className="card-body border-top">
                <div className="d-flex align-items-center mb-4">
                  <p className="mb-1"><span className="text-heading fw-medium">All Hours: </span> <span>98/135</span></p>
                  <span className="badge bg-label-warning ms-auto rounded-pill">15 Days left</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-body">Task: 12/90</small>
                  <small className="text-body">42% Completed</small>
                </div>
                <div className="progress mb-4 rounded rounded" style={{height: "8px"}}>
                  <div
                    className="progress-bar rounded"
                    role="progressbar"
                    style={{width: "42%"}}
                    aria-valuenow="42"
                    aria-valuemin="0"
                    aria-valuemax="100"></div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <ul className="list-unstyled d-flex align-items-center avatar-group mb-0 z-2">
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="Kaith D'souza"
                        className="avatar avatar-sm pull-up">
                        <img className="rounded-circle" src="/assets/img/avatars/15.png" alt="Avatar" />
                      </li>
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="John Doe"
                        className="avatar avatar-sm pull-up">
                        <img className="rounded-circle" src="/assets/img/avatars/1.png" alt="Avatar" />
                      </li>
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="Alan Walker"
                        className="avatar avatar-sm pull-up me-3">
                        <img className="rounded-circle" src="/assets/img/avatars/16.png" alt="Avatar" />
                      </li>
                      <li><small className="text-muted">1.1k Members</small></li>
                    </ul>
                  </div>
                  <div className="ms-auto">
                    <a href="javascript:void(0);" className="text-muted d-flex align-items-center"
                    ><i className="ri-wechat-line ri-24px me-2"></i> 236</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="card">
              <div className="card-header pb-4">
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="avatar me-4">
                      <img
                        src="/assets/img/icons/brands/vue-label.png"
                        alt="Avatar"
                        className="rounded-circle" />
                    </div>
                    <div className="me-2">
                      <h5 className="mb-0"><a href="javascript:;" className="stretched-link text-body">App Design</a></h5>
                      <div className="client-info text-body">
                        <span className="fw-medium">Client: </span><span>Ricky McDonald</span>
                      </div>
                    </div>
                  </div>
                  <div className="ms-auto">
                    <div className="dropdown z-2">
                      <button
                        type="button"
                        className="btn dropdown-toggle hide-arrow p-0"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i className="ri-more-2-line ri-22px text-muted"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><a className="dropdown-item" href="javascript:void(0);">Rename project</a></li>
                        <li><a className="dropdown-item" href="javascript:void(0);">View details</a></li>
                        <li><a className="dropdown-item" href="javascript:void(0);">Add to favorites</a></li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li><a className="dropdown-item text-danger" href="javascript:void(0);">Leave Project</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center flex-wrap">
                  <div className="bg-lighter px-3 py-2 rounded-3 me-auto mb-4">
                    <p className="mb-1"><span className="fw-medium text-heading">$980</span> <span>/ $420</span></p>
                    <span className="text-body">Total Budget</span>
                  </div>
                  <div className="text-start mb-4">
                    <p className="mb-1">
                      <span className="text-heading fw-medium">Start Date: </span> <span>24/7/21</span>
                    </p>
                    <p className="mb-1">
                      <span className="text-heading fw-medium">Deadline: </span> <span>8/10/21</span>
                    </p>
                  </div>
                </div>
                <p className="mb-0">App design combines the user interface (UI) and user experience (UX).</p>
              </div>
              <div className="card-body border-top">
                <div className="d-flex align-items-center mb-4">
                  <p className="mb-1"><span className="text-heading fw-medium">All Hours: </span> <span>880/421</span></p>
                  <span className="badge bg-label-danger ms-auto rounded-pill">Developer</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-body">Task: 22/140</small>
                  <small className="text-body">68% Completed</small>
                </div>
                <div className="progress mb-4 rounded rounded" style={{height: "8px"}}>
                  <div
                    className="progress-bar rounded"
                    role="progressbar"
                    style={{width: "68%"}}
                    aria-valuenow="68"
                    aria-valuemin="0"
                    aria-valuemax="100"></div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <ul className="list-unstyled d-flex align-items-center avatar-group mb-0 z-2">
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="Jimmy Ressula"
                        className="avatar avatar-sm pull-up">
                        <img className="rounded-circle" src="/assets/img/avatars/4.png" alt="Avatar" />
                      </li>
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="Kristi Lawker"
                        className="avatar avatar-sm pull-up">
                        <img className="rounded-circle" src="/assets/img/avatars/2.png" alt="Avatar" />
                      </li>
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="Danny Paul"
                        className="avatar avatar-sm pull-up me-3">
                        <img className="rounded-circle" src="/assets/img/avatars/7.png" alt="Avatar" />
                      </li>
                      <li><small className="text-muted">458 Members</small></li>
                    </ul>
                  </div>
                  <div className="ms-auto">
                    <a href="javascript:void(0);" className="text-muted d-flex align-items-center"
                    ><i className="ri-wechat-line ri-24px me-1"></i> 98</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="card">
              <div className="card-header pb-4">
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="avatar me-4">
                      <img
                        src="/assets/img/icons/brands/html-label.png"
                        alt="Avatar"
                        className="rounded-circle" />
                    </div>
                    <div className="me-2">
                      <h5 className="mb-0">
                        <a href="javascript:;" className="stretched-link text-body">Create Website</a>
                      </h5>
                      <div className="client-info text-body">
                        <span className="fw-medium">Client: </span><span>Hulda Wright</span>
                      </div>
                    </div>
                  </div>
                  <div className="ms-auto">
                    <div className="dropdown z-2">
                      <button
                        type="button"
                        className="btn dropdown-toggle hide-arrow p-0"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i className="ri-more-2-line ri-22px text-muted"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><a className="dropdown-item" href="javascript:void(0);">Rename project</a></li>
                        <li><a className="dropdown-item" href="javascript:void(0);">View details</a></li>
                        <li><a className="dropdown-item" href="javascript:void(0);">Add to favorites</a></li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li><a className="dropdown-item text-danger" href="javascript:void(0);">Leave Project</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center flex-wrap">
                  <div className="bg-lighter px-3 py-2 rounded-3 me-auto mb-4">
                    <p className="mb-1"><span className="fw-medium text-heading">$8.5k</span> <span>/ $2.43k</span></p>
                    <span className="text-body">Total Budget</span>
                  </div>
                  <div className="text-start mb-4">
                    <p className="mb-1">
                      <span className="text-heading fw-medium">Start Date: </span> <span>10/2/19</span>
                    </p>
                    <p className="mb-1">
                      <span className="text-heading fw-medium">Deadline: </span> <span>12/9/22</span>
                    </p>
                  </div>
                </div>
                <p className="mb-0">Your domain name should reflect your products or services so that your...</p>
              </div>
              <div className="card-body border-top">
                <div className="d-flex align-items-center mb-4">
                  <p className="mb-1">
                    <span className="text-heading fw-medium">All Hours: </span> <span>1.2k/820</span>
                  </p>
                  <span className="badge bg-label-danger ms-auto rounded-pill">Developer</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-body">Task: 237/420</small>
                  <small className="text-body">72% Completed</small>
                </div>
                <div className="progress mb-4 rounded" style={{height: "8px"}}>
                  <div
                    className="progress-bar rounded"
                    role="progressbar"
                    style={{width: "72%"}}
                    aria-valuenow="72"
                    aria-valuemin="0"
                    aria-valuemax="100"></div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <ul className="list-unstyled d-flex align-items-center avatar-group mb-0 z-2">
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="Andrew Tye"
                        className="avatar avatar-sm pull-up">
                        <img className="rounded-circle" src="/assets/img/avatars/6.png" alt="Avatar" />
                      </li>
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="Rishi Swaat"
                        className="avatar avatar-sm pull-up">
                        <img className="rounded-circle" src="/assets/img/avatars/9.png" alt="Avatar" />
                      </li>
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="Rossie Kim"
                        className="avatar avatar-sm pull-up me-3">
                        <img className="rounded-circle" src="/assets/img/avatars/12.png" alt="Avatar" />
                      </li>
                      <li><small className="text-muted">137 Members</small></li>
                    </ul>
                  </div>
                  <div className="ms-auto">
                    <a href="javascript:void(0);" className="text-muted d-flex align-items-center"
                    ><i className="ri-wechat-line ri-24px me-1"></i> 120</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="card">
              <div className="card-header pb-4">
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="avatar me-4">
                      <img
                        src="/assets/img/icons/brands/figma-label.png"
                        alt="Avatar"
                        className="rounded-circle" />
                    </div>
                    <div className="me-2">
                      <h5 className="mb-0">
                        <a href="javascript:;" className="stretched-link text-body">Figma Dashboard</a>
                      </h5>
                      <div className="client-info text-body">
                        <span className="fw-medium">Client: </span><span>Jerry Greene</span>
                      </div>
                    </div>
                  </div>
                  <div className="ms-auto">
                    <div className="dropdown z-2">
                      <button
                        type="button"
                        className="btn dropdown-toggle hide-arrow p-0"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i className="ri-more-2-line ri-22px text-muted"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><a className="dropdown-item" href="javascript:void(0);">Rename project</a></li>
                        <li><a className="dropdown-item" href="javascript:void(0);">View details</a></li>
                        <li><a className="dropdown-item" href="javascript:void(0);">Add to favorites</a></li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li><a className="dropdown-item text-danger" href="javascript:void(0);">Leave Project</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center flex-wrap">
                  <div className="bg-lighter px-3 py-2 rounded-3 me-auto mb-4">
                    <p className="mb-1"><span className="fw-medium text-heading">$52.7k</span> <span>/ $28.4k</span></p>
                    <span className="text-body">Total Budget</span>
                  </div>
                  <div className="text-start mb-4">
                    <p className="mb-1">
                      <span className="text-heading fw-medium">Start Date: </span> <span>12/12/20</span>
                    </p>
                    <p className="mb-1">
                      <span className="text-heading fw-medium">Deadline: </span> <span>25/12/21</span>
                    </p>
                  </div>
                </div>
                <p className="mb-0">
                  Use this template to organize your design project. Some of the key features are…
                </p>
              </div>
              <div className="card-body border-top">
                <div className="d-flex align-items-center mb-4">
                  <p className="mb-1"><span className="text-heading fw-medium">All Hours: </span> <span>142/420</span></p>
                  <span className="badge bg-label-warning ms-auto rounded-pill">15 Days left</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-body">Task: 29/285</small>
                  <small className="text-body">35% Completed</small>
                </div>
                <div className="progress mb-4 rounded" style={{height: "8px"}}>
                  <div
                    className="progress-bar rounded"
                    role="progressbar"
                    style={{width: "35%"}}
                    aria-valuenow="35"
                    aria-valuemin="0"
                    aria-valuemax="100"></div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <ul className="list-unstyled d-flex align-items-center avatar-group mb-0 z-2">
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="Kim Merchent"
                        className="avatar avatar-sm pull-up">
                        <img className="rounded-circle" src="/assets/img/avatars/10.png" alt="Avatar" />
                      </li>
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="Sam D'souza"
                        className="avatar avatar-sm pull-up">
                        <img className="rounded-circle" src="/assets/img/avatars/13.png" alt="Avatar" />
                      </li>
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="Nurvi Karlos"
                        className="avatar avatar-sm pull-up me-3">
                        <img className="rounded-circle" src="/assets/img/avatars/15.png" alt="Avatar" />
                      </li>
                      <li><small className="text-muted">82 Members</small></li>
                    </ul>
                  </div>
                  <div className="ms-auto">
                    <a href="javascript:void(0);" className="text-muted d-flex align-items-center"
                    ><i className="ri-wechat-line ri-24px me-1"></i> 20</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="card">
              <div className="card-header pb-4">
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="avatar me-4">
                      <img src="/assets/img/icons/brands/xd-label.png" alt="Avatar" className="rounded-circle" />
                    </div>
                    <div className="me-2">
                      <h5 className="mb-0">
                        <a href="javascript:;" className="stretched-link text-body">Logo Design</a>
                      </h5>
                      <div className="client-info text-body">
                        <span className="fw-medium">Client: </span><span>Olive Strickland</span>
                      </div>
                    </div>
                  </div>
                  <div className="ms-auto">
                    <div className="dropdown z-2">
                      <button
                        type="button"
                        className="btn dropdown-toggle hide-arrow p-0"
                        data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i className="ri-more-2-line ri-22px text-muted"></i>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li><a className="dropdown-item" href="javascript:void(0);">Rename project</a></li>
                        <li><a className="dropdown-item" href="javascript:void(0);">View details</a></li>
                        <li><a className="dropdown-item" href="javascript:void(0);">Add to favorites</a></li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li><a className="dropdown-item text-danger" href="javascript:void(0);">Leave Project</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center flex-wrap">
                  <div className="bg-lighter px-3 py-2 rounded-3 me-auto mb-4">
                    <p className="mb-1"><span className="fw-medium text-heading">$1.3k</span> <span>/ $655</span></p>
                    <span className="text-body">Total Budget</span>
                  </div>
                  <div className="text-start mb-4">
                    <p className="mb-1">
                      <span className="text-heading fw-medium">Start Date: </span> <span>17/8/21</span>
                    </p>
                    <p className="mb-1">
                      <span className="text-heading fw-medium">Deadline: </span> <span>02/11/21</span>
                    </p>
                  </div>
                </div>
                <p className="mb-0">
                  Premium logo designs created by top logo designers. Create the branding of business.
                </p>
              </div>
              <div className="card-body border-top">
                <div className="d-flex align-items-center mb-4">
                  <p className="mb-1"><span className="text-heading fw-medium">All Hours: </span> <span>580/445</span></p>
                  <span className="badge bg-label-danger ms-auto rounded-pill">Developer</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-body">Task: 290/290</small>
                  <small className="text-body">100% Completed</small>
                </div>
                <div className="progress mb-4 rounded" style={{height: "8px"}}>
                  <div
                    className="progress-bar rounded"
                    role="progressbar"
                    style={{width: "100%"}}
                    aria-valuenow="100"
                    aria-valuemin="0"
                    aria-valuemax="100"></div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <ul className="list-unstyled d-flex align-items-center avatar-group mb-0 z-2">
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="Kim Karlos"
                        className="avatar avatar-sm pull-up">
                        <img className="rounded-circle" src="/assets/img/avatars/3.png" alt="Avatar" />
                      </li>
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="Katy Turner"
                        className="avatar avatar-sm pull-up">
                        <img className="rounded-circle" src="/assets/img/avatars/9.png" alt="Avatar" />
                      </li>
                      <li
                        data-bs-toggle="tooltip"
                        data-popup="tooltip-custom"
                        data-bs-placement="top"
                        title="Peter Adward"
                        className="avatar avatar-sm pull-up me-3">
                        <img className="rounded-circle" src="/assets/img/avatars/15.png" alt="Avatar" />
                      </li>
                      <li><small className="text-muted">16 Members</small></li>
                    </ul>
                  </div>
                  <div className="ms-auto">
                    <a href="javascript:void(0);" className="text-muted d-flex align-items-center"
                    ><i className="ri-wechat-line ri-24px me-1"></i> 16</a
                    >
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
