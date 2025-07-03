"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/transactions/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data.users);
      } catch (err) {
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filtered = data.filter((user) =>
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    (user.username?.toLowerCase() || '').includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <div className="card p-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>User Transactions</h4>
        </div>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search by email or username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? <p>Loading...</p> : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="table-light">
                <tr>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Plan</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Total Paid</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="7" className="text-center">No records found.</td></tr>
                ) : (
                  filtered.map(user => (
                    <tr key={user.email}>
                      <td>{user.email}</td>
                      <td>{user.username}</td>
                      <td>{user.plan}</td>
                      <td>{user.plan_start ? new Date(user.plan_start).toLocaleDateString() : 'N/A'}</td>
                      <td>{user.plan_end ? new Date(user.plan_end).toLocaleDateString() : 'N/A'}</td>
                      <td>₹{parseFloat(user.total_paid).toFixed(2)}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedUser(user)}>View</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUser && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '90%', maxWidth: '900px', maxHeight: '90%', overflowY: 'auto' }}>
            <h5>Transactions for {selectedUser.email}</h5>
            <table className="table table-bordered mt-3">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Client ID</th>
                  <th>Amount</th>
                  <th>Payment Date</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {selectedUser.transactions.map(t => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.client_id}</td>
                    <td>₹{parseFloat(t.amount).toFixed(2)}</td>
                    <td>{new Date(t.payment_date).toLocaleDateString()}</td>
                    <td>{t.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-end">
              <button className="btn btn-danger mt-3" onClick={() => setSelectedUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
