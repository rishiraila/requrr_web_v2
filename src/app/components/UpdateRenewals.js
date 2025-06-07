import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UpdateRenewals({ record, onClose, onSuccess }) {
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

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/api/income_records/${record.id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
    } catch (err) {
      console.error('Failed to update renewal', err);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h5>Edit Renewal</h5>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>
        <div style={styles.body}>
          <select name="client_id" value={form.client_id} onChange={handleChange} style={styles.input}>
            <option value="">Select Client</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select name="service_id" value={String(form.service_id)} onChange={handleChange} style={styles.input}>
            <option value="">Select Service</option>
            {services.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
          </select>
          <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} style={styles.input} />
          <input type="date" name="payment_date" value={form.payment_date?.slice(0, 10)} onChange={handleChange} style={styles.input} />
          <input type="date" name="due_date" value={form.due_date?.slice(0, 10)} onChange={handleChange} style={styles.input} />
          <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <label><input type="checkbox" name="is_recurring" checked={!!form.is_recurring} onChange={handleChange} /> Recurring</label>
          <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} style={styles.input}></textarea>
        </div>
        <div style={styles.footer}>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSubmit} style={styles.primaryBtn}>Update</button>
        </div>
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
