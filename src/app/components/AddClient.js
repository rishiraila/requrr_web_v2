import React, { useState } from 'react';
import axios from 'axios';
import Preloader from './Preloader';

export default function AddClient({ onClose, onSuccess }) {

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', notes: ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.post('/api/clients', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess();
    } catch (err) {
      console.error("Add failed", err);
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
              <h5 style={{ margin: 0 }}>Add Client</h5>
              <button onClick={onClose} style={styles.closeBtn}>×</button>
            </div>
            <div style={styles.body}>
              {["name", "email", "phone", "address", "notes"].map(field => (
                <div key={field} style={{ marginBottom: '12px' }}>
                  <label htmlFor={field} style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={field}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={form[field]}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              ))}
            </div>
            <div style={styles.footer}>
              <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleSubmit} style={styles.primaryBtn}>Add</button>
            </div>

          </>

        )}



      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    width: '100%', maxWidth: '500px',
    backgroundColor: '#fff', borderRadius: '8px',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)',
    display: 'flex', flexDirection: 'column',
    padding: '0px', position: 'relative'
  },
  header: {
    padding: '16px 24px',
    borderBottom: '1px solid #eee',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  closeBtn: {
    fontSize: '22px',
    background: 'none', border: 'none', cursor: 'pointer',
  },
  body: {
    padding: '20px 24px',
  },
  footer: {
    padding: '12px 24px',
    borderTop: '1px solid #eee',
    display: 'flex', justifyContent: 'flex-end', gap: '10px'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  cancelBtn: {
    backgroundColor: '#f0f0f0',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  primaryBtn: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};
