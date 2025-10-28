import React, { useState } from 'react';
import axios from 'axios';
import Preloader from './Preloader';

export default function AddService({ onClose, onSuccess }) {

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '', description: '', billing_type: 'one-time',
    billing_interval: '', base_price: '', is_active: 1
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? (checked ? 1 : 0) : value;
    setForm({ ...form, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post('/api/Services', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
    } catch (err) {
      console.error("Add service failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
      }}
    >
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h5>Add Service</h5>
        {loading ? (
          <div style={{ padding: '50px' }}>
            <Preloader />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="form-label" htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-2">
              <label className="form-label" htmlFor="description">Description</label>
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-2">
              <label className="form-label" htmlFor="billing_type">Billing Type</label>
              <select
                name="billing_type"
                value={form.billing_type}
                onChange={handleChange}
                className="form-control"
              >
                <option value="one-time">One-time</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>
            {form.billing_type === 'recurring' && (
              <div className="mb-2">
                <label className="form-label" htmlFor="billing_interval">Billing Interval</label>
                <input
                  type="number"
                  name="billing_interval"
                  placeholder="Interval in months"
                  value={form.billing_interval}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            )}
            <div className="mb-2">
              <label className="form-label" htmlFor="base_price">Base Price</label>
              <input
                type="number"
                name="base_price"
                placeholder="Price"
                value={form.base_price}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Add</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
