'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddService from './AddService';
import UpdateService from './UpdateService';

export default function ServicePage() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/Services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services', err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = pageSize === 'all' ? 1 : Math.ceil(filteredServices.length / pageSize);

  const paginatedServices = pageSize === 'all'
    ? filteredServices
    : filteredServices.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete this service?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/Services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchServices();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="container ">

      <div className='card p-5'>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>All Services</h4>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add Service</button>
        </div>

        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search services..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
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

        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th>Service Name</th>
              <th>Description</th>
              <th>Default Duration</th>
              <th>Default Price</th>
              <th>Added On</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedServices.length === 0 ? (
              <tr><td colSpan="6" className="text-center">No services found.</td></tr>
            ) : (
              paginatedServices.map(service => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{service.description}</td>
                  <td>
                    {service.billing_type === 'recurring' && service.billing_interval
                      ? `${service.billing_interval} months`
                      : 'One-time'}
                  </td>
                  <td>₹{parseFloat(service.base_price).toFixed(2)}</td>
                  <td>{new Date(service.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setEditingService(service)}>
                      <i className="ri-edit-line"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(service.id)}>
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

        {showAddModal && <AddService onClose={() => setShowAddModal(false)} onSuccess={() => { setShowAddModal(false); fetchServices(); }} />}
        {editingService && <UpdateService service={editingService} onClose={() => setEditingService(null)} onSuccess={() => { setEditingService(null); fetchServices(); }} />}

      </div>
    </div>
  );
}
