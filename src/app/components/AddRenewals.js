import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Preloader from './Preloader';
import Link from 'next/link';

export default function AddRenewals({ onClose, onSuccess }) {

  const [limitError, setLimitError] = useState('');

  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    client_id: '',
    service_id: '',
    amount: '',
    payment_date: '',
    due_date: '',
    status: 'pending',
    is_recurring: 0,
    recurrence_id: '',
    notes: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/clients', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setClients(res.data));
    axios.get('/api/Services', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setServices(res.data));
  }, []);

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   if (name === 'service_id') {
  //     const selectedService = services.find(s => String(s.id) === value);
  //     setForm(prev => ({
  //       ...prev,
  //       [name]: value,
  //       amount: selectedService ? selectedService.base_price : ''
  //     }));
  //   } else {
  //     setForm(prev => ({
  //       ...prev,
  //       [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
  //     }));
  //   }
  // };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'service_id') {
      const selectedService = services.find(s => String(s.id) === value);
      setForm(prev => ({
        ...prev,
        [name]: value,
        amount: selectedService ? selectedService.base_price : '',
      }));
    } else if (name === 'payment_date') {
      const selectedService = services.find(s => String(s.id) === String(form.service_id));

      let newForm = {
        ...form,
        [name]: value
      };

      if (
        form.is_recurring &&
        selectedService &&
        selectedService.billing_interval
      ) {
        const startDate = new Date(value);
        let endDate = new Date(startDate);

        switch (selectedService.billing_interval) {
          case 'weekly':
            endDate.setDate(endDate.getDate() + 7);
            break;
          case 'monthly':
            endDate.setMonth(endDate.getMonth() + 1);
            break;
          case 'quarterly':
            endDate.setMonth(endDate.getMonth() + 3);
            break;
          case 'yearly':
            endDate.setFullYear(endDate.getFullYear() + 1);
            break;
          default:
            break;
        }

        newForm.due_date = endDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      }

      setForm(newForm);
    } else {
      setForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
      }));
    }
  };


  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true); // 
      await axios.post('/api/income_records', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLimitError('');
      onSuccess();
    } catch (err) {
      // console.error('Failed to add renewal', err);
      if (err.response && err.response.status === 403) {
        setLimitError(err.response.data.error || 'You have reached your plan limit.');
      } else {
        console.error('Failed to add renewal', err);
        setLimitError('Something went wrong.');
      }
    } finally {
      setLoading(false); // 👈 Hide loader after response
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
              <h5>Add Renewal</h5>
              <button onClick={onClose} style={styles.closeBtn}>×</button>
            </div>

            <div style={styles.body}>
              <label htmlFor="client_id">Client</label>
              <select name="client_id" value={form.client_id} onChange={handleChange} style={styles.input}>
                <option value="">Select Client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <label htmlFor="service_id">Service</label>
              <select name="service_id" value={String(form.service_id)} onChange={handleChange} style={styles.input}>
                <option value="">Select Service</option>
                {services.map(s => <option key={s.id} value={String(s.id)}>{s.name}</option>)}
              </select>

              <label htmlFor="amount">Amount</label>
              <input type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} style={styles.input} />

              <label htmlFor="status">Status</label>
              <select name="status" value={form.status} onChange={handleChange} style={styles.input}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <label htmlFor="payment_date">Start Date</label>
                  <input type="date" name="payment_date" value={form.payment_date} onChange={handleChange} style={styles.input} />
                </div>


                <div>
                  <label htmlFor="due_date">End Date</label>
                  <input type="date" name="due_date" value={form.due_date} onChange={handleChange} style={styles.input} />
                </div>

              </div>

              <label><input type="checkbox" name="is_recurring" checked={!!form.is_recurring} onChange={handleChange} /> Recurring</label>
              <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} style={styles.input}></textarea>
            </div>

            {limitError && (
              <div style={{ color: 'red', marginBottom: '12px', fontSize: '14px' }} className='ps-4'>
                {limitError} - <Link href="/Subscriptions">Subscribe now</Link>
              </div>
            )}
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
