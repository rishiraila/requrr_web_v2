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
                  <a className="nav-link" href="/Profile/Project"
                  ><i className="ri-computer-line me-2"></i> Projects</a
                  >
                </li>
                <li className="nav-item">
                  <a className="nav-link active" href="javascript:void(0);"
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
              <div className="card-body text-center">
                <div className="dropdown btn-pinned">
                  <button
                    type="button"
                    className="btn dropdown-toggle hide-arrow p-4"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <i className="ri-more-2-line ri-22px text-muted"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><a className="dropdown-item" href="javascript:void(0);">Share connection</a></li>
                    <li><a className="dropdown-item" href="javascript:void(0);">Block connection</a></li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li><a className="dropdown-item text-danger" href="javascript:void(0);">Delete</a></li>
                  </ul>
                </div>
                <div className="mx-auto my-6">
                  <img src="/assets/img/avatars/1.png" alt="Avatar Image" className="rounded-circle w-px-100" />
                </div>
                <h5 className="mb-0 card-title">Mark Gilbert</h5>
                <span>UI Designer</span>
                <div className="d-flex align-items-center justify-content-center my-6 gap-2">
                  <a href="javascript:;" className="me-2"
                  ><span className="badge bg-label-secondary rounded-pill">Figma</span></a
                  >
                  <a href="javascript:;"><span className="badge bg-label-warning rounded-pill">Sketch</span></a>
                </div>

                <div className="d-flex align-items-center justify-content-around mb-6">
                  <div>
                    <h5 className="mb-0">18</h5>
                    <span>Projects</span>
                  </div>
                  <div>
                    <h5 className="mb-0">834</h5>
                    <span>Tasks</span>
                  </div>
                  <div>
                    <h5 className="mb-0">129</h5>
                    <span>Connections</span>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <a href="javascript:;" className="btn btn-primary d-flex align-items-center me-4"
                  ><i className="ri-user-follow-line ri-16px me-2"></i>Connected</a
                  >
                  <a href="javascript:;" className="btn btn-outline-secondary btn-icon"
                  ><i className="ri-mail-open-line ri-22px"></i
                  ></a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="card">
              <div className="card-body text-center">
                <div className="dropdown btn-pinned">
                  <button
                    type="button"
                    className="btn dropdown-toggle hide-arrow p-4"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <i className="ri-more-2-line ri-22px text-muted"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><a className="dropdown-item" href="javascript:void(0);">Share connection</a></li>
                    <li><a className="dropdown-item" href="javascript:void(0);">Block connection</a></li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li><a className="dropdown-item text-danger" href="javascript:void(0);">Delete</a></li>
                  </ul>
                </div>
                <div className="mx-auto my-6">
                  <img src="/assets/img/avatars/8.png" alt="Avatar Image" className="rounded-circle w-px-100" />
                </div>
                <h5 className="mb-0 card-title">Eugenia Parsons</h5>
                <span>Developer</span>
                <div className="d-flex align-items-center justify-content-center my-6 gap-2">
                  <a href="javascript:;" className="me-2"
                  ><span className="badge bg-label-danger rounded-pill">Angular</span></a
                  >
                  <a href="javascript:;"><span className="badge bg-label-info rounded-pill">React</span></a>
                </div>

                <div className="d-flex align-items-center justify-content-around mb-6">
                  <div>
                    <h5 className="mb-0">112</h5>
                    <span>Projects</span>
                  </div>
                  <div>
                    <h5 className="mb-0">23.1k</h5>
                    <span>Tasks</span>
                  </div>
                  <div>
                    <h5 className="mb-0">1.28k</h5>
                    <span>Connections</span>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <a href="javascript:;" className="btn btn-outline-primary d-flex align-items-center me-4"
                  ><i className="ri-user-add-line ri-16px me-2"></i>Connect</a
                  >
                  <a href="javascript:;" className="btn btn-outline-secondary btn-icon"
                  ><i className="ri-mail-open-line ri-22px"></i
                  ></a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="card">
              <div className="card-body text-center">
                <div className="dropdown btn-pinned">
                  <button
                    type="button"
                    className="btn dropdown-toggle hide-arrow p-4"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <i className="ri-more-2-line ri-22px text-muted"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><a className="dropdown-item" href="javascript:void(0);">Share connection</a></li>
                    <li><a className="dropdown-item" href="javascript:void(0);">Block connection</a></li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li><a className="dropdown-item text-danger" href="javascript:void(0);">Delete</a></li>
                  </ul>
                </div>
                <div className="mx-auto my-6">
                  <img src="/assets/img/avatars/3.png" alt="Avatar Image" className="rounded-circle w-px-100" />
                </div>
                <h5 className="mb-0 card-title">Francis Byrd</h5>
                <span>Developer</span>
                <div className="d-flex align-items-center justify-content-center my-6 gap-2">
                  <a href="javascript:;" className="me-2"
                  ><span className="badge bg-label-info rounded-pill">React</span></a
                  >
                  <a href="javascript:;"><span className="badge bg-label-primary rounded-pill">HTML</span></a>
                </div>

                <div className="d-flex align-items-center justify-content-around mb-6">
                  <div>
                    <h5 className="mb-0">32</h5>
                    <span>Projects</span>
                  </div>
                  <div>
                    <h5 className="mb-0">1.25k</h5>
                    <span>Tasks</span>
                  </div>
                  <div>
                    <h5 className="mb-0">890</h5>
                    <span>Connections</span>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <a href="javascript:;" className="btn btn-outline-primary d-flex align-items-center me-4"
                  ><i className="ri-user-add-line ri-16px me-2"></i>Connect</a
                  >
                  <a href="javascript:;" className="btn btn-outline-secondary btn-icon"
                  ><i className="ri-mail-open-line ri-22px"></i
                  ></a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="card">
              <div className="card-body text-center">
                <div className="dropdown btn-pinned">
                  <button
                    type="button"
                    className="btn dropdown-toggle hide-arrow p-4"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <i className="ri-more-2-line ri-22px text-muted"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><a className="dropdown-item" href="javascript:void(0);">Share connection</a></li>
                    <li><a className="dropdown-item" href="javascript:void(0);">Block connection</a></li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li><a className="dropdown-item text-danger" href="javascript:void(0);">Delete</a></li>
                  </ul>
                </div>
                <div className="mx-auto my-6">
                  <img src="/assets/img/avatars/18.png" alt="Avatar Image" className="rounded-circle w-px-100" />
                </div>
                <h5 className="mb-0 card-title">Leon Lucas</h5>
                <span>UI/UX Designer</span>
                <div className="d-flex align-items-center justify-content-center my-6 gap-2">
                  <a href="javascript:;" className="me-2"
                  ><span className="badge bg-label-secondary rounded-pill">Figma</span></a
                  >
                  <a href="javascript:;" className="me-2"
                  ><span className="badge bg-label-warning rounded-pill">Sketch</span></a
                  >
                  <a href="javascript:;"><span className="badge bg-label-primary rounded-pill">Photoshop</span></a>
                </div>

                <div className="d-flex align-items-center justify-content-around mb-6">
                  <div>
                    <h5 className="mb-0">86</h5>
                    <span>Projects</span>
                  </div>
                  <div>
                    <h5 className="mb-0">12.4k</h5>
                    <span>Tasks</span>
                  </div>
                  <div>
                    <h5 className="mb-0">890</h5>
                    <span>Connections</span>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <a href="javascript:;" className="btn btn-outline-primary d-flex align-items-center me-4"
                  ><i className="ri-user-add-line ri-16px me-2"></i>Connect</a
                  >
                  <a href="javascript:;" className="btn btn-outline-secondary btn-icon"
                  ><i className="ri-mail-open-line ri-22px"></i
                  ></a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="card">
              <div className="card-body text-center">
                <div className="dropdown btn-pinned">
                  <button
                    type="button"
                    className="btn dropdown-toggle hide-arrow p-4"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <i className="ri-more-2-line ri-22px text-muted"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><a className="dropdown-item" href="javascript:void(0);">Share connection</a></li>
                    <li><a className="dropdown-item" href="javascript:void(0);">Block connection</a></li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li><a className="dropdown-item text-danger" href="javascript:void(0);">Delete</a></li>
                  </ul>
                </div>
                <div className="mx-auto my-6">
                  <img src="/assets/img/avatars/5.png" alt="Avatar Image" className="rounded-circle w-px-100" />
                </div>
                <h5 className="mb-0 card-title">Jayden Rogers</h5>
                <span>Full Stack Developer</span>
                <div className="d-flex align-items-center justify-content-center my-6 gap-2">
                  <a href="javascript:;" className="me-2"
                  ><span className="badge bg-label-info rounded-pill">React</span></a
                  >
                  <a href="javascript:;" className="me-2"
                  ><span className="badge bg-label-danger rounded-pill">Angular</span></a
                  >
                  <a href="javascript:;"><span className="badge bg-label-primary rounded-pill">HTML</span></a>
                </div>

                <div className="d-flex align-items-center justify-content-around mb-6">
                  <div>
                    <h5 className="mb-0">244</h5>
                    <span>Projects</span>
                  </div>
                  <div>
                    <h5 className="mb-0">23.8k</h5>
                    <span>Tasks</span>
                  </div>
                  <div>
                    <h5 className="mb-0">2.14k</h5>
                    <span>Connections</span>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <a href="javascript:;" className="btn btn-primary d-flex align-items-center me-4"
                  ><i className="ri-user-follow-line ri-16px me-2"></i>Connected</a
                  >
                  <a href="javascript:;" className="btn btn-outline-secondary btn-icon"
                  ><i className="ri-mail-open-line ri-22px"></i
                  ></a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6">
            <div className="card">
              <div className="card-body text-center">
                <div className="dropdown btn-pinned">
                  <button
                    type="button"
                    className="btn dropdown-toggle hide-arrow p-4"
                    data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <i className="ri-more-2-line ri-22px text-muted"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><a className="dropdown-item" href="javascript:void(0);">Share connection</a></li>
                    <li><a className="dropdown-item" href="javascript:void(0);">Block connection</a></li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li><a className="dropdown-item text-danger" href="javascript:void(0);">Delete</a></li>
                  </ul>
                </div>
                <div className="mx-auto my-6">
                  <img src="/assets/img/avatars/10.png" alt="Avatar Image" className="rounded-circle w-px-100" />
                </div>
                <h5 className="mb-0 card-title">Jeanette Powell</h5>
                <span>SEO</span>
                <div className="d-flex align-items-center justify-content-center my-6 gap-2">
                  <a href="javascript:;" className="me-2"
                  ><span className="badge bg-label-success rounded-pill">Writing</span></a
                  >
                  <a href="javascript:;"><span className="badge bg-label-secondary rounded-pill">Analysis</span></a>
                </div>

                <div className="d-flex align-items-center justify-content-around mb-6">
                  <div>
                    <h5 className="mb-0">32</h5>
                    <span>Projects</span>
                  </div>
                  <div>
                    <h5 className="mb-0">1.28k</h5>
                    <span>Tasks</span>
                  </div>
                  <div>
                    <h5 className="mb-0">1.27k</h5>
                    <span>Connections</span>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <a href="javascript:;" className="btn btn-outline-primary d-flex align-items-center me-4"
                  ><i className="ri-user-add-line ri-16px me-2"></i>Connect</a
                  >
                  <a href="javascript:;" className="btn btn-outline-secondary btn-icon"
                  ><i className="ri-mail-open-line ri-22px"></i
                  ></a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
