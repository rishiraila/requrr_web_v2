"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserInsightsPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/users/insights', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data.insights);
      } catch (error) {
        console.error('Error fetching insights:', error);
      }
    };

    fetchData();
  }, []);

  const filtered = data.filter(
    (user) =>
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      (user.username?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const totalPages = pageSize === 'all' ? 1 : Math.ceil(filtered.length / pageSize);

  const paginated = pageSize === 'all'
    ? filtered
    : filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="container">
      <div className='card p-5'>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>User Insights</h4>
        </div>

        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search by email or username"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="form-select w-auto"
            value={pageSize}
            onChange={(e) => {
              const value = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
              setPageSize(value);
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value="all">All</option>
          </select>
        </div>

        <div className='table-responsive'>
          <table className="table table-striped">
            <thead className="table-light">
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>Clients</th>
                <th>Services</th>
                <th>Renewals</th>
                <th>Paid (₹)</th>
                <th>Plan</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan="8" className="text-center">No users found.</td></tr>
              ) : (
                paginated.map(user => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.username || 'N/A'}</td>
                    <td>{user.total_clients}</td>
                    <td>{user.total_services}</td>
                    <td>{user.total_renewals}</td>
                    <td>{parseFloat(user.total_paid).toFixed(2)}</td>
                    <td>{user.plan}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedUser(user)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pageSize !== 'all' && totalPages > 1 && (
          <div className="d-flex justify-content-end align-items-center gap-2">
            <button className="btn btn-sm btn-outline-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button className="btn btn-sm btn-outline-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
          </div>
        )}
      </div>

      {/* Popup Modal */}
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
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '900px',
              maxHeight: '90%',
              overflowY: 'auto'
            }}
          >
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
                {selectedUser.paid_transactions.map(t => (
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
              <button className='btn btn-danger mt-3' onClick={() => setSelectedUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
