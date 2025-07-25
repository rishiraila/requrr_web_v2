'use client';
import React, { useState, useEffect, useRef } from 'react';
import AddExpenseModal from './AddExpenseModal';
import AddIncomeModal from './AddIncomeModal';
import * as XLSX from 'xlsx';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function ExpenseCalculator() {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showIncomeTable, setShowIncomeTable] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingIncome, setEditingIncome] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [sortKey, setSortKey] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const pollingInterval = useRef(null);

  useEffect(() => {
    fetchExpenses();
    fetchIncomes();
    pollingInterval.current = setInterval(() => {
      fetchExpenses();
      fetchIncomes();
    }, 10000);
    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setExpenses(data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    }
  };

  const fetchIncomes = async () => {
    try {
      const res = await fetch('/api/expenses/income', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setIncomes(data);
    } catch (error) {
      console.error('Failed to fetch incomes:', error);
    }
  };

  const handleSave = async (data, type) => {
    try {
      setIsSaving(true);
      const isEditing = !!data.id;
      const endpoint =
        type === 'expense'
          ? `/api/expenses${isEditing ? `/${data.id}` : ''}`
          : `/api/expenses/income${isEditing ? `/${data.id}` : ''}`;
      const res = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to save');
        return;
      }
      const saved = await res.json();
      if (type === 'expense') {
        const updated = isEditing
          ? expenses.map((e) => (e.id === saved.id ? saved : e))
          : [...expenses, saved];
        setExpenses(updated);
        setShowExpenseModal(false);
        setEditingExpense(null);
      } else {
        const updated = isEditing
          ? incomes.map((i) => (i.id === saved.id ? saved : i))
          : [...incomes, saved];
        setIncomes(updated);
        setShowIncomeModal(false);
        setEditingIncome(null);
      }
    } catch (err) {
      console.error('Error saving data:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const removeItem = async (id, type) => {
    try {
      const endpoint =
        type === 'expense'
          ? `/api/expenses/${id}`
          : `/api/expenses/income/${id}`;
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.ok) {
        type === 'expense' ? fetchExpenses() : fetchIncomes();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete');
      }
    } catch (err) {
      console.error('Error deleting:', err);
    }
  };

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };
  const exportToExcel = () => {
    const sheetData = showIncomeTable ? incomes : expenses;
    const data = sheetData.map((item, index) => ({
      '#': index + 1,
      Amount: item.amount,
      Category: item.category,
      Account: item.account,
      Description: item.description,
      Date: new Date(item.date).toLocaleDateString(),
    }));

    data.push({},
      { Label: 'Total Income', Value: totalIncome },
      { Label: 'Total Expense', Value: totalExpense },
      { Label: 'Profit', Value: profit },
      { Label: 'Total Transactions', Value: totalTransactions },
    );

    const worksheet = XLSX.utils.json_to_sheet(data, { skipHeader: false });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, showIncomeTable ? 'Incomes' : 'Expenses');
    XLSX.writeFile(workbook, `${showIncomeTable ? 'Incomes' : 'Expenses'}_Report.xlsx`);
  };


  const sortData = (data) => {
    return [...data].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (sortKey === 'amount') {
        return sortOrder === 'asc'
          ? parseFloat(valA) - parseFloat(valB)
          : parseFloat(valB) - parseFloat(valA);
      }
      if (sortKey === 'date') {
        return sortOrder === 'asc'
          ? new Date(valA) - new Date(valB)
          : new Date(valB) - new Date(valA);
      }
      return sortOrder === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  };

  const totalExpense = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  const totalIncome = incomes.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
  const profit = totalIncome - totalExpense;
  const totalTransactions = expenses.length + incomes.length;

  const filteredExpenses = sortData(
    expenses.filter((e) =>
      e.description?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const filteredIncomes = sortData(
    incomes.filter((i) =>
      i.description?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = pageSize === 'all' ? 1 : Math.ceil(filteredExpenses.length / pageSize);
  const paginatedExpenses =
    pageSize === 'all'
      ? filteredExpenses
      : filteredExpenses.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const pieData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expense', value: totalExpense },
    { name: 'Profit', value: profit },
  ];
  const pieColors = ['#00C49F', '#FF8042', '#0088FE'];

  // Update profit color to red if negative
  const profitColor = profit < 0 ? '#FF0000' : '#0088FE';
  const pieColorsUpdated = ['#00C49F', '#FF8042', profitColor];

  const renderSortIcon = (key) => {
    if (key !== sortKey) return null;
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  return (
    <div className="container">
      <div className="card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Expense & Income Tracker</h4>
          <div className="btn-group">
            <button className="btn btn-outline-success" onClick={() => { setEditingIncome(null); setShowIncomeModal(true); }}>+ Add Income</button>
            <button className="btn btn-outline-primary" onClick={() => { setEditingExpense(null); setShowExpenseModal(true); }}>+ Add Expense</button>
          </div>
        </div>

        <div className="row g-3 mb-3">
  <div className="col-md-6">
    <input
      type="text"
      className="form-control"
      placeholder="Search..."
      value={search}
      onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
    />
  </div>
  <div className="col-md-2">
    <select
      className="form-select"
      value={pageSize}
      onChange={(e) => {
        const value = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
        setPageSize(value);
        setCurrentPage(1);
      }}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value="all">All</option>
    </select>
  </div>
  <div className="col-md-2">
    <button className="btn btn-secondary w-100" style={{ height: '38px' }} onClick={() => setShowIncomeTable((prev) => !prev)}>
      {showIncomeTable ? 'Show Expenses' : 'Show Incomes'}
    </button>
  </div>
  <div className="col-md-2">
    <button className="btn btn-success w-100" style={{ height: '38px' }} onClick={exportToExcel}>
      Download Excel
    </button>
  </div>
</div>

        <div className="table-responsive mb-3">
          <h5>{showIncomeTable ? 'Incomes' : 'Expenses'}</h5>
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('amount')}>
                  Amount{renderSortIcon('amount')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('category')}>
                  Category{renderSortIcon('category')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('account')}>
                  Account{renderSortIcon('account')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('description')}>
                  Description{renderSortIcon('description')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('date')}>
                  Date{renderSortIcon('date')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(showIncomeTable ? filteredIncomes : paginatedExpenses).map((item, index) => (
                <tr key={item.id || index}>
                  <td>{(pageSize === 'all' ? index + 1 : (currentPage - 1) * pageSize + index + 1)}</td>
                  <td>₹{parseFloat(item.amount).toFixed(2)}</td>
                  <td>{item.category}</td>
                  <td>{item.account}</td>
                  <td>{item.description}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => {
                        if (showIncomeTable) {
                          setEditingIncome(item);
                          setShowIncomeModal(true);
                        } else {
                          setEditingExpense(item);
                          setShowExpenseModal(true);
                        }
                      }}
                      title="Edit"
                    >
                      &#9998;
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => {
                        if (showIncomeTable) {
                          removeItem(item.id, 'income');
                        } else {
                          removeItem(item.id, 'expense');
                        }
                      }}
                      title="Delete"
                    >
                      &#128465;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div className="border p-3 rounded bg-light mb-3">
              <h5>Total Income: ₹{totalIncome.toFixed(2)}</h5>
              <h5>Total Expense: ₹{totalExpense.toFixed(2)}</h5>
               <h5>Total Transactions: {totalTransactions}</h5>
              <h5 className={`fw-bold ${profit < 0 ? 'text-danger' : 'text-success'}`}>
                {profit < 0 ? 'Loss' : 'Profit'}: ₹{Math.abs(profit).toFixed(2)}
              </h5>
            </div>
            {/* <div className="border p-3 rounded bg-light">
              <h6>Total Transactions: {totalTransactions}</h6>
            </div> */}
          </div>
          <div className="col-md-6">
            <div className="bg-white shadow-sm rounded p-3">
              <h6 className="mb-3">Financial Distribution</h6>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#8884d8"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColorsUpdated[index % pieColorsUpdated.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <AddExpenseModal show={showExpenseModal} onClose={() => { setShowExpenseModal(false); setEditingExpense(null); }} onSubmit={(data) => handleSave(data, 'expense')} expense={editingExpense} mode={editingExpense ? 'edit' : 'add'} isSaving={isSaving} />
      <AddIncomeModal show={showIncomeModal} onClose={() => { setShowIncomeModal(false); setEditingIncome(null); }} onSubmit={(data) => handleSave(data, 'income')} income={editingIncome} mode={editingIncome ? 'edit' : 'add'} isSaving={isSaving} />
    </div>
  );
}
