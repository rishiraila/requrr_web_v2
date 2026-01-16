'use client';
import React, { useState, useEffect } from 'react';

export default function AddExpenseModal({ show, onClose, onSubmit, expense, mode, isSaving, onAddCategory }) {
  const [form, setForm] = useState({
    id: null,
    title: '',
    amount: '',
    category_id: '',
    expense_date: '',
    notes: '',
  });
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (show) {
      fetchCategories();
    }
    if (expense) {
      setForm({
        id: expense.id || null,
        title: expense.title || '',
        amount: expense.amount || '',
        category_id: expense.category_id || '',
        expense_date: expense.expense_date ? expense.expense_date.slice(0, 10) : '',
        notes: expense.notes || '',
      });
    } else {
      setForm({
        id: null,
        title: '',
        amount: '',
        category_id: '',
        expense_date: '',
        notes: '',
      });
    }
  }, [expense, show]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await fetch('/api/expense_categories', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

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
              <h5 className="modal-title">{mode === 'edit' ? 'Edit Expense' : 'Add Expense'}</h5>
              <button type="button" className="btn-close" onClick={onClose} disabled={isSaving}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  value={form.title}
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
                <div className="d-flex">
                  <select
                    name="category_id"
                    className="form-select"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                    disabled={isSaving || loadingCategories}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-outline-secondary ms-2"
                    onClick={() => onAddCategory && onAddCategory()}
                    disabled={isSaving}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Expense Date</label>
                <input
                  type="date"
                  name="expense_date"
                  className="form-control"
                  value={form.expense_date}
                  onChange={handleChange}
                  required
                  disabled={isSaving}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  name="notes"
                  className="form-control"
                  value={form.notes}
                  onChange={handleChange}
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
