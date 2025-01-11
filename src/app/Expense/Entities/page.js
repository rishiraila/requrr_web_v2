import React from 'react'

export default function page() {
  return (
    <>

      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="row g-6">


          <div className="col-12 col-xxl-8">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title mb-1">Top Entities</h5>
                  <p className="card-subtitle mb-0">Number of entities you mostly use</p>
                </div>
                <div className="dropdown">
                  <button className="btn btn-text-secondary rounded-pill text-muted border-0 p-1" type="button"
                    id="entityDropdownId" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i className="ri-more-2-line ri-20px"></i>
                  </button>
                  <div className="dropdown-menu dropdown-menu-end" aria-labelledby="entityDropdownId">
                    <a className="dropdown-item" href="javascript:void(0);">View More</a>
                    <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                  </div>
                </div>
              </div>

              <div className="card-body">

                <div className="card mb-3">
                  <div className="card-body">
                    <h6 className="card-title">Personal</h6>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus numquam asperiores quasi reprehenderit error quis inventore ipsa, aut minus officiis illum doloribus accusantium consectetur esse est nulla sunt cupiditate.
                    </p>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary">Edit</button>
                      <button className="btn btn-sm btn-outline-danger">Delete</button>
                    </div>
                  </div>
                </div>



                <div className="card mb-3">
                  <div className="card-body">
                    <h6 className="card-title">Office</h6>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus numquam asperiores quasi reprehenderit error quis inventore ipsa, aut minus officiis illum doloribus accusantium consectetur esse est nulla sunt cupiditate.
                    </p>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary">Edit</button>
                      <button className="btn btn-sm btn-outline-danger">Delete</button>
                    </div>
                  </div>
                </div>



                <div className="card mb-3">
                  <div className="card-body">
                    <h6 className="card-title">Business</h6>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus numquam asperiores quasi reprehenderit error quis inventore ipsa, aut minus officiis illum doloribus accusantium consectetur esse est nulla sunt cupiditate.
                    </p>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary">Edit</button>
                      <button className="btn btn-sm btn-outline-danger">Delete</button>
                    </div>
                  </div>
                </div>



                <div className="card mb-3">
                  <div className="card-body">
                    <h6 className="card-title">House</h6>
                    <p className="card-text">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus numquam asperiores quasi reprehenderit error quis inventore ipsa, aut minus officiis illum doloribus accusantium consectetur esse est nulla sunt cupiditate.
                    </p>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary">Edit</button>
                      <button className="btn btn-sm btn-outline-danger">Delete</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>



          <div className="col-md-6 col-xxl-4">
            <div className="card h-100">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h5 className="card-title m-0 me-2">Entity Statistics</h5>
                <div className="dropdown">
                  <button className="btn btn-text-secondary rounded-pill text-muted border-0 p-1" type="button"
                    id="projectStatus" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i className="ri-more-2-line ri-20px"></i>
                  </button>
                  <div className="dropdown-menu dropdown-menu-end" aria-labelledby="projectStatus">
                    <a className="dropdown-item" href="javascript:void(0);">Last 28 Days</a>
                    <a className="dropdown-item" href="javascript:void(0);">Last Month</a>
                    <a className="dropdown-item" href="javascript:void(0);">Last Year</a>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between p-4 border-bottom">
                <p className="mb-0 fs-xsmall">NAME</p>
                <p className="mb-0 fs-xsmall">Approx. Services</p>
              </div>
              <div className="card-body">
                <ul className="p-0 m-0">
                  <li className="d-flex align-items-center mb-6">
                    <div className="avatar avatar-md flex-shrink-0 me-4">
                      <div className="avatar-initial bg-light-gray rounded-3">
                        <div>
                          <img src="../../assets/img/icons/misc/3d-illustration.png" alt="User" className="h-25" />
                        </div>
                      </div>
                    </div>
                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div className="me-2">
                        <h6 className="mb-1">Personal</h6>
                        <small>Personal Expenses</small>
                      </div>
                      <div className="badge bg-label-primary rounded-pill">6</div>
                    </div>
                  </li>
                  <li className="d-flex align-items-center mb-6">
                    <div className="avatar avatar-md flex-shrink-0 me-4">
                      <div className="avatar-initial bg-light-gray rounded-3">
                        <div>
                          <img src="../../assets/img/icons/misc/finance-app-design.png" alt="User" className="h-25" />
                        </div>
                      </div>
                    </div>
                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div className="me-2">
                        <h6 className="mb-1">Office </h6>
                        <small>Expense related to work place</small>
                      </div>
                      <div className="badge bg-label-primary rounded-pill">4</div>
                    </div>
                  </li>
                  <li className="d-flex align-items-center mb-6">
                    <div className="avatar avatar-md flex-shrink-0 me-4">
                      <div className="avatar-initial bg-light-gray rounded-3">
                        <div>
                          <img src="../../assets/img/icons/misc/4-square.png" alt="User" className="h-25" />
                        </div>
                      </div>
                    </div>
                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div className="me-2">
                        <h6 className="mb-1">Business</h6>
                        <small>Expense form business</small>
                      </div>
                      <div className="badge bg-label-primary rounded-pill">14</div>
                    </div>
                  </li>
                  <li className="d-flex align-items-center mb-6">
                    <div className="avatar avatar-md flex-shrink-0 me-4">
                      <div className="avatar-initial bg-light-gray rounded-3">
                        <div>
                          <img src="../../assets/img/icons/misc/delta-web-app.png" alt="User" className="h-25" />
                        </div>
                      </div>
                    </div>
                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div className="me-2">
                        <h6 className="mb-1">House</h6>
                        <small>House hold expense </small>
                      </div>
                      <div className="badge bg-label-primary rounded-pill">12</div>
                    </div>
                  </li>

                </ul>
              </div>
            </div>
          </div>








        </div>
      </div>

    </>
  )
}
