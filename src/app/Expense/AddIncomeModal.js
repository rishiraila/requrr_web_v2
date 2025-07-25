'use client';
import React, { useState, useEffect } from 'react';

export default function AddIncomeModal({ show, onClose, onSubmit, income, mode, isSaving }) {
  const [form, setForm] = useState({
    id: null,
    description: '',
    amount: '',
    category: '',
    account: 'card',
    date: '',
  });

  useEffect(() => {
    if (income) {
      setForm({
        id: income.id || null,
        description: income.description || '',
        amount: income.amount || '',
        category: income.category || '',
        account: income.account || 'card',
        date: income.date ? income.date.slice(0, 10) : '',
      });
    } else {
      setForm({
        id: null,
        description: '',
        amount: '',
        category: '',
        account: 'card',
        date: '',
      });
    }
  }, [income]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{mode === 'edit' ? 'Edit Income' : 'Add Income'}</h5>
              <button type="button" className="btn-close" onClick={onClose} disabled={isSaving}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  name="description"
                  className="form-control"
                  value={form.description}
                  onChange={handleChange}
                  required
                  disabled={isSaving}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  name="amount"
                  className="form-control"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  disabled={isSaving}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={form.category}
                  onChange={handleChange}
                  required
                  disabled={isSaving}
                >
                  <option value="">Select category</option>
                  <option value="food">Food</option>
                  <option value="rent">Rent</option>
                  <option value="travel">Travel</option>
                  <option value="salary">Salary</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Account</label>
                <select
                  name="account"
                  className="form-select"
                  value={form.account}
                  onChange={handleChange}
                  required
                  disabled={isSaving}
                >
                  <option value="card">Card</option>
                  <option value="online">Online</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={form.date}
                  onChange={handleChange}
                  required
                  disabled={isSaving}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSaving}>
                Cancel
              </button>
              <button type="submit" className="btn btn-success" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : mode === 'edit' ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
