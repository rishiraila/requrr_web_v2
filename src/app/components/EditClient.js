import React, { useState } from 'react';
import axios from 'axios';
import Preloader from './Preloader'

export default function EditClient({ client, onClose, onSuccess }) {

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ ...client });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Show loader
      const token = localStorage.getItem("token");
      await axios.put(`/api/clients/${client.id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess(); // Refresh list and close
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false); // Hide loader
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
        <h5>Edit Client</h5>
        {loading ? (
          <div style={{ padding: '50px' }}>
            <Preloader />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {["company_name", "name", "email", "phone", "address", "notes"].map(field => (
              <div key={field} className="mb-2">
                <label className="form-label" htmlFor={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field] || ''}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            ))}

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Update</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
