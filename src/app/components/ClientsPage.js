'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddClient from './AddClient';
import EditClient from './EditClient';
import Preloader from '../components/Preloader'

import { useAppContext } from '../context/AppContext';

export default function ClientsPage() {

  const { setClientCount, setServiceCount } = useAppContext();

  const [loading, setLoading] = useState(true);

  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingClient, setEditingClient] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get('/api/clients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(res.data);
      setClientCount(res.data.length);

    } catch (err) {
      console.error("Error fetching clients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  const totalPages = pageSize === 'all' ? 1 : Math.ceil(filteredClients.length / pageSize);
  const paginatedClients = pageSize === 'all'
    ? filteredClients
    : filteredClients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async (id) => {
    if (!confirm("Delete this client?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/clients/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchClients();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="container">

      <div className='card p-5'>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>All Clients</h4>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Client
          </button>
        </div>

        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="form-select w-auto"
            value={pageSize}
            onChange={e => {
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
          <table className="table table-striped ">
            <thead className="table-light">
              <tr>
                <th>Company</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Added On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No clients found.</td>
                </tr>
              ) : (
                paginatedClients.map(client => (
                  <tr key={client.id}>
                    <td>{client.company_name || '-'}</td>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td>{new Date(client.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => setEditingClient(client)}
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(client.id)}
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
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        )}

        {showAddModal && (
          <AddClient onClose={() => setShowAddModal(false)} onSuccess={() => {
            setShowAddModal(false);
            fetchClients();
          }} />
        )}

        {editingClient && (
          <EditClient client={editingClient} onClose={() => setEditingClient(null)} onSuccess={() => {
            setEditingClient(null);
            fetchClients();
          }} />
        )}
      </div>

    </div>
  );
}
