'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Preloader from '../components/Preloader';

export default function UpdateRecurringExpense({ record, onClose, onSuccess }) {
  const [form, setForm] = useState({ ...record });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // 🔹 Load categories
  useEffect(() => {
    axios
      .get('/api/expense_categories', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  // 🔹 Update form when record changes
  useEffect(() => {
    setForm({ ...record });
  }, [record]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleDateChange = (date, field) => {
    const iso = date ? date.toISOString().split('T')[0] : null;
    let updated = { ...form, [field]: iso };

    // 🔄 Auto calculate due_date when payment_date changes
    if (field === 'payment_date' && date) {
      let next = new Date(date);
      if (form.frequency === 'weekly') next.setDate(next.getDate() + 7);
      if (form.frequency === 'monthly') next.setMonth(next.getMonth() + 1);
      if (form.frequency === 'yearly') next.setFullYear(next.getFullYear() + 1);
      updated.due_date = next.toISOString().split('T')[0];
    }

    setForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg('');

      await axios.put(`/api/requrring_expenses/${form.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSuccess();
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.error || 'Failed to update recurring expense'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
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
          padding: 20,
          borderRadius: 8,
          width: '100%',
          maxWidth: 520,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <h5 className="mb-3">Edit Recurring Expense</h5>

        {loading ? (
          <div className="py-5">
            <Preloader />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-2">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={form.title || ''}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Amount */}
            <div className="mb-2">
              <label className="form-label">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount || ''}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Category */}
            <div className="mb-2">
              <label className="form-label">Category</label>
              <select
                name="category_id"
                value={form.category_id || ''}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Frequency */}
            <div className="mb-2">
              <label className="form-label">Frequency</label>
              <select
                name="frequency"
                value={form.frequency}
                onChange={handleChange}
                className="form-control"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {/* Status */}
            <div className="mb-2">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="form-control"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Next Run Date */}
            <div className="mb-2">
              <label className="form-label">Next Run Date</label>
              <DatePicker
                selected={
                  form.next_run_date ? new Date(form.next_run_date) : null
                }
                onChange={(d) => handleDateChange(d, 'next_run_date')}
                dateFormat="dd-MM-yyyy"
                className="form-control"
              />
            </div>

            {/* Notes */}
            <div className="mb-2">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                value={form.notes || ''}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {errorMsg && (
              <div className="text-danger mb-2">{errorMsg}</div>
            )}

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
      </div>
    </div>
  );
}
