import React, { useState } from 'react';
import axios from 'axios';

export default function AddService({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', description: '', billing_type: 'one-time',
    billing_interval: '', base_price: '', is_active: 1
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? (checked ? 1 : 0) : value;
    setForm({ ...form, [name]: val });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/Services', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
    } catch (err) {
      console.error("Add service failed", err);
    }
  };

  return (
    <ModalLayout title="Add Service" onClose={onClose} onSubmit={handleSubmit} submitLabel="Add">
      <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} style={styles.input} />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} style={styles.input} />
      <select name="billing_type" value={form.billing_type} onChange={handleChange} style={styles.input}>
        <option value="one-time">One-time</option>
        <option value="recurring">Recurring</option>
      </select>
      {form.billing_type === 'recurring' && (
        <input type="number" name="billing_interval" placeholder="Interval in months" value={form.billing_interval} onChange={handleChange} style={styles.input} />
      )}
      <input type="number" name="base_price" placeholder="Price" value={form.base_price} onChange={handleChange} style={styles.input} />
      <label><input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} /> Active</label>
    </ModalLayout>
  );
}

function ModalLayout({ title, onClose, onSubmit, submitLabel, children }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h5 style={{ margin: 0 }}>{title}</h5>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>
        <div style={styles.body}>{children}</div>
        <div style={styles.footer}>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          <button onClick={onSubmit} style={styles.primaryBtn}>{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
  modal: { width: '100%', maxWidth: '500px', backgroundColor: '#fff', borderRadius: '8px', display: 'flex', flexDirection: 'column', position: 'relative' },
  header: { padding: '16px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' },
  closeBtn: { fontSize: '22px', background: 'none', border: 'none', cursor: 'pointer' },
  body: { padding: '20px 24px' },
  footer: { padding: '12px 24px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  input: { width: '100%', padding: '10px 12px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '12px' },
  cancelBtn: { backgroundColor: '#f0f0f0', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer' },
  primaryBtn: { backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer' }
};
