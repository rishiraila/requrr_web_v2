'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Preloader from '@/app/components/Preloader';
import countries from 'world-countries';


export default function AccountSettingsPage() {

  const countryOptions = countries.map(c => ({
    name: c.name.common,
    cca2: c.cca2,
    callingCode: c.idd?.root ? `${c.idd.root}${(c.idd.suffixes?.[0] || '')}` : ''
  })).sort((a, b) => a.name.localeCompare(b.name));

  const [loading, setLoading] = useState(true);
  // const [form, setForm] = useState({
  //   username: '',
  //   email: ''
  // });

  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    country_code: '',
    phone_code: '',
    phone: ''
  });
  const [subscription, setSubscription] = useState(null);
  const [confirmedDelete, setConfirmedDelete] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Load user data
    axios.get('/api/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setForm({
        username: res.data.username || '',
        email: res.data.email || '',
        first_name: res.data.first_name || '',
        last_name: res.data.last_name || '',
        country_code: res.data.country_code || '',
        phone_code: res.data.phone_code || '',
        phone: res.data.phone || ''
      });
      // setForm({ username: res.data.username, email: res.data.email });
    }).catch(err => {
      console.error('Failed to load profile', err);
    });

    // Load subscription
    axios.get('/api/subscription/status', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (res.data.subscribed) {
        setSubscription(res.data);
      }
    }).catch(err => {
      console.error('Failed to load subscription', err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put('/api/users/update-profile', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile updated!');
    } catch (err) {
      alert('Update failed');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete('/api/users/delete-account', {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Account deleted. Redirecting to home...');
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (err) {
      alert('Failed to delete account');
      console.error(err);
    }
  };

  if (loading) return <Preloader />;

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="row">
        <div className="col-md-12">
          <ul className="nav nav-pills flex-column flex-md-row mb-4">
            <li className="nav-item me-2">
              <Link className="nav-link" href="/notification-preferences">
                <i className="ri-notification-2-line me-2"></i> Notification
              </Link>
            </li>
            <li className="nav-item me-2">
              <Link className="nav-link active" href="javascript:void(0);">
                <i className="ri-user-3-line me-2"></i> Account
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/Accounts/Security">
                <i className="ri-lock-line me-2"></i> Security
              </Link>
            </li>
          </ul>

          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleUpdate}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="text" name="username" value={form.username} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="first_name" className="form-label">First Name</label>
                    <input type="text" name="first_name" value={form.first_name} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="last_name" className="form-label">Last Name</label>
                    <input type="text" name="last_name" value={form.last_name} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Country</label>
                    <select
                      name="country_code"
                      value={form.country_code}
                      onChange={(e) => {
                        const selected = countryOptions.find(c => c.cca2 === e.target.value);
                        setForm(prev => ({
                          ...prev,
                          country_code: selected.cca2,
                          phone_code: selected.callingCode
                        }));
                      }}
                      className="form-select"
                    >
                      <option value="">Select a country</option>
                      {countryOptions.map(c => (
                        <option key={c.cca2} value={c.cca2}>
                          {c.name} ({c.callingCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Phone Code</label>
                    <input type="text" name="phone_code" value={form.phone_code} readOnly className="form-control" />
                  </div>

                  <div className="col-md-4">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input type="text" name="phone" value={form.phone} onChange={handleChange} className="form-control" />
                  </div>


                  {subscription && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label">Current Plan</label>
                        <input type="text" value={subscription.plan_name} className="form-control" readOnly />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Price Paid (₹)</label>
                        <input type="text" value={subscription.price} className="form-control" readOnly />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Start Date</label>
                        <input type="text" value={new Date(subscription.start_date).toLocaleDateString()} className="form-control" readOnly />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">End Date</label>
                        <input type="text" value={new Date(subscription.end_date).toLocaleDateString()} className="form-control" readOnly />
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-4">
                  <button type="submit" className="btn btn-primary me-2">Save Changes</button>
                  <button type="reset" className="btn btn-outline-secondary">Reset</button>
                </div>
              </form>
            </div>
          </div>

          <div className="card">
            <h5 className="card-header">Delete Account</h5>
            <div className="card-body">
              <div className="alert alert-warning">
                <h6>Are you sure you want to delete your account?</h6>
                <p>This action is permanent and cannot be undone.</p>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={confirmedDelete}
                  onChange={() => setConfirmedDelete(!confirmedDelete)}
                  id="confirmDelete"
                />
                <label className="form-check-label" htmlFor="confirmDelete">
                  I confirm my account deletion
                </label>
              </div>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={!confirmedDelete}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}