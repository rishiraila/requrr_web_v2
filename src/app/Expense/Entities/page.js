'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function page() {

  const [entities, setEntities] = useState([]); // Store fetched data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state


  const [showModal, setShowModal] = useState(false); // Show/hide modal
  const [formData, setFormData] = useState({
    entity_name: "",
    entity_desc: "",
    entity_short_desc: "",
    category: "income", // Default category
  });

  const [showEditModal, setShowEditModal] = useState(false); // Show/hide edit modal
  const [editFormData, setEditFormData] = useState({
    id: null, // Store entity ID for editing
    entity_name: "",
    entity_desc: "",
    entity_short_desc: "",
    category: "income",
  });

  const [DeleteClick, setDeleteClick] = useState({id:null})


  useEffect(() => {
    fetchEntities();
  }, [])

  const fetchEntities = async () => {
    const token = localStorage.getItem("token"); // Get token from localStorage

    if (!token) {
      window.location.href = "/Login"; // Redirect if no token
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/Entities", {
        headers: { Authorization: token }, // Send token in header
      });

      setEntities(response.data.data); // Set data
    } catch (err) {
      console.error("Error fetching entities:", err);
      setError("Failed to load entities");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post("http://localhost:3000/api/Entities", formData, {
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
      });

      console.log("Entity Added:", response.data);
      setShowModal(false); // Close modal
      fetchEntities(); // Refresh list
    } catch (err) {
      console.error("Error adding entity:", err);
      setError("Failed to add entity");
    }
  };

  // Handle form input changes
  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };


  // Open Edit Modal with Entity Data
  const handleEditClick = (entity) => {
    setEditFormData({
      id: entity.id, // Store ID for updating
      entity_name: entity.entity_name,
      entity_desc: entity.entity_desc,
      entity_short_desc: entity.entity_short_desc,
      category: entity.category,
    });
    setShowEditModal(true);
  };

  // Handle Edit Form Submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    console.log(editFormData.id)

    try {
      const response = await axios.put(
        `http://localhost:3000/api/Entities/`, // Send entity ID in URL
        editFormData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Entity Updated:", response.data);
      setShowEditModal(false); // Close modal
      fetchEntities(); // Refresh list
    } catch (err) {
      console.error("Error updating entity:", err);
      setError("Failed to update entity");
    }
  };

  const handleDeleteClick = async (entity) => {
    let token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found in localStorage.");
        return;
    }

    // Ensure token does not have "Bearer " prefix twice
    if (token.startsWith("Bearer ")) {
        token = token.replace("Bearer ", "");
    }

    try {
        console.log("Using token:", token); // Debugging: Log token before request

        const response = await axios.delete('/api/Entities', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: { id: entity.id }, // Sending body correctly in DELETE request
        });

        console.log(response.data.message);
        fetchEntities(); // Refresh entity list after deletion
    } catch (error) {
        console.error("Error deleting entity:", error.response?.data?.message || error.message);
    }
};

  
  

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
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <button className='btn btn-outline-primary' onClick={() => setShowModal(true)}>Add</button>
                    </div>

                  </div>
                </div>
              </div>


              <div className="card-body">
                {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p className="text-danger">{error}</p>
                ) : entities.length === 0 ? (
                  <p>No entities found.</p>
                ) : (
                  entities.map((entity) => (
                    <div key={entity.id} className="card mb-3">
                      <div className="card-body">
                        <h6 className="card-title">{entity.entity_name}</h6>
                        <p className="card-text">{entity.entity_desc}</p>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(entity)}>Edit</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={()=>handleDeleteClick(entity)}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Modal (Popup) Form */}
          {showModal && (
            <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Add New Entity</h5>
                    <button type="button" className="close btn" onClick={() => setShowModal(false)}>
                      ×
                    </button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Entity Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="entity_name"
                          value={formData.entity_name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Entity Description</label>
                        <textarea
                          className="form-control"
                          name="entity_desc"
                          value={formData.entity_desc}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Short Description</label>
                        <input
                          type="text"
                          className="form-control"
                          name="entity_short_desc"
                          value={formData.entity_short_desc}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Category</label>
                        <select
                          className="form-control"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                        >
                          <option value="income">Income</option>
                          <option value="expense">Expense</option>
                        </select>
                      </div>

                      <button type="submit" className="btn btn-primary">Save</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Edit Modal (Popup Form) */}
          {showEditModal && (
            <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Entity</h5>
                    <button type="button" className="close btn" onClick={() => setShowEditModal(false)}>
                      ×
                    </button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleEditSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Entity Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="entity_name"
                          value={editFormData.entity_name}
                          onChange={handleEditChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Entity Description</label>
                        <textarea
                          className="form-control"
                          name="entity_desc"
                          value={editFormData.entity_desc}
                          onChange={handleEditChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Short Description</label>
                        <input
                          type="text"
                          className="form-control"
                          name="entity_short_desc"
                          value={editFormData.entity_short_desc}
                          onChange={handleEditChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Category</label>
                        <select
                          className="form-control"
                          name="category"
                          value={editFormData.category}
                          onChange={handleEditChange}
                          required
                        >
                          <option value="income">Income</option>
                          <option value="expense">Expense</option>
                        </select>
                      </div>

                      <button type="submit" className="btn btn-primary">Update</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

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
