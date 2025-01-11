import React from 'react'

export default function page() {
  return (
    <>

      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="row g-6">


          <div className="container-xxl flex-grow-1 container-p-y">

            <div className="card shadow-lg border-0">
              <div className="card-header d-flex justify-content-between align-items-center border-bottom mb-4">
                <h4 className="card-title mb-4">All Subscriptions</h4>
                <button className="btn btn-primary">+</button>
              </div>
              <div className="card-body my-5">


                <div className="row row-cols-1 row-cols-md-3 g-4">


                  <div className="col">
                    <div className="card shadow-sm border-0 h-100">
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="card-title mb-1">John Doe</h5>
                            <span className="badge bg-label-primary me-1">Entity: Business</span>
                            <span className="badge bg-label-info">Service: Accounting</span>
                            <p className="mt-2 mb-1 text-muted">Phone: +1 234 567 890</p>
                            <p className="text-muted">Email: johndoe@example.com</p>
                          </div>
                          <i className="ri-pencil-line text-primary" role="button" title="Edit"></i>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <span className="fw-bold text-success">Amt: $500</span>
                          <small className="text-muted">Start: 01 Jan 2025</small>
                          <small className="text-muted">End: 31 Dec 2025</small>
                        </div>
                        <p className="text-muted mt-3 mb-0">Payment Date: 01 Jan 2025</p>
                      </div>
                    </div>
                  </div>


                  <div className="col">
                    <div className="card shadow-sm border-0 h-100">
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="card-title mb-1">Jane Smith</h5>
                            <span className="badge bg-label-secondary me-1">Entity: Personal</span>
                            <span className="badge bg-label-success">Service: Consulting</span>
                            <p className="mt-2 mb-1 text-muted">Phone: +1 987 654 321</p>
                            <p className="text-muted">Email: janesmith@example.com</p>
                          </div>
                          <i className="ri-pencil-line text-primary" role="button" title="Edit"></i>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <span className="fw-bold text-success">Amt: $350</span>
                          <small className="text-muted">Start: 15 Feb 2025</small>
                          <small className="text-muted">End: 15 Aug 2025</small>
                        </div>
                        <p className="text-muted mt-3 mb-0">Payment Date: 15 Feb 2025</p>
                      </div>
                    </div>
                  </div>


                  <div className="col">
                    <div className="card shadow-sm border-0 h-100">
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="card-title mb-1">Michael Lee</h5>
                            <span className="badge bg-label-warning me-1">Entity: Home</span>
                            <span className="badge bg-label-dark">Service: Maintenance</span>
                            <p className="mt-2 mb-1 text-muted">Phone: +1 555 666 777</p>
                            <p className="text-muted">Email: michaellee@example.com</p>
                          </div>
                          <i className="ri-pencil-line text-primary" role="button" title="Edit"></i>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <span className="fw-bold text-success">Amt: $275</span>
                          <small className="text-muted">Start: 05 Mar 2025</small>
                          <small className="text-muted">End: 05 Sep 2025</small>
                        </div>
                        <p className="text-muted mt-3 mb-0">Payment Date: 05 Mar 2025</p>
                      </div>
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
