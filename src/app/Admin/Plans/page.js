"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function PlanPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price_inr: '',
    price_usd: '',
    max_renewals: '',
    description: ''
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/plans', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlans(res.data);
    } catch (err) {
      console.error('Error fetching plans', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this plan?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPlans();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleEdit = (plan) => {
    setFormData({
      name: plan.name,
      price_inr: plan.price_inr,
      price_usd: plan.price_usd,
      max_renewals: plan.max_renewals ?? '',
      description: plan.description ?? ''
    });
    setEditPlan(plan);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const payload = {
      name: formData.name,
      price_inr: parseFloat(formData.price_inr),
      price_usd: parseFloat(formData.price_usd),
      max_renewals: formData.max_renewals ? parseInt(formData.max_renewals) : null,
      description: formData.description
    };

    try {
      if (editPlan) {
        await axios.put(`/api/plans/${editPlan.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/plans', payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowForm(false);
      setEditPlan(null);
      fetchPlans();
    } catch (err) {
      console.error('Save failed', err);
    }
  };

  return (
    <div className="container">
      <div className='card p-5'>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>All Plans</h4>
          <button className="btn btn-primary" onClick={() => {
            setEditPlan(null);
            setFormData({ name: '', price_inr: '', price_usd: '', max_renewals: '', description: '' });
            setShowForm(true);
          }}>
            + Add Plan
          </button>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className='table-responsive'>
            <table className="table table-striped">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>INR Price</th>
                  <th>USD Price</th>
                  <th>Max Renewals</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {plans.length === 0 ? (
                  <tr><td colSpan="6" className="text-center">No plans found.</td></tr>
                ) : (
                  plans.map(plan => (
                    <tr key={plan.id}>
                      <td>{plan.name}</td>
                      <td>₹{parseFloat(plan.price_inr).toFixed(2)}</td>
                      <td>${parseFloat(plan.price_usd).toFixed(2)}</td>
                      <td>{plan.max_renewals ?? 'Unlimited'}</td>
                      <td>{plan.description}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(plan)}>
                          <i className="ri-edit-line"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(plan.id)}>
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
            <h5>{editPlan ? 'Edit Plan' : 'Add Plan'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label">Name</label>
                <input className="form-control" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="mb-2">
                <label className="form-label">INR Price</label>
                <input type="number" className="form-control" value={formData.price_inr} onChange={(e) => setFormData({ ...formData, price_inr: e.target.value })} required />
              </div>
              <div className="mb-2">
                <label className="form-label">USD Price</label>
                <input type="number" className="form-control" value={formData.price_usd} onChange={(e) => setFormData({ ...formData, price_usd: e.target.value })} required />
              </div>
              <div className="mb-2">
                <label className="form-label">Max Renewals (optional)</label>
                <input type="number" className="form-control" value={formData.max_renewals} onChange={(e) => setFormData({ ...formData, max_renewals: e.target.value })} />
              </div>
              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea className="form-control" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editPlan ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
