import React, { useState } from 'react';
import axios from 'axios';
import Preloader from './Preloader'

export default function EditClient({ client, onClose, onSuccess }) {

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ ...client });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      setLoading(true); // Show loader
      const token = localStorage.getItem("token");
      await axios.put(`/api/clients/${client.id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSuccess(); // Refresh list and close
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h5 style={{ margin: 0 }}>Edit Client</h5>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        {loading ? (
          <div style={{ padding: '40px' }}>
            <Preloader />
          </div>
        ) : (

          <>

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
              <button onClick={handleUpdate} style={styles.primaryBtn}>Update</button>
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
