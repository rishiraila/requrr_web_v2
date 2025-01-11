import React from 'react'

export default function page() {
  return (
    <>

      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="row g-6">


          <div className="col-xxl-8 col-md-10">
            <div className="card h-100">
              <div className="card-header d-flex align-items-center justify-content-between border-bottom mb-4">
                <h5 className="card-title m-0 me-2">List of Services</h5>
                <div className="d-flex align-items-center">
                  <div>
                    <button className="btn btn-primary">+</button>
                  </div>
                  <div className="dropdown">
                    <button className="btn btn-text-secondary rounded-pill text-muted border-0 p-1" type="button"
                      id="meetingSchedule" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i className="ri-more-2-line ri-20px"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="meetingSchedule">
                      <a className="dropdown-item" href="javascript:void(0);">Last 28 Days</a>
                      <a className="dropdown-item" href="javascript:void(0);">Last Month</a>
                      <a className="dropdown-item" href="javascript:void(0);">Last Year</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <ul className="p-0 m-0">
                  <li className="d-flex align-items-center mb-6 border-0 rounded-3 shadow-sm mb-2 py-5 px-5 ">
                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2 ">
                      <div className="me-2">
                        <h6 className="mb-0">Domain + Hosting SSL</h6>
                        <small className="d-flex align-items-center">
                          <span>Lorem ipsum dolor sit, amet consectetur adipisicing elit</span>
                        </small>
                        <small className="text-muted">Default Duration: 1 Year</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="badge bg-label-primary rounded-pill me-2">Business</div>
                        <i className="ri-pencil-line text-primary" role="button" title="Edit"></i>
                      </div>
                    </div>
                  </li>

                  <li className="d-flex align-items-center mb-6 border-0 rounded-3 shadow-sm mb-2 py-5 px-5">
                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div className="me-2">
                        <h6 className="mb-0">Bike Insurance</h6>
                        <small className="d-flex align-items-center">
                          <span>Lorem ipsum dolor sit, amet consectetur adipisicing elit</span>
                        </small>
                        <small className="text-muted">Default Duration: 16 Months</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="badge bg-label-warning rounded-pill me-2">Personal</div>
                        <i className="ri-pencil-line text-primary" role="button" title="Edit"></i>
                      </div>
                    </div>
                  </li>

                  <li className="d-flex align-items-center mb-6 border-0 rounded-3 shadow-sm mb-2 py-5 px-5">
                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div className="me-2">
                        <h6 className="mb-0">Office Rent</h6>
                        <small className="d-flex align-items-center">
                          <span>Lorem ipsum dolor sit, amet consectetur adipisicing elit</span>
                        </small>
                        <small className="text-muted">Default Duration: 1 Year</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="badge bg-label-secondary rounded-pill me-2">Office</div>
                        <i className="ri-pencil-line text-primary" role="button" title="Edit"></i>
                      </div>
                    </div>
                  </li>

                  <li className="d-flex align-items-center mb-6 border-0 rounded-3 shadow-sm mb-2 py-5 px-5">
                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div className="me-2">
                        <h6 className="mb-0">Flat Rent</h6>
                        <small className="d-flex align-items-center">
                          <span>Lorem ipsum dolor sit, amet consectetur adipisicing elit</span>
                        </small>
                        <small className="text-muted">Default Duration: 2 Years</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="badge bg-label-danger rounded-pill me-2">House</div>
                        <i className="ri-pencil-line text-primary" role="button" title="Edit"></i>
                      </div>
                    </div>
                  </li>

                  <li className="d-flex align-items-center mb-6 border-0 rounded-3 shadow-sm mb-2 py-5 px-5">
                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div className="me-2">
                        <h6 className="mb-0">Employee Salaries</h6>
                        <small className="d-flex align-items-center">
                          <span>Lorem ipsum dolor sit, amet consectetur adipisicing elit</span>
                        </small>
                        <small className="text-muted">Default Duration: Monthly</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="badge bg-label-primary rounded-pill me-2">Business</div>
                        <i className="ri-pencil-line text-primary" role="button" title="Edit"></i>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>



          <div className="col-12 col-xxl-4 col-md-6">
            <div className="card h-100 shadow-lg border-0">
              <div className="card-header d-flex justify-content-between align-items-center border-bottom">
                <h5 className="mb-0">Service Ratio with Entity</h5>
                <div className="dropdown">
                  <button className="btn btn-text-white rounded-pill border-0 p-1" type="button"
                    id="salesCountryDropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i className="ri-more-2-line ri-20px"></i>
                  </button>
                  <div className="dropdown-menu dropdown-menu-end" aria-labelledby="salesCountryDropdown">
                    <a className="dropdown-item" href="javascript:void(0);">Last 28 Days</a>
                    <a className="dropdown-item" href="javascript:void(0);">Last Month</a>
                    <a className="dropdown-item" href="javascript:void(0);">Last Year</a>
                  </div>
                </div>
              </div>
              <div className="card-body pb-1 px-0">

                <div className="px-3 mt-4">
                  <ul className="list-group">
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 rounded-3 shadow-sm mb-2 py-5">
                      <div className="d-flex align-items-center">
                        <i className="ri-user-3-line ri-24px text-primary me-3"></i>
                        <span>Personal</span>
                      </div>
                      <span className="badge bg-label-primary rounded-pill text-dark">24 Services</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 rounded-3 shadow-sm mb-2 py-5">
                      <div className="d-flex align-items-center">
                        <i className="ri-briefcase-4-line ri-24px text-success me-3"></i>
                        <span>Business</span>
                      </div>
                      <span className="badge bg-label-success rounded-pill text-dark">18 Services</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 rounded-3 shadow-sm mb-2 py-5">
                      <div className="d-flex align-items-center">
                        <i className="ri-home-5-line ri-24px text-warning me-3"></i>
                        <span>Home</span>
                      </div>
                      <span className="badge bg-label-warning rounded-pill text-dark">12 Services</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center border-0 rounded-3 shadow-sm mb-2 py-5">
                      <div className="d-flex align-items-center">
                        <i className="ri-building-4-line ri-24px text-secondary me-3"></i>
                        <span>Office</span>
                      </div>
                      <span className="badge bg-label-secondary rounded-pill text-dark">30 Services</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>



        </div>
      </div>

    </>
  )
}
