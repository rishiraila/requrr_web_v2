import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Preloader from './Preloader'; // adjust the path if needed

import DatePicker from 'react-datepicker';
import { format, parseISO } from 'date-fns';


import 'react-datepicker/dist/react-datepicker.css';

export default function UpdateRenewals({ record, onClose, onSuccess }) {

  const [loading, setLoading] = useState(false);

  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ ...record });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/clients', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setClients(res.data));
    axios.get('/api/Services', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setServices(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? (checked ? 1 : 0) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      setLoading(true); // Show preloader
      await axios.put(`/api/income_records/${record.id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
    } catch (err) {
      console.error('Failed to update renewal', err);
    } finally {
      setLoading(false); // Hide preloader
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
        <h5>Edit Renewal</h5>
        {loading ? (
          <div style={{ padding: '50px' }}>
            <Preloader />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="form-label" htmlFor="client_id">Client</label>
              <select name="client_id" value={form.client_id} onChange={handleChange} className="form-control">
                <option value="">Select Client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="mb-2">
              <label className="form-label" htmlFor="service_id">Service</label>
              <select name="service_id" value={String(form.service_id)} onChange={handleChange} className="form-control">
                <option value="">Select Service</option>
                {services.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
              </select>
            </div>

            <div className="mb-2">
              <label className="form-label" htmlFor="amount">Amount</label>
              <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} className="form-control" />
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

            <div className="d-flex justify-content-between mb-2">
              <div>
                <label className="form-label" htmlFor="payment_date">Payment Date</label>
                <DatePicker
                  selected={form.payment_date ? new Date(form.payment_date) : null}
                  onChange={(date) => setForm({ ...form, payment_date: format(date, 'yyyy-MM-dd') })}
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                />
              </div>

              <div>
                <label className="form-label" htmlFor="due_date">Due Date</label>
                <DatePicker
                  selected={form.due_date ? new Date(form.due_date) : null}
                  onChange={(date) => setForm({ ...form, due_date: format(date, 'yyyy-MM-dd') })}
                  dateFormat="dd-MM-yyyy"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-check mb-2">
              <input type="checkbox" name="is_recurring" checked={!!form.is_recurring} onChange={handleChange} className="form-check-input" id="is_recurring" />
              <label className="form-check-label" htmlFor="is_recurring">Recurring</label>
            </div>

            <div className="mb-2">
              <label className="form-label" htmlFor="notes">Notes</label>
              <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} className="form-control"></textarea>
            </div>

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


