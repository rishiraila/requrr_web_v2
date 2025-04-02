import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AddServiceModal({ show, onClose, onServiceAdded, entities }) {
  const [formData, setFormData] = useState({
    service_name: '',
    service_desc: '',
    entity_name: '',
    min_duration: '',
    amount: '',
    category: 'income',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get token from localStorage

    if (!token) {
      window.location.href = "/Login"; // Redirect if no token
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/Services', formData, {
        headers: { 
          "Authorization": token,
          "Content-Type": "application/json",
        },
      });

    
      console.log("Entity Added:", response.data);
      onServiceAdded(response.data.data);
      onClose();
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  useEffect(() => {
    console.log("Entites are been consoled",entities)
  }, [])
  

  return (
    show && (
      <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Service</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Service Name</label>
                  <input type="text" className="form-control" name="service_name" onChange={handleChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" name="service_desc" onChange={handleChange} required></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Entity Name</label>
                  <select className="form-control" name="entity_name" onChange={handleChange} required>
                    <option value="">Select an entity</option>
                    {
                      entities.map((entity, index) => (
                        <option key={index} value={entity.entity_name}>{entity.entity_name}</option>
                      ))
                    }
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Duration (months)</label>
                  <input type="number" className="form-control" name="min_duration" onChange={handleChange} required />
                </div>

                {/* <div className="mb-3">
                  <label className="form-label">Amount</label>
                  <input type="number" className="form-control" name="amount" onChange={handleChange} required />
                </div> */}

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select className="form-control" name="category" onChange={handleChange}>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                <div className="text-end">
                  <button type="button" className="btn btn-secondary me-2" onClick={onClose}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Service</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
