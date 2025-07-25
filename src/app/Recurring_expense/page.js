'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddRecurringExpense from './addexpense';

import UpdateRecurringExpense from './editexpense';
import Preloader from '../components/Preloader';

export default function RecurringExpensesPage() {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const res = await axios.get('/api/requrring_expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data);
    } catch (err) {
      console.error('Failed to fetch recurring expenses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filtered = expenses.filter((e) =>
    (e.title?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const totalPages = pageSize === 'all' ? 1 : Math.ceil(filtered.length / pageSize);
  const paginated = pageSize === 'all'
    ? filtered
    : filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!confirm('Delete this expense?')) return;
    try {
      await axios.delete(`/api/requrring_expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExpenses();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  if (loading) return <Preloader />;

  return (
    <div className="container">
      <div className="card p-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Recurring Expenses</h4>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add Expense</button>
        </div>

        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search title..."
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

        <div className='table-responsive'>
          <table className="table table-striped">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Start Date</th>
                <th>Due Date</th>
                <th>Frequency</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan="8" className="text-center">No recurring expenses found.</td></tr>
              ) : (
                paginated.map(expense => (
                  <tr key={expense.id}>
                    <td>{expense.title}</td>
                    <td>₹{parseFloat(expense.amount).toFixed(2)}</td>
                    <td>{new Date(expense.payment_date).toLocaleDateString()}</td>
                    <td>{expense.due_date ? new Date(expense.due_date).toLocaleDateString() : '-'}</td>
                    <td>{expense.frequency}</td>
                    <td>
                      <span className={`badge ${
                        expense.status === 'paid' ? 'bg-primary' :
                        expense.status === 'pending' ? 'bg-warning text-white' :
                        expense.status === 'cancelled' ? 'bg-dark' :
                        'bg-secondary'
                      }`}>
                        {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                      </span>
                    </td>
                    <td>{expense.notes || '-'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => setEditingExpense(expense)}
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(expense.id)}
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
          <AddRecurringExpense
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              fetchExpenses();
            }}
          />
        )}

        {editingExpense && (
          <UpdateRecurringExpense
            record={editingExpense}
            onClose={() => setEditingExpense(null)}
            onSuccess={() => {
              setEditingExpense(null);
              fetchExpenses();
            }}
          />
        )}
      </div>
    </div>
  );
}
