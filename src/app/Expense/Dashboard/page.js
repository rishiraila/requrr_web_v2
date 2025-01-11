import React from 'react'

export default function page() {
  return (
    <>


      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="row g-6">

          <div className="col-md-12 col-xxl-8">
            <div className="card">
              <div className="d-flex align-items-end row">
                <div className="col-md-6 order-2 order-md-1">
                  <div className="card-body">
                    <h4 className="card-title mb-4">Congratulations <span className="fw-bold">John!</span> 🎉</h4>
                    <p className="mb-0">You have done 68% 😎 more sales today.</p>
                    <p>Check your new badge in your profile.</p>
                    <a href="javascript:;" className="btn btn-primary">View Profile</a>
                  </div>
                </div>
                <div className="col-md-6 text-center text-md-end order-1 order-md-2">
                  <div className="card-body pb-0 px-0 pt-2">
                    <img
                      // src="../../assets/img/illustrations/illustration-john-light.png"
                      height="186"
                      className="scaleX-n1-rtl"
                      alt="View Profile"
                      data-app-light-img="illustrations/illustration-john-light.png"
                      data-app-dark-img="illustrations/illustration-john-dark.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="col-xxl-2 col-sm-6">
            <div className="card h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div className="avatar">
                    <div className="avatar-initial bg-label-primary rounded-3">
                      <i className="ri-shopping-cart-2-line ri-24px"></i>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <p className="mb-0 text-success me-1">+22%</p>
                    <i className="ri-arrow-up-s-line text-success"></i>
                  </div>
                </div>
                <div className="card-info mt-5">
                  <h5 className="mb-1">155k</h5>
                  <p>Total Orders</p>
                  <div className="badge bg-label-secondary rounded-pill">Last 4 Month</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>


    </>
  )
}
