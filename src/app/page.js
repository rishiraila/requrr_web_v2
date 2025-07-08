'use client'
import 'react-calendar/dist/Calendar.css'; // move to top!
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // default styles
import UpdateRenewals from './components/UpdateRenewals'; // adjust the path if needed

import Preloader from './components/Preloader';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {

  const [loading, setLoading] = useState(true);

  const [clientCount, setClientCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [pendingRevenue, setPendingRevenue] = useState(0);

  const [totalIncomeAmount, setTotalIncomeAmount] = useState(0);

  const [editingRecord, setEditingRecord] = useState(null);

  const [Subscriptions, setSubscriptions] = useState([])

  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(5); // Default to 5 rows
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedDate, setSelectedDate] = useState(null);

  const [expenseFilter, setExpenseFilter] = useState('6m'); // '6m', '12m', 'all'

  const totalRenewalsCount = Subscriptions.length;

  const totalRenewalAmountReceived = Subscriptions
    .filter(sub => sub.status === 'paid')
    .reduce((sum, sub) => sum + parseFloat(sub.amount || 0), 0);

  useEffect(() => {
    const incomeSubscriptions = Subscriptions; // Filter for income
    const expenseSubscriptions = []; // Filter for expense

    const sortedIncomeSubscriptions = incomeSubscriptions.sort((a, b) => {
      return parseFloat(a.amount) - parseFloat(b.amount); // Sort by amount (ascending)
    });

    const sortedExpenseSubscriptions = expenseSubscriptions.sort((a, b) => {
      return parseFloat(a.amount) - parseFloat(b.amount); // Sort by amount (ascending)
    });

    // setIncome(sortedIncomeSubscriptions); // Update the Income state
    // setExpense(sortedExpenseSubscriptions); // Update the Expense state

    // Step 1: Create a map to hold unique entities and their total amounts for income
    const entityMap = {};

    incomeSubscriptions.forEach(sub => {
      const entityName = sub.client_name;
      const amount = parseFloat(sub.amount);

      // If the entity already exists, add the amount to its total
      if (entityMap[entityName]) {
        entityMap[entityName] += amount;
      } else {
        // If it doesn't exist, create a new entry
        entityMap[entityName] = amount;
      }
    });

    // Step 2: Convert the entityMap to an array of objects
    const uniqueEntitiesWithAmounts = Object.keys(entityMap).map(entity => ({
      entity_name: entity,
      total_amount: entityMap[entity],
    }));

    console.log(uniqueEntitiesWithAmounts)

    // setIncomeEntities(uniqueEntitiesWithAmounts); // Update the IncomeEntities state with unique entities and their total amounts

    // expense
    const expenseEntityMap = {}; // Correctly initialize the map for expenses

    expenseSubscriptions.forEach(sub => {
      const entityName = sub.client_name; // Use a different variable name
      const amount = parseFloat(sub.amount);

      // If the entity already exists, add the amount to its total
      if (expenseEntityMap[entityName]) {
        expenseEntityMap[entityName] += amount;
      } else {
        // If it doesn't exist, create a new entry
        expenseEntityMap[entityName] = amount;
      }
    });

    // Step 2: Convert the expenseEntityMap to an array of objects
    const expenseUniqueEntitiesWithAmounts = Object.keys(expenseEntityMap).map(entity => ({
      entity_name: entity,
      total_amount: expenseEntityMap[entity], // Use expenseEntityMap here
    }));

    console.log(expenseUniqueEntitiesWithAmounts)

    // setExpenseEntities(expenseUniqueEntitiesWithAmounts); // Update the ExpenseEntities state with unique entities and their total amounts
  }, [Subscriptions]);


  const fetchSubscriptions = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/Login";
      return;
    }

    try {
      // Fetch both upcoming records and client list
      const [recordsRes, clientsRes] = await Promise.all([
        axios.get("/api/income_records/upcoming", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("/api/clients", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const clients = clientsRes.data;
      const incomeRecords = recordsRes.data;

      // Add category and company_name without skipping anything
      const subscriptions = incomeRecords.map(record => {
        const client = clients.find(c => c.id === record.client_id);
        return {
          ...record,
          category: 'income',
          client_name: client?.name || '—',
          company_name: client?.company_name || ''
        };
      });

      setSubscriptions(subscriptions); // ✅ Still uses enriched `/api/income_records/upcoming` response

    } catch (err) {
      console.error("Error fetching subscriptions or clients:", err);
    }
  };


  const fetchTotalIncomeAmount = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.get("/api/income_records", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allRecords = response.data;
      const total = allRecords.reduce((sum, record) => sum + parseFloat(record.amount || 0), 0);
      setTotalIncomeAmount(total);
    } catch (error) {
      console.error("Error fetching total income amount:", error);
    }
  };

  const fetchClientCount = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/api/clients", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClientCount(res.data.length);
    } catch (err) {
      console.error("Error fetching clients:", err);
    }
  };

  const fetchServiceCount = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/api/Services", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServiceCount(res.data.length);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  const fetchPendingRevenue = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("/api/income_records", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const pendingTotal = res.data
        .filter(rec => rec.status === 'pending')
        .reduce((sum, rec) => sum + parseFloat(rec.amount || 0), 0);

      setPendingRevenue(pendingTotal);
    } catch (err) {
      console.error("Error fetching pending revenue:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchSubscriptions(),
        fetchTotalIncomeAmount(),
        fetchClientCount(),
        fetchServiceCount(),
        fetchPendingRevenue(),
        fetchUserData()
      ]);
      setLoading(false); // Hide preloader after all API calls are done
    };

    loadData();
  }, []);


  // Calculate remaining payments
  const calculateRemainingPayments = () => {
    return Subscriptions.map(sub => {
      const remainingAmount = parseFloat(sub.remainingAmount);
      const category = sub.category;

      return {
        ...sub,
        remainingPayment: parseFloat(sub.amount), // Positive for income, negative for expense
      };
    });
  };

  const updatedSubscriptions = calculateRemainingPayments();

  // Group subscriptions by entity
  const groupByEntity = (subscriptions) => {
    return subscriptions.reduce((acc, sub) => {
      if (!acc[sub.client_name]) {
        acc[sub.client_name] = [];
      }
      acc[sub.client_name].push(sub);
      return acc;
    }, {});
  };

  const groupedSubscriptions = groupByEntity(updatedSubscriptions);


  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    phone: '',
    startAmount: 0
  });

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get('/api/EditUser ', {
        headers: {
          'Authorization': `${token}`,
        },
      });

      console.log(response.data)
      if (response.status === 200) {
        setFormData(response.data);
      } else {
        console.error('Error fetching user data:', response.status, response.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error.response ? error.response.data : error.message);
    }
  };
  useEffect(() => {

    fetchUserData();
  }, []);

  const totalClients = new Set(
    Subscriptions.map(sub => sub.client_name)
  ).size;

  const activeServices = new Set(
    Subscriptions.map(sub => sub.service_id)
  ).size;

  const pendingRenewals = Subscriptions.filter(sub => {
    const end = new Date(sub.due_date);
    const today = new Date();
    const diffDays = (end - today) / (1000 * 60 * 60 * 24);
    return diffDays <= 15 && diffDays >= 0;
  }).length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const mtdRevenue = Subscriptions.filter(sub => {
    const date = new Date(sub.payment_date);
    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    );
  }).reduce((total, sub) => total + parseFloat(sub.amount), 0);


  const upcomingRenewals = Subscriptions.filter(sub => {
    if (!sub.due_date) return false;

    const end = new Date(sub.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date

    const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    // return diffDays <= 15 && diffDays >= 0;
    return diffDays >= 0;
  });

  const filteredRenewals = upcomingRenewals.filter(sub =>
    sub.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.service_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = pageSize === 'all' ? 1 : Math.ceil(filteredRenewals.length / pageSize);

  const paginatedRenewals = pageSize === 'all'
    ? filteredRenewals
    : filteredRenewals.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  // Prepare monthly expenses (grouped by month name and year)
  const monthlyExpenseMap = {};

  const now = new Date();
  const months = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
    months.push(label);
  }

  const monthlyIncomeMap = {};
  months.forEach(m => monthlyIncomeMap[m] = 0);

  Subscriptions.forEach(sub => {
    const date = new Date(sub.payment_date);
    const label = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    const amount = parseFloat(sub.amount);
    if (!isNaN(amount)) {
      monthlyIncomeMap[label] += amount;
    }
  });

  const sortedIncomeMonths = Object.keys(monthlyIncomeMap).sort((a, b) => new Date(a) - new Date(b));

  const monthlyIncomeChartData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: months.map(m => monthlyIncomeMap[m]),
        backgroundColor: '#666CFF',
        borderRadius: 8,
      },
    ],
  };

  const dueDates = Subscriptions
    .filter(sub => {
      const end = new Date(sub.due_date);
      return end >= new Date(); // only future
    })
    .map(sub => new Date(sub.due_date).toDateString()); // Normalize

  const groupedRenewals = Subscriptions
    .filter(sub => new Date(sub.due_date) >= new Date()) // only future
    .reduce((acc, sub) => {
      const dateStr = new Date(sub.due_date).toDateString();
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(sub);
      return acc;
    }, {});


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/income_records/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchSubscriptions(); // Refresh list after deletion
    } catch (error) {
      console.error("Failed to delete record:", error);
      alert("Failed to delete the record. Please try again.");
    }
  };

  // Subscriptions already includes payment_date and due_date
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Helpers
  const isCurrentMonth = (date) =>
    new Date(date).getMonth() === currentMonth && new Date(date).getFullYear() === currentYear;

  const isLastMonth = (date) =>
    new Date(date).getMonth() === lastMonth && new Date(date).getFullYear() === lastMonthYear;

  // Total Clients
  const thisMonthClients = new Set(Subscriptions.filter(s => isCurrentMonth(s.payment_date)).map(s => s.client_id));
  const lastMonthClients = new Set(Subscriptions.filter(s => isLastMonth(s.payment_date)).map(s => s.client_id));

  // Services
  const thisMonthServices = new Set(Subscriptions.filter(s => isCurrentMonth(s.payment_date)).map(s => s.service_id));
  const lastMonthServices = new Set(Subscriptions.filter(s => isLastMonth(s.payment_date)).map(s => s.service_id));

  // Revenue
  const thisMonthRevenue = Subscriptions.filter(s => isCurrentMonth(s.payment_date))
    .reduce((acc, s) => acc + parseFloat(s.amount || 0), 0);

  const lastMonthRevenue = Subscriptions.filter(s => isLastMonth(s.payment_date))
    .reduce((acc, s) => acc + parseFloat(s.amount || 0), 0);

  // Pending Revenue
  const thisMonthPending = Subscriptions.filter(s =>
    isCurrentMonth(s.payment_date) && s.status === 'pending'
  ).reduce((acc, s) => acc + parseFloat(s.amount || 0), 0);

  const lastMonthPending = Subscriptions.filter(s =>
    isLastMonth(s.payment_date) && s.status === 'pending'
  ).reduce((acc, s) => acc + parseFloat(s.amount || 0), 0);


  const getPercentChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return (((current - previous) / previous) * 100).toFixed(1);
  };


  const clientChange = getPercentChange(thisMonthClients.size, lastMonthClients.size);
  const serviceChange = getPercentChange(thisMonthServices.size, lastMonthServices.size);
  const revenueChange = getPercentChange(thisMonthRevenue, lastMonthRevenue);
  const pendingChange = getPercentChange(thisMonthPending, lastMonthPending);

  const getMostUsedService = () => {
    const countMap = {};
    Subscriptions.forEach(sub => {
      if (sub.service_name) {
        countMap[sub.service_name] = (countMap[sub.service_name] || 0) + 1;
      }
    });
    return Object.entries(countMap).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
  };

  const getServiceWithHighestPending = () => {
    const pendingMap = {};
    Subscriptions.filter(sub => sub.status === 'pending').forEach(sub => {
      if (sub.service_name) {
        pendingMap[sub.service_name] = (pendingMap[sub.service_name] || 0) + parseFloat(sub.amount || 0);
      }
    });
    const entry = Object.entries(pendingMap).sort((a, b) => b[1] - a[1])[0];
    return entry ? `${entry[0]} (₹${entry[1].toFixed(2)})` : '-';
  };

  const getTopEarningService = () => {
    const incomeMap = {};
    Subscriptions.forEach(sub => {
      if (sub.service_name) {
        incomeMap[sub.service_name] = (incomeMap[sub.service_name] || 0) + parseFloat(sub.amount || 0);
      }
    });
    const entry = Object.entries(incomeMap).sort((a, b) => b[1] - a[1])[0];
    return entry ? `${entry[0]} (₹${entry[1].toFixed(2)})` : '-';
  };


  if (loading) {
    return <Preloader />;
  }


  return (
    <>
      <div className='container'>

        <div className="row">

          {/* new logic starts here */}

          <h5 className='ps-4'>Overview</h5>

          {/* Total Renewals Tile */}
          <div className="col-sm-6 col-lg-3 mb-5">
            <div className="card card-border-shadow-success h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <div className="avatar me-4">
                    <span className="avatar-initial rounded-3 bg-label-success">
                      <i className="ri-refresh-line ri-24px"></i>
                    </span>
                  </div>
                  <h4 className="mb-0">{totalRenewalsCount}</h4>
                </div>
                <h6 className="mb-0 fw-normal">Total Renewals</h6>
              </div>
            </div>
          </div>

          {/* Total Amount of Renewals Received Tile */}
          <div className="col-sm-6 col-lg-3 mb-5">
            <div className="card card-border-shadow-secondary h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <div className="avatar me-4">
                    <span className="avatar-initial rounded-3 bg-label-secondary">
                      <i className="ri-bank-card-line ri-24px"></i>
                    </span>
                  </div>
                  <h4 className="mb-0">₹{totalRenewalAmountReceived.toFixed(2)}</h4>
                </div>
                <h6 className="mb-0 fw-normal">Amount Received</h6>
              </div>
            </div>
          </div>

{/*
          <div className="col-sm-6 col-lg-3 mb-5">
            <div className="card card-border-shadow-primary h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <div className="avatar me-4">
                    <span className="avatar-initial rounded-3 bg-label-primary"
                    ><i className="ri-group-line ri-24px"></i
                    ></span>
                  </div>
                  <h4 className="mb-0">{clientCount}</h4>
                </div>
                <h6 className="mb-0 fw-normal">Total Clients </h6>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3 mb-5">
            <div className="card card-border-shadow-warning h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <div className="avatar me-4">
                    <span className="avatar-initial rounded-3 bg-label-warning"
                    ><i className="ri-suitcase-line ri-24px"></i
                    ></span>
                  </div>
                  <h4 className="mb-0">{serviceCount}</h4>
                </div>
                <h6 className="mb-0 fw-normal">Active Services</h6>
              </div>
            </div>
          </div>
*/}
          <div className="col-sm-6 col-lg-3 mb-5">
            <div className="card card-border-shadow-danger h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <div className="avatar me-4">
                    <span className="avatar-initial rounded-3 bg-label-danger"
                    ><i className="ri-time-line ri-24px"></i
                    ></span>
                  </div>
                  <h4 className="mb-0">{pendingRevenue.toFixed(2)}</h4>
                </div>
                <h6 className="mb-0 fw-normal">Pending Revenue</h6>
                {/* <p className="mb-0 text-danger">
                  Highest pending: {getServiceWithHighestPending()}
                </p> */}
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3 mb-5">
            <div className="card card-border-shadow-info h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <div className="avatar me-4">
                    <span className="avatar-initial rounded-3 bg-label-info"
                    ><i className="ri-money-rupee-circle-line ri-24px"></i
                    ></span>

                  </div>
                  <h4 className="mb-0">{totalIncomeAmount.toFixed(2)}</h4>
                </div>
                <h6 className="mb-0 fw-normal">Projected Revenue (MTD)</h6>
                {/* <p className="mb-0 text-success">
                  Top earning: {getTopEarningService()}
                </p> */}
              </div>
            </div>
          </div>

          {/* new logic ends here */}

        </div>

        <div className="card-body my-5">
          {/* <div className='row'>

          </div> */}
          <div className='card'>

            <div className="col-12 p-4">

              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-2">
                <h5 className="mb-0">Upcoming Renewals</h5>
                <div className="d-flex gap-3 align-items-center">
                  <div className="d-flex align-items-center">
                    <label className="me-2 mb-0 fw-medium">Show</label>
                    <select
                      className="form-select form-select-sm"
                      value={pageSize}
                      onChange={(e) => {
                        const value = e.target.value === 'all' ? 'all' : parseInt(e.target.value);
                        setPageSize(value);
                        setCurrentPage(1); // Reset to first page
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={50}>50</option>
                      <option value="all">All</option>
                    </select>
                  </div>

                  <div style={{ maxWidth: "250px" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Client</th>
                      <th>Company</th>
                      <th>Service</th>
                      <th>Due Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Description</th> {/* 👈 Add this */}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRenewals.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">No upcoming renewals found.</td>
                      </tr>
                    ) : (
                      paginatedRenewals.map((sub) => {
                        const dueDate = new Date(sub.due_date);
                        const today = new Date();
                        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                        const badgeClass = diffDays <= 5 ? 'bg-danger' : diffDays <= 10 ? 'bg-warning' : 'bg-primary';

                        return (
                          <tr key={sub.id}>
                            <td>{sub.client_name}</td>
                            <td><small className='text-primary'>{sub.company_name}</small></td>
                            <td>{sub.service_name}</td>
                            <td>{new Date(sub.due_date).toLocaleDateString()}</td>
                            <td>₹{parseFloat(sub.amount).toFixed(2)}</td>
                            <td>
                              <span className={`badge ${badgeClass}`}>
                                Due in {diffDays} days
                              </span>
                            </td>
                            <td>{sub.notes || '-'}</td> {/* 👈 Add this */}
                            <td>
                              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setEditingRecord(sub)}>
                                <i className="ri-edit-line"></i>
                              </button>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(sub.id)}>
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
                {pageSize !== 'all' && totalPages > 1 && (
                  <div className="d-flex justify-content-end align-items-center mt-3 gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                      Previous
                    </button>

                    <span className="fw-medium">Page {currentPage} of {totalPages}</span>

                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>

        <div className="row mt-5">
          <div className="col-md-8 mb-4">
            <div className="card p-4 shadow-sm h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0">Monthly Expenses</h6>
                <select
                  className="form-select form-select-sm w-auto"
                  value={expenseFilter}
                  onChange={(e) => setExpenseFilter(e.target.value)}
                >
                  <option value="6m">Last 6 months</option>
                  <option value="12m">Last 12 months</option>
                  <option value="all">All</option>
                </select>
              </div>

              <Bar
                // data={monthlyExpenseChartData}
                data={monthlyIncomeChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => '₹' + value.toLocaleString(),
                      },
                      grid: {
                        color: '#d6d6d6',
                        borderDash: [4, 4], // Dashed grid lines
                      },
                    },
                    x: {
                      grid: {
                        display: false, // Hide vertical grid lines
                      },
                    },
                  },
                  elements: {
                    bar: {
                      borderRadius: 6,
                      barThickness: 20,
                      categoryPercentage: 0.6,
                      barPercentage: 0.8,
                    },
                  },
                  layout: {
                    padding: 10,
                  }
                }}
              />

              <hr className="my-4" />
              <div className="d-flex justify-content-around text-center">
                <div>
                  <div className="fw-medium text-muted">Total Expense</div>
                  <div className="fs-5 fw-bold">
                    ₹{Subscriptions.filter(sub => sub.category === 'expense').reduce((sum, sub) => sum + parseFloat(sub.amount || 0), 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="fw-medium text-muted">Expense (YTD)</div>
                  <div className="fs-5 fw-bold">
                    ₹{Subscriptions.filter(sub => {
                      const date = new Date(sub.payment_date);
                      return sub.category === 'expense' && date.getFullYear() === new Date().getFullYear();
                    }).reduce((sum, sub) => sum + parseFloat(sub.amount || 0), 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="fw-medium text-muted">Projected (EOY)</div>
                  <div className="fs-5 fw-bold">
                    ₹{(
                      Subscriptions.filter(sub => sub.category === 'expense')
                        .reduce((sum, sub) => sum + parseFloat(sub.amount || 0), 0) *
                      (12 / (new Date().getMonth() + 1))
                    ).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card p-3 shadow-sm h-100">
              <h6 className="fw-bold mb-3">Upcoming Due Dates</h6>

              <Calendar
                next2Label={null}   // removes ">>"
                prev2Label={null}   // removes "<<"
                onClickDay={(value) => setSelectedDate(value)}
                tileContent={({ date, view }) =>
                  view === 'month' && dueDates.includes(date.toDateString()) ? (
                    <div className="text-center mt-1">
                      <span
                        style={{
                          display: 'inline-block',
                          height: 6,
                          width: 6,
                          backgroundColor: '#f44336',
                          borderRadius: '50%',
                        }}
                      ></span>
                    </div>
                  ) : null
                }
              />

              <div className="mt-3" style={{ maxHeight: "180px", overflowY: "auto" }}>
                {selectedDate ? (
                  <>
                    <div className="fw-semibold mb-2">
                      {selectedDate.toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })} Renewals
                    </div>

                    {groupedRenewals[selectedDate.toDateString()]?.map((sub, index) => {
                      const today = new Date();
                      const dueDate = new Date(sub.due_date);
                      const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                      const badgeClass =
                        daysLeft <= 5 ? 'bg-danger' : daysLeft <= 10 ? 'bg-warning' : 'bg-primary';

                      return (
                        <div
                          key={index}
                          className="bg-light border rounded p-3 mb-2 d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <span className="badge bg-secondary mb-1">{sub.client_name} </span> - <span className="badge bg-secondary mb-1"><small>{sub.company_name}</small></span>
                            <div className="fw-medium">{sub.service_name}</div>
                          </div>
                          <span className={`badge ${badgeClass}`}>{daysLeft}d left</span>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  Object.keys(groupedRenewals).map(date => (
                    <div key={date} className="mb-3">
                      <div className="fw-semibold mb-2">{new Date(date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })} Renewals</div>

                      {groupedRenewals[date].map((sub, index) => {
                        const today = new Date();
                        const dueDate = new Date(sub.due_date);
                        const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
                        const badgeClass =
                          daysLeft <= 5 ? 'bg-danger' : daysLeft <= 10 ? 'bg-warning' : 'bg-primary';

                        return (
                          <div
                            key={index}
                            className="bg-light border rounded p-3 mb-2 d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <span className="badge bg-secondary mb-1">{sub.client_name} </span> - <span><small>{sub.company_name}</small></span>
                              <div className="fw-medium">{sub.service_name}</div>
                            </div>
                            <span className={`badge ${badgeClass}`}>{daysLeft}d left</span>
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>
        {editingRecord && (
          <UpdateRenewals
            record={editingRecord}
            onClose={() => setEditingRecord(null)}
            onSuccess={async () => {
              // setEditingRecord(null);
              // fetchSubscriptions(); // re-fetch to reflect updates
              setEditingRecord(null);
              await Promise.all([
                fetchSubscriptions(),
                fetchTotalIncomeAmount(),
                fetchPendingRevenue(),
                fetchClientCount(),
                fetchServiceCount()
              ]);
            }}
          />
        )}

      </div>
    </>
  );
}