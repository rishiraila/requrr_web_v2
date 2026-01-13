import React, { useState } from 'react';
import axios from 'axios';
import Preloader from './Preloader';

export default function UpdateService({ service, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ ...service });

  const [toast, setToast] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(`/api/Services/${service.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({ message: 'Service updated successfully!', type: 'success' });
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      console.error('Update failed', err);
      setToast({ message: 'Failed to update service. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <h5>Edit Service</h5>
        {loading ? (
          <div style={{ padding: '50px' }}>
            <Preloader />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="form-label" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name || ''}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-2">
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Description"
                value={form.description || ''}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-2">
              <label className="form-label" htmlFor="billing_type">
                Billing Type
              </label>
              <select
                name="billing_type"
                value={form.billing_type || ''}
                onChange={handleChange}
                className="form-control"
              >
                <option value="one-time">One-time</option>
                <option value="recurring">Recurring</option>
              </select>
            </div>

            {form.billing_type === 'recurring' && (
              <div className="mb-2">
                <label className="form-label" htmlFor="billing_interval">
                  Billing Interval
                </label>
                <input
                  type="number"
                  name="billing_interval"
                  placeholder="Interval in months"
                  value={form.billing_interval || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            )}

            <div className="mb-2">
              <label className="form-label" htmlFor="base_price">
                Base Price
              </label>
              <input
                type="number"
                name="base_price"
                placeholder="Price"
                value={form.base_price || ''}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update
              </button>
            </div>
          </form>
        )}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
