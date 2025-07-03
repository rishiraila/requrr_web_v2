"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Page() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [formData, setFormData] = useState({ code: '', discount_percent: '', max_usage: '', expires_at: '' });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/coupons', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoupons(res.data);
    } catch (err) {
      console.error('Error fetching coupons', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCoupons();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleEdit = (coupon) => {
    setFormData({
      code: coupon.code,
      discount_percent: coupon.discount_percent,
      max_usage: coupon.max_usage || '',
      expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 10) : ''
    });
    setEditCoupon(coupon);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const payload = {
      ...formData,
      discount_percent: parseInt(formData.discount_percent),
      max_usage: formData.max_usage ? parseInt(formData.max_usage) : null,
      expires_at: formData.expires_at || null
    };

    try {
      if (editCoupon) {
        await axios.put(`/api/coupons/${editCoupon.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/coupons', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowForm(false);
      setEditCoupon(null);
      fetchCoupons();
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  return (
    <div className="container">
      <div className='card p-5'>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>All Coupons</h4>
          <button className="btn btn-primary" onClick={() => {
            setEditCoupon(null);
            setFormData({ code: '', discount_percent: '', max_usage: '', expires_at: '' });
            setShowForm(true);
          }}>
            + Add Coupon
          </button>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className='table-responsive'>
            <table className="table table-striped">
              <thead className="table-light">
                <tr>
                  <th>Code</th>
                  <th>Discount %</th>
                  <th>Max Usage</th>
                  <th>Used Count</th>
                  <th>Expires At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr><td colSpan="6" className="text-center">No coupons found.</td></tr>
                ) : (
                  coupons.map(coupon => (
                    <tr key={coupon.id}>
                      <td>{coupon.code}</td>
                      <td>{coupon.discount_percent}%</td>
                      <td>{coupon.max_usage || 'Unlimited'}</td>
                      <td>{coupon.used_count}</td>
                      <td>{coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Never'}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(coupon)}>
                          <i className="ri-edit-line"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(coupon.id)}>
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
          }}
        >
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
            <h5>{editCoupon ? 'Edit Coupon' : 'Add Coupon'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label">Code</label>
                <input className="form-control" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required />
              </div>
              <div className="mb-2">
                <label className="form-label">Discount (%)</label>
                <input type="number" className="form-control" value={formData.discount_percent} onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })} required />
              </div>
              <div className="mb-2">
                <label className="form-label">Max Usage (optional)</label>
                <input type="number" className="form-control" value={formData.max_usage} onChange={(e) => setFormData({ ...formData, max_usage: e.target.value })} />
              </div>
              <div className="mb-2">
                <label className="form-label">Expires At (optional)</label>
                <input type="date" className="form-control" value={formData.expires_at} onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })} />
              </div>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editCoupon ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
