'use client'
import React, { useState, useEffect } from 'react'
import AddServiceModal from '@/app/components/AddServiceModal'
import axios from 'axios';

export default function page() {

  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [entities, setEntities] = useState([]);

  const [loading, setLoading] = useState(true);

  // Fetch services using Axios
  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage

      if (!token) {
        window.location.href = "/Login"; // Redirect if no token
        return;
      }

      console.log("📢 Fetching services with token:", token);

      const response = await axios.get('http://localhost:3000/api/Services', {
        headers: { Authorization: token }, // Send token in header
      });

      console.log("✅ API Response:", response.data);

      if (response) {
        setServices(response.data.data);
      } else {
        alert(response.data.message || "Failed to fetch services.");
      }
    } catch (error) {
      console.error('❌ Error fetching services:', error);

      if (error.response) {
        console.error("🔴 Server responded with:", error.response.data);
        alert(error.response.data.message || "Something went wrong while fetching services.");
      } else if (error.request) {
        console.error("⚠️ No response received from server.");
        alert("No response from server. Please check your API.");
      } else {
        console.error("❗ Unknown error:", error.message);
        alert("Unexpected error occurred.");
      }
    }
  };

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, []);

  const handleServiceAdded = () => {
    fetchServices()
  }

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

      setEntities(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching entities:", err);
    }
  };

  // Fetch entities on mount
  useEffect(() => {
    fetchEntities();
  }, []);


  const getEntityName = (id) => {
    const entity = entities.find((e) => e.id === id);
    console.log(entity)
    return entity ? entity.entity_name : "Unknown Entity";
  };

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
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>+</button>
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
                {services.length === 0 ? (
                  <p>No services available.</p>
                ) : (
                  <ul className="p-0 m-0">
                    {services.map((service, index) => (
                      <li key={index} className="d-flex align-items-center border-0 rounded-3 shadow-sm mb-2 py-5 px-5">
                        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                          <div>
                            <h6 className="mb-0">{service.service_name}</h6>
                            <small>{service.service_desc}</small><br />
                            <small className="text-muted">Default Duration [ monthly ] : {service.min_duration}</small>
                          </div>
                          <div className="d-flex align-items-center">
                            {/* <div className="badge bg-label-primary rounded-pill me-2">{service.entity_id}</div> */}
                            <div className="badge bg-label-primary rounded-pill me-2">{getEntityName(service.entity_id)}</div>
                            <i className="ri-pencil-line text-primary" role="button" title="Edit"></i>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <AddServiceModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onServiceAdded={handleServiceAdded}
          />

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
