'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';

export default function SecurityPage() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (form.newPassword !== form.confirmPassword) {
      return setMessage('❌ New and confirm passwords do not match');
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/users/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || '❌ Failed to change password');
    }
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="row">
        <div className="col-md-12">
          <div className="nav-align-top">
            <ul className="nav nav-pills flex-column flex-md-row mb-4 gap-2 gap-lg-0">
              <li className="nav-item me-2">
                <Link className="nav-link " href="/notification-preferences"
                ><i className="ri-notification-2-line me-2"></i> Notification</Link>
              </li>
              <li className="nav-item me-2">
                <Link className="nav-link" href="/Accounts/Account"><i className="ri-user-3-line me-2"></i> Account</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" href="/Accounts/Security"><i className="ri-lock-line me-2"></i> Security</Link>
              </li>
            </ul>
          </div>

          {/* Change Password Form */}
          <div className="card mb-4">
            <h5 className="card-header">Change Password</h5>
            <div className="card-body pt-1">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="mb-4 col-md-6 form-password-toggle">
                    <div className="input-group input-group-merge">
                      <input
                        type="password"
                        className="form-control"
                        name="currentPassword"
                        value={form.currentPassword}
                        onChange={handleChange}
                        placeholder="Current Password"
                        required
                      />
                      <span className="input-group-text cursor-pointer"><i className="ri-eye-off-line"></i></span>
                    </div>
                  </div>
                </div>

                <div className="row g-4 mb-4">
                  <div className="col-md-6 form-password-toggle">
                    <div className="input-group input-group-merge">
                      <input
                        type="password"
                        className="form-control"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        placeholder="New Password"
                        required
                      />
                      <span className="input-group-text cursor-pointer"><i className="ri-eye-off-line"></i></span>
                    </div>
                  </div>
                  <div className="col-md-6 form-password-toggle">
                    <div className="input-group input-group-merge">
                      <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                      />
                      <span className="input-group-text cursor-pointer"><i className="ri-eye-off-line"></i></span>
                    </div>
                  </div>
                </div>

                <h6 className="text-body">Password Requirements:</h6>
                <ul className="ps-4 mb-4">
                  <li className="mb-2">Minimum 8 characters long</li>
                  <li className="mb-2">At least one lowercase character</li>
                  <li>At least one number, symbol, or whitespace character</li>
                </ul>

                {message && <div className="alert alert-info">{message}</div>}

                <div className="mt-3">
                  <button type="submit" className="btn btn-primary me-3">Save changes</button>
                  <button type="reset" className="btn btn-outline-secondary" onClick={() => setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })}>Reset</button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
