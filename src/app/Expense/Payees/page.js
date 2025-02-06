'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios';

export default function page() {

  const [payees, setPayees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPayee, setNewPayee] = useState({ name: '', phone: '', email: '', entity: '', service: '' });

  useEffect(() => {
    fetchPayees();
  }, []);

  const fetchPayees = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:3000/api/Payees', {
        headers: { Authorization: token }, // Send token in header
      }); // Replace with actual API
      setPayees(response.data);
    } catch (error) {
      console.error('Error fetching payees:', error);
    }
  };

  const addPayee = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Sending Payload:", newPayee);
      await axios.post('http://localhost:3000/api/Payees', newPayee, {
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
      });
      setShowModal(false);
      fetchPayees(); // Refresh list after adding
    } catch (error) {
      console.error('Error adding payee:', error);
    }
  };

  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="row g-6">
          <div className="col-xxl-8 col-md-8">
            <div className="card h-100 shadow-lg border-0">
              <div className="card-header d-flex align-items-center justify-content-between border-bottom mb-4">
                <h5 className="card-title m-0 me-2">Payee Details</h5>
                <div className="d-flex align-items-center">
                  <button className="btn btn-primary rounded-pill me-2" onClick={() => setShowModal(true)}>+</button>
                  <div className="dropdown">
                    <button className="btn btn-text-secondary rounded-pill text-muted border-0 p-1" type="button" id="payeeMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i className="ri-more-2-line ri-20px"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="payeeMenu">
                      <a className="dropdown-item" href="javascript:void(0);">Last 28 Days</a>
                      <a className="dropdown-item" href="javascript:void(0);">Last Month</a>
                      <a className="dropdown-item" href="javascript:void(0);">Last Year</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="card-body">
                <ul className="p-0 m-0">

                  <li className="d-flex align-items-center mb-6 border-0 rounded-3 shadow-sm mb-2 py-5 px-5">
                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div className="me-2">
                        <h6 className="mb-0">John Doe</h6>
                        <small className="d-flex align-items-center">Phone: +1 234 567 890</small>
                        <small className="d-flex align-items-center">Email: johndoe@example.com</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="badge bg-label-primary rounded-pill me-2">Entity: Business</div>
                        <div className="badge bg-label-success rounded-pill me-2">Service: Accounting</div>
                        <i className="ri-pencil-line text-primary" role="button" title="Edit"></i>
                      </div>
                    </div>
                  </li>


                  <li className="d-flex align-items-center mb-6 border-0 rounded-3 shadow-sm mb-2 py-5 px-5">
                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div className="me-2">
                        <h6 className="mb-0">Jane Smith</h6>
                        <small className="d-flex align-items-center">Phone: +1 987 654 321</small>
                        <small className="d-flex align-items-center">Email: janesmith@example.com</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="badge bg-label-secondary rounded-pill me-2">Entity: Personal</div>
                        <div className="badge bg-label-info rounded-pill me-2">Service: Consulting</div>
                        <i className="ri-pencil-line text-primary" role="button" title="Edit"></i>
                      </div>
                    </div>
                  </li>


                  <li className="d-flex align-items-center mb-6 border-0 rounded-3 shadow-sm mb-2 py-5 px-5">
                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                      <div className="me-2">
                        <h6 className="mb-0">Michael Lee</h6>
                        <small className="d-flex align-items-center">Phone: +1 555 666 777</small>
                        <small className="d-flex align-items-center">Email: michaellee@example.com</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="badge bg-label-warning rounded-pill me-2">Entity: Home</div>
                        <div className="badge bg-label-dark rounded-pill me-2">Service: Maintenance</div>
                        <i className="ri-pencil-line text-primary" role="button" title="Edit"></i>
                      </div>
                    </div>
                  </li>


                </ul>
              </div> */}

              <div className="card-body">
                <ul className="p-0 m-0">
                  {payees.map((payee, index) => (
                    <li key={index} className="d-flex align-items-center mb-6 border-0 rounded-3 shadow-sm mb-2 py-5 px-5">
                      <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                        <div className="me-2">
                          <h6 className="mb-0">{payee.name}</h6>
                          <small className="d-flex align-items-center">Phone: {payee.phone}</small>
                          <small className="d-flex align-items-center">Email: {payee.email}</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="badge bg-label-primary rounded-pill me-2">Entity: {payee.entity}</div>
                          <div className="badge bg-label-success rounded-pill me-2">Service: {payee.service}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>


          {showModal && (
            <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Add Payee</h5>
                    <button className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <input type="text" placeholder="Name" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, name: e.target.value })} />
                    <input type="text" placeholder="Phone" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, phone: e.target.value })} />
                    <input type="email" placeholder="Email" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, email: e.target.value })} />
                    <input type="text" placeholder="Entity" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, entity: e.target.value })} />
                    <input type="text" placeholder="Service" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, service: e.target.value })} />
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={addPayee}>Add</button>
                  </div>
                </div>
              </div>
            </div>
          )}


          <div className="col-xxl-4 col-md-4">
            <div className="card h-100 shadow-lg border-0">
              <div className="card-header d-flex align-items-center justify-content-between border-bottom mb-4">
                <h5 className="card-title m-0 me-2">Amount to be Paid</h5>
                <button className="btn btn-primary rounded-pill">View All</button>
              </div>

              <div className="card-body">
                <ul className="p-0 m-0">

                  <li className="d-flex align-items-center justify-content-between mb-4 border-0 rounded-3 shadow-sm mb-2 py-5 px-5">
                    <div>
                      <h6 className="mb-0">John Doe</h6>
                      <small className="text-muted">Entity: Business</small>
                    </div>
                    <span className="fw-bold text-success">$500</span>
                  </li>


                  <li className="d-flex align-items-center justify-content-between mb-4 border-0 rounded-3 shadow-sm mb-2 py-5 px-5">
                    <div>
                      <h6 className="mb-0">Jane Smith</h6>
                      <small className="text-muted">Entity: Personal</small>
                    </div>
                    <span className="fw-bold text-success">$350</span>
                  </li>


                  <li className="d-flex align-items-center justify-content-between mb-4 border-0 rounded-3 shadow-sm mb-2 py-5 px-5">
                    <div>
                      <h6 className="mb-0">Michael Lee</h6>
                      <small className="text-muted">Entity: Home</small>
                    </div>
                    <span className="fw-bold text-success">$275</span>
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
