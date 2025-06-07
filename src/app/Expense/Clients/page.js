// 'use client';
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function ClientsPage() {
//     const [clients, setClients] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [pageSize, setPageSize] = useState(5);
//     const [currentPage, setCurrentPage] = useState(1);

//     const fetchClients = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             const res = await axios.get('/api/clients', {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setClients(res.data);
//         } catch (err) {
//             console.error("Error fetching clients", err);
//         }
//     };

//     useEffect(() => {
//         fetchClients();
//     }, []);

//     const filteredClients = clients.filter(client =>
//         client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         client.phone?.includes(searchTerm)
//     );

//     const totalPages = pageSize === 'all' ? 1 : Math.ceil(filteredClients.length / pageSize);

//     const paginatedClients = pageSize === 'all'
//         ? filteredClients
//         : filteredClients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this client?")) return;

//         try {
//             const token = localStorage.getItem("token");
//             await axios.delete(`/api/clients/${id}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             fetchClients(); // refresh list
//         } catch (err) {
//             console.error("Delete failed", err);
//         }
//     };

//     return (
//         <div className='card'>

//             <div className="container mt-5">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                     <h4>All Clients</h4>
//                     <div className="d-flex align-items-center gap-2">
//                         <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Search clients..."
//                             value={searchTerm}
//                             onChange={e => {
//                                 setSearchTerm(e.target.value);
//                                 setCurrentPage(1);
//                             }}
//                         />
//                         <select
//                             className="form-select w-auto"
//                             value={pageSize}
//                             onChange={e => {
//                                 const value = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
//                                 setPageSize(value);
//                                 setCurrentPage(1);
//                             }}
//                         >
//                             <option value={5}>5</option>
//                             <option value={10}>10</option>
//                             <option value={25}>25</option>
//                             <option value="all">All</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="table-responsive mb-4">
//                     <table className="table table-striped ">
//                         <thead className="table-light">
//                             <tr>
//                                 <th>Name</th>
//                                 <th>Email</th>
//                                 <th>Phone</th>
//                                 <th>Added On</th>
//                                 <th>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {paginatedClients.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="5" className="text-center">No clients found.</td>
//                                 </tr>
//                             ) : (
//                                 paginatedClients.map(client => (
//                                     <tr key={client.id}>
//                                         <td>{client.name}</td>
//                                         <td>{client.email}</td>
//                                         <td>{client.phone}</td>
//                                         <td>{new Date(client.created_at).toLocaleDateString()}</td>
//                                         <td>
//                                             <button
//                                                 className="btn btn-sm btn-outline-primary me-2"
//                                                 onClick={() => alert("Redirect to edit form for client ID: " + client.id)}
//                                             >
//                                                 <i className="ri-edit-line"></i>
//                                             </button>
//                                             <button
//                                                 className="btn btn-sm btn-outline-danger"
//                                                 onClick={() => handleDelete(client.id)}
//                                             >
//                                                 <i className="ri-delete-bin-line"></i>
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {pageSize !== 'all' && totalPages > 1 && (
//                     <div className="d-flex justify-content-end align-items-center gap-2">
//                         <button
//                             className="btn btn-sm btn-outline-secondary"
//                             disabled={currentPage === 1}
//                             onClick={() => setCurrentPage(p => p - 1)}
//                         >
//                             Prev
//                         </button>
//                         <span className="fw-medium">Page {currentPage} of {totalPages}</span>
//                         <button
//                             className="btn btn-sm btn-outline-secondary"
//                             disabled={currentPage === totalPages}
//                             onClick={() => setCurrentPage(p => p + 1)}
//                         >
//                             Next
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }


import React from 'react'
import ClientsPage from '../../components/ClientsPage'

export default function Page() {
    return (
        <div>

            <ClientsPage />

        </div>
    )
}
