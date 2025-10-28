'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Preloader from '../components/Preloader';

export default function UpdateRecurringExpense({ record, onClose, onSuccess }) {
  const [form, setForm] = useState({ ...record });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    setForm({ ...record });
  }, [record]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateChange = (date, field) => {
    const isoString = date.toLocaleDateString('en-CA');
    let updatedForm = { ...form, [field]: isoString };

    if (field === 'payment_date') {
      let endDate = new Date(date);
      switch (form.frequency) {
        case 'weekly': endDate.setDate(endDate.getDate() + 7); break;
        case 'monthly': endDate.setMonth(endDate.getMonth() + 1); break;
        case 'yearly': endDate.setFullYear(endDate.getFullYear() + 1); break;
        default: break;
      }
      updatedForm.due_date = endDate.toISOString().split('T')[0];
    }

    setForm(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      await axios.put(`/api/requrring_expenses/${form.id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to update expense.');
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
        <h5>Edit Recurring Expense</h5>
        {loading ? (
          <div style={{ padding: '50px' }}>
            <Preloader />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="form-label" htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-2">
              <label className="form-label" htmlFor="amount">Amount</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-2">
              <label className="form-label" htmlFor="frequency">Frequency</label>
              <select name="frequency" value={form.frequency} onChange={handleChange} className="form-control">
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="form-label" htmlFor="status">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="form-control">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="form-label">Start Date</label>
              <DatePicker
                selected={form.payment_date ? new Date(form.payment_date) : null}
                onChange={(date) => handleDateChange(date, 'payment_date')}
                dateFormat="dd-MM-yyyy"
                className="form-control"
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Due Date</label>
              <DatePicker
                selected={form.due_date ? new Date(form.due_date) : null}
                onChange={(date) => handleDateChange(date, 'due_date')}
                dateFormat="dd-MM-yyyy"
                className="form-control"
              />
            </div>

            <div className="mb-2">
              <label className="form-label" htmlFor="notes">Notes</label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {errorMsg && (
              <div style={{ color: 'red', marginBottom: '10px' }}>{errorMsg}</div>
            )}

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

