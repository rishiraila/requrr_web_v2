'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AddRecurringExpense({ onClose, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    amount: '',
    frequency: 'monthly',
    next_run_date: '',
    category_id: '',
    notes: '',
    is_one_time: false,
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('/api/expense_categories', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setCategories(res.data || []));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/requrring_expenses', form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    onSuccess();
  };

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-box">
        <h5>Add Recurring Expense</h5>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })} />

          <input className="form-control mb-2" type="number" placeholder="Amount"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })} />

          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="is_one_time"
              checked={form.is_one_time}
              onChange={e => setForm({ ...form, is_one_time: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="is_one_time">
              One Time
            </label>
          </div>

          {!form.is_one_time && (
            <select className="form-control mb-2"
              value={form.frequency}
              onChange={e => setForm({ ...form, frequency: e.target.value })}>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          )}

          <DatePicker
            className="form-control mb-2"
            selected={form.next_run_date ? new Date(form.next_run_date) : null}
            onChange={d => setForm({ ...form, next_run_date: d.toISOString().split('T')[0] })}
            placeholderText={form.is_one_time ? "Expense Date" : "Next Run Date"}
          />

          <select className="form-control mb-2"
            value={form.category_id}
            onChange={e => setForm({ ...form, category_id: e.target.value })}>
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <textarea className="form-control mb-2"
            placeholder="Notes"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })} />

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}
