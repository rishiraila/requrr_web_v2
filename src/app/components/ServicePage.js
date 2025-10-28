'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddService from './AddService';
import UpdateService from './UpdateService';
import Preloader from './Preloader';

import { useAppContext } from '../context/AppContext';

export default function ServicePage() {

    const { setClientCount, setServiceCount } = useAppContext();


  const [loading, setLoading] = useState(true);

  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true); // Show preloader
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/Services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(res.data);
      setServiceCount(res.data.length)
    } catch (err) {
      console.error('Error fetching services', err);
    } finally {
      setLoading(false); // Hide preloader
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

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="container ">

      <div className='card p-5'>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>All Services</h4>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add Service</button>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3 gap-3 flex-nowrap">
          <div className="d-flex gap-3 align-items-center">
            <label className="mb-0 fw-semibold">Show</label>
            <select
              className="form-select form-select-sm w-auto"
              value={pageSize}
              onChange={e => {
                const value = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
                setPageSize(value);
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value="all">All</option>
            </select>
            <input
              type="text"
              className="form-control border mt-3 form-select-sm w-auto"
              style={{ maxWidth: "200px" }}
              placeholder="Search services..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className='table-responsive'>
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
        </div>


        {pageSize !== 'all' && totalPages > 1 && (
          <div className="d-flex justify-content-end align-items-center mt-3 gap-2 me-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span className="fw-medium">Page {currentPage} of {totalPages}</span>
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        )}

        {showAddModal && <AddService onClose={() => setShowAddModal(false)} onSuccess={() => { setShowAddModal(false); fetchServices(); }} />}
        {editingService && <UpdateService service={editingService} onClose={() => setEditingService(null)} onSuccess={() => { setEditingService(null); fetchServices(); }} />}

      </div>
    </div>
  );
}
