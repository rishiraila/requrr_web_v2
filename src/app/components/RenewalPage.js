'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddRenewals from './AddRenewals';
import UpdateRenewals from './UpdateRenewals';

export default function RenewalPage() {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // ✅ Reusable fetch that joins client and service names
  const fetchAll = async () => {
    const token = localStorage.getItem('token');
    try {
      const [clientsRes, servicesRes, recordsRes] = await Promise.all([
        axios.get('/api/clients', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/Services', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/income_records', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const clients = clientsRes.data;
      const services = servicesRes.data;

      const enriched = recordsRes.data.map(record => {
        const client = clients.find(c => c.id === record.client_id);
        const service = services.find(s => s.id === record.service_id);
        return {
          ...record,
          client_name: client?.name || '—',
          service_name: service?.name || '—'
        };
      });

      setRecords(enriched);
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = records.filter(r =>
    (r.client_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (r.service_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const totalPages = pageSize === 'all' ? 1 : Math.ceil(filtered.length / pageSize);
  const paginated = pageSize === 'all'
    ? filtered
    : filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!confirm('Delete this record?')) return;
    try {
      await axios.delete(`/api/income_records/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAll(); // ✅ re-fetch enriched data
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (

    <div className="container">
      <div className='card p-5'>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>All Renewals</h4>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add Renewal</button>
        </div>

        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
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

        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th>Client</th>
              <th>Service</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan="7" className="text-center">No records found.</td></tr>
            ) : (
              paginated.map(record => (
                <tr key={record.id}>
                  <td>{record.client_name}</td>
                  <td>{record.service_name}</td>
                  <td>{new Date(record.payment_date).toLocaleDateString()}</td>
                  <td>{record.due_date ? new Date(record.due_date).toLocaleDateString() : '-'}</td>
                  <td>₹{parseFloat(record.amount).toFixed(2)}</td>
                  <td>{record.status}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => setEditingRecord(record)}
                    >
                      <i className="ri-edit-line"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(record.id)}
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {pageSize !== 'all' && totalPages > 1 && (
          <div className="d-flex justify-content-end align-items-center gap-2">
            <button className="btn btn-sm btn-outline-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button className="btn btn-sm btn-outline-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
          </div>
        )}

        {showAddModal && (
          <AddRenewals
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              fetchAll();
            }}
          />
        )}

        {editingRecord && (
          <UpdateRenewals
            record={editingRecord}
            onClose={() => setEditingRecord(null)}
            onSuccess={() => {
              setEditingRecord(null);
              fetchAll();
            }}
          />
        )}
      </div>
    </div>
  );
}
