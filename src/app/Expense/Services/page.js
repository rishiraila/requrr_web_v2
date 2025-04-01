'use client'
import React, { useState, useEffect } from 'react'
import AddServiceModal from '@/app/components/AddServiceModal'
import axios from 'axios';
import EditServiceModal from '@/app/components/EditServiceModal'
export default function page() {

  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [ServiceCount, setServiceCount] = useState([])

  const [editingService, setEditingService] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (service) => {

    setEditingService(service);
    setShowEditModal(true);
  };


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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete("http://localhost:3000/api/Services", {
          headers: { Authorization: token },
          data: { id },
        });
        fetchServices(); // Refresh the list
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  const fetchServiceCount = async () => {
    const token = localStorage.getItem("token"); // Get token from localStorage

    if (!token) {
      window.location.href = "/Login"; // Redirect if no token
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/GET_SERVICES_COUNT_BY_ENTITY", {
        headers: { Authorization: token }, // Send token in header
      });

      setServiceCount(response.data.data); // Set data
    } catch (err) {
      console.error("Error fetching entities:", err);
      setError("Failed to load entities");
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchServiceCount()
  }, [])


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
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Service</button>
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
                          {/* <div className="d-flex align-items-center">
                            <div className="badge bg-label-primary rounded-pill me-2">{getEntityName(service.entity_id)}</div>
                            <i className="ri-pencil-line text-primary" role="button" title="Edit"></i>
                          </div> */}
                          <div className="d-flex align-items-center">
                            <div className="badge bg-label-primary rounded-pill me-2">{getEntityName(service.entity_id)}</div>
                            <div className="dropdown">
                              <button className="btn btn-text-secondary border-0 p-1" type="button" data-bs-toggle="dropdown">
                                <i className="ri-more-2-line ri-20px"></i>
                              </button>
                              <div className="dropdown-menu dropdown-menu-end">
                                <button className="dropdown-item" onClick={() => handleEdit(service)}>Edit</button>
                                <button className="dropdown-item text-danger" onClick={() => handleDelete(service.id)}>Delete</button>
                              </div>
                            </div>
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

          <EditServiceModal
            show={showEditModal}
            onClose={() => setShowEditModal(false)}
            service={editingService}
            onServiceUpdated={fetchServices}
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

                </div>
              </div>
              <div className="card-body pb-1 px-0">

                <div className="px-3 mt-4">
                  <ul className="list-group">
                  {entities.map((entity) => {
        // Find the corresponding service count for the entity
        const serviceCountData = ServiceCount.find(count => count.entity_name === entity.entity_name);
        const serviceCount = serviceCountData ? serviceCountData.service_count : 0; // Default to 0 if not found

        // Determine the icon class based on entity name
        let iconClass;
        switch (entity.entity_name) {
          case 'Business':
            iconClass = 'ri-briefcase-4-line ri-24px text-success';
            break;
          case 'Personal':
            iconClass = 'ri-user-3-line ri-24px text-primary';
            break;
          case 'Home':
            iconClass = 'ri-home-5-line ri-24px text-warning';
            break;
          case 'Office':
            iconClass = 'ri-building-4-line ri-24px text-secondary';
            break;
          default:
            iconClass = 'ri-question-line ri-24px'; // Default icon if none match
        }

        return (
          <li key={entity.id} className="list-group-item d-flex justify-content-between align-items-center border-0 rounded-3 shadow-sm mb-2 py-5">
            <div className="d-flex align-items-center">
              <i className={iconClass}></i> {/* Render the appropriate icon */}
              <span className="ms-2">{entity.entity_name}</span>
            </div>
            <span className={`badge ${serviceCount > 0 ? 'bg-label-primary' : 'bg-label-secondary'} rounded-pill text-dark`}>
              {serviceCount > 0 ? serviceCount : 'No Services'} Services
            </span>
          </li>
        );
      })}

                    
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
