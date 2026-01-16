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

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token')
    : null;

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/requrring_expenses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data || []);
    } catch (err) {
      console.error('Failed to fetch recurring expenses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const filtered = expenses.filter(e =>
    e.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages =
    pageSize === 'all' ? 1 : Math.ceil(filtered.length / pageSize);

  const paginated =
    pageSize === 'all'
      ? filtered
      : filtered.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        );

  const handleDelete = async (id) => {
    if (!confirm('Delete this recurring expense?')) return;
    try {
      await axios.delete(`/api/requrring_expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
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
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            + Add Recurring Expense
          </button>
        </div>

        <div className="d-flex gap-3 mb-3">
          <select
            className="form-select form-select-sm w-auto"
            value={pageSize}
            onChange={(e) => {
              const v = e.target.value === 'all' ? 'all' : Number(e.target.value);
              setPageSize(v);
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
            className="form-control form-control-sm w-auto"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Next Run Date</th>
                <th>Frequency</th>
                <th>Status</th>
                <th>Category</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    No recurring expenses found
                  </td>
                </tr>
              ) : (
                paginated.map(exp => (
                  <tr key={exp.id}>
                    <td>{exp.title}</td>
                    <td>₹{Number(exp.amount).toFixed(2)}</td>
                    <td>
                      {exp.next_run_date
                        ? new Date(exp.next_run_date).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="text-capitalize">{exp.frequency}</td>
                    <td>
                      <span className={`badge ${exp.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                        {exp.status}
                      </span>
                    </td>
                    <td>{exp.category_name || '-'}</td>
                    <td>{exp.notes || '-'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => setEditingExpense(exp)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(exp.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pageSize !== 'all' && totalPages > 1 && (
          <div className="d-flex justify-content-end gap-2">
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
