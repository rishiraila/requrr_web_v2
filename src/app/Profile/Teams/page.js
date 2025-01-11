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
                        <a className="nav-link" href="/Profile/User"
                          ><i className="ri-user-3-line me-2"></i>Profile</a
                        >
                      </li>
                      <li className="nav-item">
                        <a className="nav-link active" href="javascript:void(0);"><i className="ri-team-line me-2"></i>Teams</a>
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
              


              <div className="row g-6">
                <div className="col-xl-4 col-lg-6 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <a href="javascript:;" className="d-flex align-items-center">
                          <div className="avatar me-2">
                            <img
                              src="/assets/img/icons/brands/react-label.png"
                              alt="Avatar"
                              className="rounded-circle" />
                          </div>
                          <div className="me-2 text-heading h5 mb-0">React Developers</div>
                        </a>
                        <div className="ms-auto">
                          <ul className="list-inline mb-0 d-flex align-items-center">
                            <li className="list-inline-item me-1">
                              <a
                                href="javascript:void(0);"
                                className="d-flex align-self-center btn btn-text-secondary btn-icon rounded-pill"
                                ><i className="ri-star-line ri-22px text-muted"></i
                              ></a>
                            </li>
                            <li className="list-inline-item">
                              <div className="dropdown">
                                <button
                                  type="button"
                                  className="btn btn-text-secondary btn-icon rounded-pill dropdown-toggle hide-arrow p-0"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false">
                                  <i className="ri-more-2-line ri-22px text-muted"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                  <li><a className="dropdown-item" href="javascript:void(0);">Rename Team</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">View Details</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Add to favorites</a></li>
                                  <li>
                                    <hr className="dropdown-divider" />
                                  </li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Delete Team</a></li>
                                </ul>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <p>
                        We don’t make assumptions about the rest of your technology stack, so you can develop new
                        features...
                      </p>
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                          <ul className="list-unstyled d-flex align-items-center avatar-group mb-0">
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
                              className="avatar avatar-sm pull-up">
                              <img className="rounded-circle" src="/assets/img/avatars/6.png" alt="Avatar" />
                            </li>
                            <li className="avatar avatar-sm">
                              <span
                                className="avatar-initial rounded-circle pull-up text-heading"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="9 more"
                                >+9</span
                              >
                            </li>
                          </ul>
                        </div>
                        <div className="ms-auto">
                          <a href="javascript:;" className="me-1"
                            ><span className="badge bg-label-primary rounded-pill">React</span></a
                          >
                          <a href="javascript:;"><span className="badge bg-label-info rounded-pill">MUI</span></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <a href="javascript:;" className="d-flex align-items-center">
                          <div className="avatar me-2">
                            <img
                              src="/assets/img/icons/brands/vue-label.png"
                              alt="Avatar"
                              className="rounded-circle" />
                          </div>
                          <div className="me-2 text-heading h5 mb-0">Vue.js Dev Team</div>
                        </a>
                        <div className="ms-auto">
                          <ul className="list-inline mb-0 d-flex align-items-center">
                            <li className="list-inline-item me-1">
                              <a
                                href="javascript:void(0);"
                                className="d-flex align-self-center btn btn-text-secondary btn-icon rounded-pill"
                                ><i className="ri-star-line ri-22px text-muted"></i
                              ></a>
                            </li>
                            <li className="list-inline-item">
                              <div className="dropdown">
                                <button
                                  type="button"
                                  className="btn btn-text-secondary btn-icon rounded-pill dropdown-toggle hide-arrow p-0"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false">
                                  <i className="ri-more-2-line ri-22px text-muted"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                  <li><a className="dropdown-item" href="javascript:void(0);">Rename Team</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">View Details</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Add to favorites</a></li>
                                  <li>
                                    <hr className="dropdown-divider" />
                                  </li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Delete Team</a></li>
                                </ul>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <p>
                        The development of Vue and its ecosystem is guided by an international team, some of whom have
                        chosen.
                      </p>
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                          <ul className="list-unstyled d-flex align-items-center avatar-group mb-0">
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
                              className="avatar avatar-sm pull-up">
                              <img className="rounded-circle" src="/assets/img/avatars/16.png" alt="Avatar" />
                            </li>
                            <li className="avatar avatar-sm">
                              <span
                                className="avatar-initial rounded-circle pull-up text-heading"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="14 more"
                                >+4</span
                              >
                            </li>
                          </ul>
                        </div>
                        <div className="ms-auto">
                          <a href="javascript:;" className="me-2"
                            ><span className="badge bg-label-success rounded-pill">Vuejs</span></a
                          >
                          <a href="javascript:;"><span className="badge bg-label-danger rounded-pill">Developer</span></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <a href="javascript:;" className="d-flex align-items-center">
                          <div className="avatar me-2">
                            <img src="/assets/img/icons/brands/xd-label.png" alt="Avatar" className="rounded-circle" />
                          </div>
                          <div className="me-2 text-heading h5 mb-0">Creative Designers</div>
                        </a>
                        <div className="ms-auto">
                          <ul className="list-inline mb-0 d-flex align-items-center">
                            <li className="list-inline-item me-1">
                              <a
                                href="javascript:void(0);"
                                className="d-flex align-self-center btn btn-text-secondary btn-icon rounded-pill"
                                ><i className="ri-star-line ri-22px text-muted"></i
                              ></a>
                            </li>
                            <li className="list-inline-item">
                              <div className="dropdown">
                                <button
                                  type="button"
                                  className="btn btn-text-secondary btn-icon rounded-pill dropdown-toggle hide-arrow p-0"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false">
                                  <i className="ri-more-2-line ri-22px text-muted"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                  <li><a className="dropdown-item" href="javascript:void(0);">Rename Team</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">View Details</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Add to favorites</a></li>
                                  <li>
                                    <hr className="dropdown-divider" />
                                  </li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Delete Team</a></li>
                                </ul>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <p>
                        A design or product team is more than just the people on it. A team includes the people, the
                        roles they play.
                      </p>
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                          <ul className="list-unstyled d-flex align-items-center avatar-group mb-0">
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
                              className="avatar avatar-sm pull-up">
                              <img className="rounded-circle" src="/assets/img/avatars/7.png" alt="Avatar" />
                            </li>
                            <li className="avatar avatar-sm">
                              <span
                                className="avatar-initial rounded-circle pull-up bg-lighter text-body"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="19 more"
                                >+9</span
                              >
                            </li>
                          </ul>
                        </div>
                        <div className="ms-auto">
                          <a href="javascript:;" className="me-1"
                            ><span className="badge bg-label-warning rounded-pill">Sketch</span></a
                          >
                          <a href="javascript:;"><span className="badge bg-label-danger rounded-pill">XD</span></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <a href="javascript:;" className="d-flex align-items-center">
                          <div className="avatar me-2">
                            <img
                              src="/assets/img/icons/brands/support-label.png"
                              alt="Avatar"
                              className="rounded-circle" />
                          </div>
                          <div className="me-2 text-heading h5 mb-0">Support Team</div>
                        </a>
                        <div className="ms-auto">
                          <ul className="list-inline mb-0 d-flex align-items-center">
                            <li className="list-inline-item me-1">
                              <a
                                href="javascript:void(0);"
                                className="d-flex align-self-center btn btn-text-secondary btn-icon rounded-pill"
                                ><i className="ri-star-line ri-22px text-muted"></i
                              ></a>
                            </li>
                            <li className="list-inline-item">
                              <div className="dropdown">
                                <button
                                  type="button"
                                  className="btn btn-text-secondary btn-icon rounded-pill dropdown-toggle hide-arrow p-0"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false">
                                  <i className="ri-more-2-line ri-22px text-muted"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                  <li><a className="dropdown-item" href="javascript:void(0);">Rename Team</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">View Details</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Add to favorites</a></li>
                                  <li>
                                    <hr className="dropdown-divider" />
                                  </li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Delete Team</a></li>
                                </ul>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <p>
                        Support your team. Your customer support team is fielding the good, the bad, and the ugly day in
                        out.
                      </p>
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                          <ul className="list-unstyled d-flex align-items-center avatar-group mb-0">
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
                              className="avatar avatar-sm pull-up">
                              <img className="rounded-circle" src="/assets/img/avatars/12.png" alt="Avatar" />
                            </li>
                            <li className="avatar avatar-sm">
                              <span
                                className="avatar-initial rounded-circle pull-up bg-lighter text-body"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="14 more"
                                >+2</span
                              >
                            </li>
                          </ul>
                        </div>
                        <div className="ms-auto">
                          <a href="javascript:;"><span className="badge bg-label-info rounded-pill">Zendesk</span></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <a href="javascript:;" className="d-flex align-items-center">
                          <div className="avatar me-2">
                            <img
                              src="/assets/img/icons/brands/social-label.png"
                              alt="Avatar"
                              className="rounded-circle" />
                          </div>
                          <div className="me-2 text-heading h5 mb-0">Digital Marketing</div>
                        </a>
                        <div className="ms-auto">
                          <ul className="list-inline mb-0 d-flex align-items-center">
                            <li className="list-inline-item me-1">
                              <a
                                href="javascript:void(0);"
                                className="d-flex align-self-center btn btn-text-secondary btn-icon rounded-pill"
                                ><i className="ri-star-line ri-22px text-muted"></i
                              ></a>
                            </li>
                            <li className="list-inline-item">
                              <div className="dropdown">
                                <button
                                  type="button"
                                  className="btn btn-text-secondary btn-icon rounded-pill dropdown-toggle hide-arrow p-0"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false">
                                  <i className="ri-more-2-line ri-22px text-muted"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                  <li><a className="dropdown-item" href="javascript:void(0);">Rename Team</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">View Details</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Add to favorites</a></li>
                                  <li>
                                    <hr className="dropdown-divider" />
                                  </li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Delete Team</a></li>
                                </ul>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <p>
                        Digital marketing refers to advertising delivered through digital channels such as search
                        engines, websites…
                      </p>
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                          <ul className="list-unstyled d-flex align-items-center avatar-group mb-0">
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
                              className="avatar avatar-sm pull-up">
                              <img className="rounded-circle" src="/assets/img/avatars/15.png" alt="Avatar" />
                            </li>
                            <li className="avatar avatar-sm">
                              <span
                                className="avatar-initial rounded-circle pull-up text-heading"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="7 more"
                                >+7</span
                              >
                            </li>
                          </ul>
                        </div>
                        <div className="ms-auto">
                          <a href="javascript:;" className="me-1"
                            ><span className="badge bg-label-primary rounded-pill">Twitter</span></a
                          >
                          <a href="javascript:;"><span className="badge bg-label-success rounded-pill">Email</span></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <a href="javascript:;" className="d-flex align-items-center">
                          <div className="avatar me-2">
                            <img
                              src="/assets/img/icons/brands/event-label.png"
                              alt="Avatar"
                              className="rounded-circle" />
                          </div>
                          <div className="me-2 text-heading h5 mb-0">Event</div>
                        </a>
                        <div className="ms-auto">
                          <ul className="list-inline mb-0 d-flex align-items-center">
                            <li className="list-inline-item me-1">
                              <a
                                href="javascript:void(0);"
                                className="d-flex align-self-center btn btn-text-secondary btn-icon rounded-pill"
                                ><i className="ri-star-line ri-22px text-muted"></i
                              ></a>
                            </li>
                            <li className="list-inline-item">
                              <div className="dropdown">
                                <button
                                  type="button"
                                  className="btn btn-text-secondary btn-icon rounded-pill dropdown-toggle hide-arrow p-0"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false">
                                  <i className="ri-more-2-line ri-22px text-muted"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                  <li><a className="dropdown-item" href="javascript:void(0);">Rename Team</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">View Details</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Add to favorites</a></li>
                                  <li>
                                    <hr className="dropdown-divider" />
                                  </li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Delete Team</a></li>
                                </ul>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <p>
                        Event is defined as a particular contest which is part of a program of contests. An example of
                        an event is...
                      </p>
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                          <ul className="list-unstyled d-flex align-items-center avatar-group mb-0">
                            <li
                              data-bs-toggle="tooltip"
                              data-popup="tooltip-custom"
                              data-bs-placement="top"
                              title="Vinnie Mostowy"
                              className="avatar avatar-sm pull-up">
                              <img className="rounded-circle" src="/assets/img/avatars/17.png" alt="Avatar" />
                            </li>
                            <li
                              data-bs-toggle="tooltip"
                              data-popup="tooltip-custom"
                              data-bs-placement="top"
                              title="Allen Rieske"
                              className="avatar avatar-sm pull-up">
                              <img className="rounded-circle" src="/assets/img/avatars/8.png" alt="Avatar" />
                            </li>
                            <li
                              data-bs-toggle="tooltip"
                              data-popup="tooltip-custom"
                              data-bs-placement="top"
                              title="Julee Rossignol"
                              className="avatar avatar-sm pull-up">
                              <img className="rounded-circle" src="/assets/img/avatars/7.png" alt="Avatar" />
                            </li>
                            <li className="avatar avatar-sm">
                              <span
                                className="avatar-initial rounded-circle pull-up text-heading"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="2 more"
                                >+2</span
                              >
                            </li>
                          </ul>
                        </div>
                        <div className="ms-auto">
                          <a href="javascript:;"><span className="badge bg-label-success rounded-pill">Hubilo</span></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <a href="javascript:;" className="d-flex align-items-center">
                          <div className="avatar me-2">
                            <img
                              src="/assets/img/icons/brands/figma-label.png"
                              alt="Avatar"
                              className="rounded-circle" />
                          </div>
                          <div className="me-2 text-heading h5 mb-0">Figma Resources</div>
                        </a>
                        <div className="ms-auto">
                          <ul className="list-inline mb-0 d-flex align-items-center">
                            <li className="list-inline-item me-1">
                              <a
                                href="javascript:void(0);"
                                className="d-flex align-self-center btn btn-text-secondary btn-icon rounded-pill"
                                ><i className="ri-star-line ri-22px text-muted"></i
                              ></a>
                            </li>
                            <li className="list-inline-item">
                              <div className="dropdown">
                                <button
                                  type="button"
                                  className="btn btn-text-secondary btn-icon rounded-pill dropdown-toggle hide-arrow p-0"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false">
                                  <i className="ri-more-2-line ri-22px text-muted"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                  <li><a className="dropdown-item" href="javascript:void(0);">Rename Team</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">View Details</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Add to favorites</a></li>
                                  <li>
                                    <hr className="dropdown-divider" />
                                  </li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Delete Team</a></li>
                                </ul>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <p>
                        Explore, install, use, and remix thousands of plugins and files published to the Figma Community
                        by designers.
                      </p>
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                          <ul className="list-unstyled d-flex align-items-center avatar-group mb-0">
                            <li
                              data-bs-toggle="tooltip"
                              data-popup="tooltip-custom"
                              data-bs-placement="top"
                              title="Andrew Mostowy"
                              className="avatar avatar-sm pull-up">
                              <img className="rounded-circle" src="/assets/img/avatars/15.png" alt="Avatar" />
                            </li>
                            <li
                              data-bs-toggle="tooltip"
                              data-popup="tooltip-custom"
                              data-bs-placement="top"
                              title="Micky Ressula"
                              className="avatar avatar-sm pull-up">
                              <img className="rounded-circle" src="/assets/img/avatars/1.png" alt="Avatar" />
                            </li>
                            <li
                              data-bs-toggle="tooltip"
                              data-popup="tooltip-custom"
                              data-bs-placement="top"
                              title="Michel Pal"
                              className="avatar avatar-sm pull-up">
                              <img className="rounded-circle" src="/assets/img/avatars/16.png" alt="Avatar" />
                            </li>
                            <li className="avatar avatar-sm">
                              <span
                                className="avatar-initial rounded-circle pull-up bg-lighter text-body"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="22 more"
                                >+3</span
                              >
                            </li>
                          </ul>
                        </div>
                        <div className="ms-auto">
                          <a href="javascript:;" className="me-1"
                            ><span className="badge bg-label-success rounded-pill">UI/UX</span></a
                          >
                          <a href="javascript:;"><span className="badge bg-label-secondary rounded-pill">Figma</span></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <a href="javascript:;" className="d-flex align-items-center">
                          <div className="avatar me-2">
                            <img
                              src="/assets/img/icons/brands/react-label.png"
                              alt="Avatar"
                              className="rounded-circle" />
                          </div>
                          <div className="me-2 text-heading h5 mb-0">Native Mobile App</div>
                        </a>
                        <div className="ms-auto">
                          <ul className="list-inline mb-0 d-flex align-items-center">
                            <li className="list-inline-item me-1">
                              <a
                                href="javascript:void(0);"
                                className="d-flex align-self-center btn btn-text-secondary btn-icon rounded-pill"
                                ><i className="ri-star-line ri-22px text-muted"></i
                              ></a>
                            </li>
                            <li className="list-inline-item">
                              <div className="dropdown">
                                <button
                                  type="button"
                                  className="btn btn-text-secondary btn-icon rounded-pill dropdown-toggle hide-arrow p-0"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false">
                                  <i className="ri-more-2-line ri-22px text-muted"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                  <li><a className="dropdown-item" href="javascript:void(0);">Rename Team</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">View Details</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Add to favorites</a></li>
                                  <li>
                                    <hr className="dropdown-divider" />
                                  </li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Delete Team</a></li>
                                </ul>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <p className="mb-3 pb-1">
                        React Native lets you create truly native apps and doesn't compromise your users'
                        experiences....
                      </p>
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                          <ul className="list-unstyled d-flex align-items-center avatar-group mb-0">
                            <li
                              data-bs-toggle="tooltip"
                              data-popup="tooltip-custom"
                              data-bs-placement="top"
                              title="Vinnie Mostowy"
                              className="avatar avatar-sm pull-up">
                              <img className="rounded-circle" src="/assets/img/avatars/1.png" alt="Avatar" />
                            </li>
                            <li
                              data-bs-toggle="tooltip"
                              data-popup="tooltip-custom"
                              data-bs-placement="top"
                              title="Allen Rieske"
                              className="avatar avatar-sm pull-up">
                              <img className="rounded-circle" src="/assets/img/avatars/5.png" alt="Avatar" />
                            </li>
                            <li
                              data-bs-toggle="tooltip"
                              data-popup="tooltip-custom"
                              data-bs-placement="top"
                              title="Julee Rossignol"
                              className="avatar avatar-sm pull-up">
                              <img className="rounded-circle" src="/assets/img/avatars/12.png" alt="Avatar" />
                            </li>
                          </ul>
                        </div>
                        <div className="ms-auto">
                          <a href="javascript:;" className="me-1"
                            ><span className="badge bg-label-primary rounded-pill">React</span></a
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-4">
                        <a href="javascript:;" className="d-flex align-items-center">
                          <div className="avatar me-2">
                            <img
                              src="/assets/img/icons/brands/html-label.png"
                              alt="Avatar"
                              className="rounded-circle" />
                          </div>
                          <div className="me-2 text-heading h5 mb-0">Only Beginners</div>
                        </a>
                        <div className="ms-auto">
                          <ul className="list-inline mb-0 d-flex align-items-center">
                            <li className="list-inline-item me-1">
                              <a
                                href="javascript:void(0);"
                                className="d-flex align-self-center btn btn-text-secondary btn-icon rounded-pill"
                                ><i className="ri-star-line ri-22px text-muted"></i
                              ></a>
                            </li>
                            <li className="list-inline-item">
                              <div className="dropdown">
                                <button
                                  type="button"
                                  className="btn btn-text-secondary btn-icon rounded-pill dropdown-toggle hide-arrow p-0"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false">
                                  <i className="ri-more-2-line ri-22px text-muted"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                  <li><a className="dropdown-item" href="javascript:void(0);">Rename Team</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">View Details</a></li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Add to favorites</a></li>
                                  <li>
                                    <hr className="dropdown-divider" />
                                  </li>
                                  <li><a className="dropdown-item" href="javascript:void(0);">Delete Team</a></li>
                                </ul>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <p>Learn the basics of how websites work, front-end vs back-end, and using a code editor.</p>
                      <div className="d-flex align-items-center">
                        <div className="d-flex align-items-center">
                          <ul className="list-unstyled d-flex align-items-center avatar-group mb-0">
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
                              className="avatar avatar-sm pull-up">
                              <img className="rounded-circle" src="/assets/img/avatars/15.png" alt="Avatar" />
                            </li>
                            <li className="avatar avatar-sm">
                              <span
                                className="avatar-initial rounded-circle pull-up text-heading"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="8 more"
                                >+8</span
                              >
                            </li>
                          </ul>
                        </div>
                        <div className="ms-auto">
                          <a href="javascript:;" className="me-1"
                            ><span className="badge bg-label-info rounded-pill">CSS</span></a
                          >
                          <a href="javascript:;"><span className="badge bg-label-warning rounded-pill">HTML</span></a>
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
