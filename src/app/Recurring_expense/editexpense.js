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

  const handleSubmit = async () => {
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
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {loading ? (
          <div style={{ padding: '50px 0' }}>
            <Preloader />
          </div>
        ) : (
          <>
            <div style={styles.header}>
              <h5>Edit Recurring Expense</h5>
              <button onClick={onClose} style={styles.closeBtn}>×</button>
            </div>

            <div style={styles.body}>
              <label>Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} style={styles.input} />

              <label>Amount</label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} style={styles.input} />

              <label>Frequency</label>
              <select name="frequency" value={form.frequency} onChange={handleChange} style={styles.input}>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>

              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label>Start Date</label>
                  <DatePicker
                    selected={form.payment_date ? new Date(form.payment_date) : null}
                    onChange={(date) => handleDateChange(date, 'payment_date')}
                    dateFormat="dd-MM-yyyy"
                    className="form-control"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label>Due Date</label>
                  <DatePicker
                    selected={form.due_date ? new Date(form.due_date) : null}
                    onChange={(date) => handleDateChange(date, 'due_date')}
                    dateFormat="dd-MM-yyyy"
                    className="form-control"
                  />
                </div>
              </div>

              <label>Notes</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} style={styles.input} />

              {errorMsg && (
                <div style={{ color: 'red', marginBottom: '10px' }}>{errorMsg}</div>
              )}
            </div>

            <div style={styles.footer}>
              <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleSubmit} style={styles.primaryBtn}>Update</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
  modal: { width: '100%', maxWidth: '600px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 0 20px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', position: 'relative' },
  header: { padding: '16px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  closeBtn: { fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer' },
  body: { padding: '20px 24px' },
  footer: { padding: '12px 24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  input: { width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '12px' },
  cancelBtn: { backgroundColor: '#f0f0f0', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer' },
  primaryBtn: { backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer' }
};

