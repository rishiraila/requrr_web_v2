'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddRenewals from './AddRenewals';
import UpdateRenewals from './UpdateRenewals';
import Preloader from './Preloader';
import DatePicker from 'react-datepicker';

export default function RenewalPage() {

  const [showEndDateFilter, setShowEndDateFilter] = useState(false);
  const [endDateFrom, setEndDateFrom] = useState(null);
  const [endDateTo, setEndDateTo] = useState(null);


  const [loading, setLoading] = useState(true);

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
      setLoading(true); // Start loading
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
          company_name: client?.company_name || '',
          service_name: service?.name || '—',
          duration: service?.billing_interval || 'N/A'
        };
      }).sort((a, b) => {
        const dateA = new Date(a.due_date || a.payment_date);
        const dateB = new Date(b.due_date || b.payment_date);
        return dateA - dateB; // Ascending: soonest date first
      });


      setRecords(enriched);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = records.filter((r) => {
    const matchesSearch =
      (r.client_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (r.service_name?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const endDate = r.due_date ? new Date(r.due_date) : null;

    const matchesEndDate =
      (!endDateFrom || (endDate && endDate >= endDateFrom)) &&
      (!endDateTo || (endDate && endDate <= endDateTo));

    return matchesSearch && matchesEndDate;
  });



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

  if (loading) {
    return <Preloader />;
  }

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

        {/* <div className="row mb-3">
          <div className="col">
            <label>End Date From</label>
            <DatePicker
              selected={endDateFrom}
              onChange={(date) => setEndDateFrom(date)}
              placeholderText="From"
              className="form-control"
            />
          </div>
          <div className="col">
            <label>End Date To</label>
            <DatePicker
              selected={endDateTo}
              onChange={(date) => setEndDateTo(date)}
              placeholderText="To"
              className="form-control"
            />
          </div>
        </div> */}

        
{showEndDateFilter && (
          <tbody>
            <tr>
              <td colSpan="10">
                <div className="row p-3 border rounded mb-3">
                  <div className="col-md-6 mb-2">
                    <label>End Date From</label><br/>
                    <DatePicker
                      selected={endDateFrom}
                      onChange={(date) => setEndDateFrom(date)}
                      placeholderText="Select From"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label>End Date To</label><br/>
                    <DatePicker
                      selected={endDateTo}
                      onChange={(date) => setEndDateTo(date)}
                      placeholderText="Select To"
                      className="form-control"
                    />
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        )}

        <div className='table-responsive'>
          <table className="table table-striped">
            <thead className="table-light">
              <tr>
                <th>Client</th>
                <th>Company</th>
                <th>Service</th>
                <th>Duration</th> {/* ✅ Add this */}
                <th>Start Date</th>
                <th style={{ cursor: 'pointer' }} onClick={() => setShowEndDateFilter(prev => !prev)}>End Date {showEndDateFilter ? '▴' : '▾'}

                </th>
                <th>Amount</th>
                <th>Status</th>
                <th>Description</th> {/* ✅ Add this */}
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
                    <td><small className="text-primary">{record.company_name}</small></td>
                    <td>{record.service_name}</td>
                    <td>
                      {record.duration !== 'N/A' ? `${record.duration} month(s)` : '—'}
                    </td>
                    <td>{new Date(record.payment_date).toLocaleDateString()}</td>
                    <td>{record.due_date ? new Date(record.due_date).toLocaleDateString() : '-'} </td>
                    <td>₹{parseFloat(record.amount).toFixed(2)}</td>
                    {/* <td>{record.status}</td> */}
                    <td>
                      <span className={`badge ${record.status === 'paid' ? 'bg-primary' :
                        record.status === 'pending' ? 'bg-warning text-white' :
                          record.status === 'overdue' ? 'bg-danger' :
                            record.status === 'cancelled' ? 'bg-dark' :
                              'bg-secondary'
                        }`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>

                    <td>{record.notes || '-'}</td> {/* ✅ Show description */}
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
        </div>

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
