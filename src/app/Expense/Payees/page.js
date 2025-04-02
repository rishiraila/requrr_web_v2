'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios';

export default function page() {

  const [CurrentMonthDues, setCurrentMonthDues] = useState([])

  const [Entities, setEntities] = useState([])
  const [Services, setServices] = useState([])
  const [payees, setPayees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [EditShowModal, setEditShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState(null);
  const [newPayee, setNewPayee] = useState({
    payee_name: '',
    phone: '',
    email: '',
    entity_name: '',
    service_name: '',
    amount: '',
    category: ''
  });

  useEffect(() => {
    fetchPayees();
  }, []);

  const fetchPayees = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token)
      const response = await axios.get('http://localhost:3000/api/Payees', {
        headers: { Authorization: `${token}` },
      });
      console.log(response.data)
      setPayees(response.data.data); // Fix: Use response.data.data

      const responseData = response.data.data;
      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to start of the day

      // Get the date 30 days from today
      const next30Days = new Date();
      next30Days.setDate(today.getDate() + 30);
      next30Days.setHours(23, 59, 59, 999); // Ensure we include the full last day

      // Get current year and month
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth(); // 0-indexed (Jan = 0)

      // Filter endDates for the current month and within the next 30 days
      const filteredEndDates = responseData
        .map(sub => new Date(sub.endDate)) // Convert to Date objects
        .filter(endDate => {
          endDate.setHours(0, 0, 0, 0); // Normalize to start of the day
          return (
            endDate.getFullYear() === currentYear && // Same year
            endDate.getMonth() === currentMonth && // Same month
            endDate >= today && // Not in the past
            endDate <= next30Days // Within the next 30 days
          );
        })
        .map(endDate => endDate.toISOString()); // Convert back to string if needed

      console.log("Filtered End Dates (Current Month & Next 30 Days):", filteredEndDates);
      setCurrentMonthDues(filteredEndDates)
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
          "Authorization": `${token}`, // Add 'Bearer ' prefix
          "Content-Type": "application/json",
        },
      });
      setShowModal(false);
      fetchPayees();
    } catch (error) {
      console.error('Error adding payee:', error.response?.data || error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (isEditing) {
        await axios.put('http://localhost:3000/api/Payees', { ...newPayee, payee_id: selectedPayee.id }, {
          headers: { "Authorization": `${token}`, "Content-Type": "application/json" },
        });
      }
      setEditShowModal(false);
      fetchPayees();
    } catch (error) {
      console.error('Error saving payee:', error.response?.data || error.message);
    }
  };

  const handleDelete = async (payeeId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/Payees?payee_id=${payeeId}`, {
        headers: {
          "Authorization": `${token}`,
          "Content-Type": "application/json",
        }
      });
      fetchPayees();
    } catch (error) {
      console.error('Error deleting payee:', error.response?.data || error.message);
    }
  };



  const fetchEntities = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/Login";
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/Entities", {
        headers: { Authorization: token }, // Ensure Bearer token format
      });

      const entities = response.data.data;

      setEntities([...new Set(entities.map(entity => entity.entity_name))]); // Assuming entity has a 'name' property

    } catch (err) {
      console.error("Error fetching entities:", err);
    }
  };

  const fetchServices = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/Login";
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/Services", {
        headers: { Authorization: token }, // Ensure Bearer token format
      });

      const services = response.data.data

      setServices([...new Set(services.map(service => service.service_name))]); // Assuming service has a 'name' property

    } catch (err) {
      console.error("Error fetching entities:", err);
    }
  };
  // Fetch entities on mount
  useEffect(() => {
    fetchEntities();
    fetchServices()
  }, []);



  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="row g-6">
          <div className="col-xxl-8 col-md-8">
            <div className="card h-100 shadow-lg border-0">
              <div className="card-header d-flex align-items-center justify-content-between border-bottom mb-4">
                <h5 className="card-title m-0 me-2">Payee Details</h5>
                <div className="d-flex align-items-center">
                  <button className="btn btn-primary rounded-pill me-2" onClick={() => setShowModal(true)}>+ Payees</button>
                </div>
              </div>


              <div className="card-body my-5">
                <div className="row row-cols-1 row-cols-md-3 g-4">
                  {payees.map((payees) => {
                    const isDueThisMonth = CurrentMonthDues.includes(payees.endDate);


                    return <div className="col-md-6 col-12" key={payees.id}>

                      <div className={`card shadow-sm ${isDueThisMonth ? 'border border-danger' : 'border-0  '} h-100`}>

                        <div className="card-body d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="card-title mb-1">{payees.payee_name}</h5>
                              <span className="badge bg-label-primary me-1">
                                Entity: {payees.entity_name}
                              </span>
                              <span className="badge bg-label-info">
                                Service: {payees.service_name}
                              </span>
                              <p className="mt-2 mb-1 text-muted">
                                Phone: {payees.phone}
                              </p>
                              <p className="text-muted">Email: {payees.email}</p>
                              <small className="text-muted">Start: {new Date(payees.startDate).toLocaleDateString()}</small> &nbsp;
                              <small className="text-muted">End: {new Date(payees.endDate).toLocaleDateString()}</small>
                            </div>
                            <div className="dropdown">
                              <button className="btn btn-light border-0" data-bs-toggle="dropdown"><i className="ri-more-2-line"></i></button>
                              <div className="dropdown-menu dropdown-menu-end">
                                <button className="dropdown-item" onClick={() => {
                                  setIsEditing(true);
                                  setSelectedPayee(payees);
                                  setNewPayee(payees);
                                  setEditShowModal(true);
                                }}>Edit</button>
                                <button className="dropdown-item text-danger" onClick={() => handleDelete(payees.id)}>Delete</button>
                              </div>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <span className="fw-bold text-primary">Total: ${payees.amount}</span>
                            <span className="fw-bold text-success">Paid: ${payees.paidAmount}</span>
                            <span className="fw-bold text-danger">Rmaining: ${payees.remainingAmount}</span>
                          </div>

                          <p className="text-muted mt-3 mb-0">
                            Payment Date: {new Date(payees.paymentDate).toLocaleDateString()}
                          </p>
                        </div>
                        {isDueThisMonth && <p className="text-danger ps-5">Ends Soon <i class="bi bi-exclamation-triangle"></i></p>}
                      </div>
                    </div>
                  })}
                </div>
              </div>
            </div>
          </div>

          {EditShowModal && (
            <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5>{isEditing ? 'Edit Payee' : 'Add Payee'}</h5>
                    <button className="btn-close" onClick={() => setEditShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <input type="text" value={newPayee.payee_name} placeholder="Name" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, payee_name: e.target.value })} />

                    <input type="text" value={newPayee.phone} placeholder="Phone" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, phone: e.target.value })} />

                    <input type="email" value={newPayee.email} placeholder="Email" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, email: e.target.value })} />
                    {/* <input type="text" value={newPayee.entity_name} placeholder="Entity"  className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, entity_name: e.target.value })} /> */}
                    <select value={newPayee.entity_name} onChange={(e) => setNewPayee({ ...newPayee, entity_name: e.target.value })} className="form-control mb-2">
                      <option value="">Select Entity</option>
                      {Entities.map((entity, index) => (
                        <option key={index} value={entity}>{entity}</option>
                      ))}
                    </select>

                    <select value={newPayee.service_name} onChange={(e) => setNewPayee({ ...newPayee, service_name: e.target.value })} className="form-control mb-2">
                      <option value="">Select Service</option>
                      {Services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>

                    
                    <input type="text" value={newPayee.amount} placeholder="Amount" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, amount: e.target.value })} />
                    <input type="text" value={newPayee.category} placeholder="Category" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, category: e.target.value })} />
                  
                    <input type="date" value={newPayee.startDate} className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, startDate: e.target.value })} />
                    <input type="date" value={newPayee.endDate} className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, endDate: e.target.value })} />
                    <input type="number" value={newPayee.paidAmount} placeholder="Paid Amount" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, paidAmount: e.target.value })} />
                    <input type="date" value={newPayee.paymentDate} className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, paymentDate: e.target.value })} />

                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setEditShowModal(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit}>{isEditing ? 'Update' : 'Add'}</button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {showModal && (
            <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Add Payee</h5>
                    <button className="btn-close" onClick={() => setShowModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <input type="text" placeholder="Name" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, payee_name: e.target.value })} />

                    <input type="text" placeholder="Phone" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, phone: e.target.value })} />

                    <input type="email" placeholder="Email" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, email: e.target.value })} />
                    {/* <input type="text" placeholder="Entity" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, entity_name: e.target.value })} /> */}

                    <select value={newPayee.entity_name} onChange={(e) => setNewPayee({ ...newPayee, entity_name: e.target.value })} className="form-control mb-2">
                      <option value="">Select Entity</option>
                      {Entities.map((entity, index) => (
                        <option key={index} value={entity}>{entity}</option>
                      ))}
                    </select>

                    <select value={newPayee.service_name} onChange={(e) => setNewPayee({ ...newPayee, service_name: e.target.value })} className="form-control mb-2">
                      <option value="">Select Service</option>
                      {Services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>

                    {/* <input type="text" placeholder="Service" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, service_name: e.target.value })} /> */}
                    <input type="text" placeholder="Amount" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, amount: e.target.value })} />

                    <input type="date" placeholder="Start Date" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, startDate: e.target.value })} />
                    <input type="date" placeholder="End Date" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, endDate: e.target.value })} />
                    <input type="number" placeholder="Paid Amount" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, paidAmount: e.target.value })} />
                    <input type="date" placeholder="Payment Date" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, paymentDate: e.target.value })} />

                    <input type="text" placeholder="Category" className="form-control mb-2" onChange={(e) => setNewPayee({ ...newPayee, category: e.target.value })} />

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
                  {payees.map((payee, index) => (

                    <li className="d-flex align-items-center justify-content-between mb-4 border-0 rounded-3 shadow-sm mb-2 py-5 px-5">
                      <div>
                        <h6 className="mb-0">{payee.payee_name}</h6>
                        <small className="text-muted">Entity: {payee.entity_name}</small><br />
                        <small className="text-muted">Service: {payee.service_name}</small>
                      </div>
                      <span className={`fw-bold  ${payee.category == 'expense' ? 'text-danger' : 'text-success'}`}>${payee.remainingAmount}</span>
                    </li>
                  ))}

                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>

    </>
  )
}
