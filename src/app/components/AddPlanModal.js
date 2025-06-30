'use client';

import { useState } from 'react';

export default function AddPlanModal({ show, onClose, token, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    max_renewals: '',
    description: ''
  });

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const res = await fetch('/api/plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formData,
        price: parseFloat(formData.price),
        max_renewals: formData.max_renewals === '' ? null : parseInt(formData.max_renewals)
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Plan added successfully');
      onAdd();
      onClose();
      setFormData({ name: '', price: '', max_renewals: '', description: '' });
    } else {
      alert(data.error || 'Failed to add plan');
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Plan</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input className="form-control" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Price</label>
              <input className="form-control" name="price" type="number" value={formData.price} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Max Renewals</label>
              <input className="form-control" name="max_renewals" type="number" value={formData.max_renewals} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Add Plan</button>
          </div>
        </div>
      </div>
    </div>
  );
}
