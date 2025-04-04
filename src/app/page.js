'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {

  const [Subscriptions, setSubscriptions] = useState([])

  const [Income, setIncome] = useState([])
  const [IncomeEntities, setIncomeEntities] = useState([]);

  const [Expense, setExpense] = useState([])
  const [ExpenseEntities, setExpenseEntities] = useState([]);

  // useEffect(() => {
  //   const incomeSubscriptions = Subscriptions.filter(sub => sub.category === 'income'); // Filter for income
  //   const expenseSubscriptions = Subscriptions.filter(sub => sub.category === 'expense'); // Filter for income

  //   const sortedIncomeSubscriptions = incomeSubscriptions.sort((a, b) => {
  //     return parseFloat(a.amount) - parseFloat(b.amount); // Sort by amount (ascending)
  //   });

  //   const sortedExpesneSubscriptions = expenseSubscriptions.sort((a, b) => {
  //     return parseFloat(a.amount) - parseFloat(b.amount); // Sort by amount (ascending)
  //   });


  //   // console.log(sortedIncomeSubscriptions);
  //   // console.log(sortedExpesneSubscriptions);

  //   setIncome(sortedIncomeSubscriptions); // Update the Income state
  //   setExpense(sortedExpesneSubscriptions); // Update the Income state

  //   // Step 1: Create a map to hold unique entities and their total amounts
  //   const entityMap = {};

  //   incomeSubscriptions.forEach(sub => {
  //     const entityName = sub.entity_name;
  //     const amount = parseFloat(sub.amount);

  //     // If the entity already exists, add the amount to its total
  //     if (entityMap[entityName]) {
  //       entityMap[entityName] += amount;
  //     } else {
  //       // If it doesn't exist, create a new entry
  //       entityMap[entityName] = amount;
  //     }
  //   });

  //   // Step 2: Convert the entityMap to an array of objects
  //   const uniqueEntitiesWithAmounts = Object.keys(entityMap).map(entity => ({
  //     entity_name: entity,
  //     total_amount: entityMap[entity],
  //   }));

  //   console.log(uniqueEntitiesWithAmounts)

  //   setIncomeEntities(uniqueEntitiesWithAmounts); // Update the IncomeEntities state with unique entities and their total amounts

  //   // expense
  //   const expenseEntityMap = {};

  //   expenseSubscriptions.forEach(sub => {
  //     const expenseEntityMap = sub.entity_name;
  //     const amount = parseFloat(sub.amount);

  //     // If the entity already exists, add the amount to its total
  //     if (expenseEntityMap[expenseEntityMap]) {
  //       expenseEntityMap[expenseEntityMap] += amount;
  //     } else {
  //       // If it doesn't exist, create a new entry
  //       expenseEntityMap[expenseEntityMap] = amount;
  //     }
  //   });

  //   // Step 2: Convert the entityMap to an array of objects
  //   const expenseUniqueEntitiesWithAmounts = Object.keys(expenseEntityMap).map(entity => ({
  //     entity_name: entity,
  //     total_amount: entityMap[entity],
  //   }));

  //   console.log(expenseUniqueEntitiesWithAmounts)

  //   setExpenseEntities(uniqueEntitiesWithAmounts); // Update the IncomeEntities state with unique entities and their total amounts
  // }, [Subscriptions]);


  useEffect(() => {
    const incomeSubscriptions = Subscriptions.filter(sub => sub.category === 'income'); // Filter for income
    const expenseSubscriptions = Subscriptions.filter(sub => sub.category === 'expense'); // Filter for expense

    const sortedIncomeSubscriptions = incomeSubscriptions.sort((a, b) => {
      return parseFloat(a.amount) - parseFloat(b.amount); // Sort by amount (ascending)
    });

    const sortedExpenseSubscriptions = expenseSubscriptions.sort((a, b) => {
      return parseFloat(a.amount) - parseFloat(b.amount); // Sort by amount (ascending)
    });

    setIncome(sortedIncomeSubscriptions); // Update the Income state
    setExpense(sortedExpenseSubscriptions); // Update the Expense state

    // Step 1: Create a map to hold unique entities and their total amounts for income
    const entityMap = {};

    incomeSubscriptions.forEach(sub => {
      const entityName = sub.entity_name;
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

    setIncomeEntities(uniqueEntitiesWithAmounts); // Update the IncomeEntities state with unique entities and their total amounts

    // expense
    const expenseEntityMap = {}; // Correctly initialize the map for expenses

    expenseSubscriptions.forEach(sub => {
      const entityName = sub.entity_name; // Use a different variable name
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

    setExpenseEntities(expenseUniqueEntitiesWithAmounts); // Update the ExpenseEntities state with unique entities and their total amounts
  }, [Subscriptions]);

  const fetchSubscriptions = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/Login";
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/Payees", {
        headers: { Authorization: token }, // Ensure Bearer token format
      });

      const subscriptions = response.data.data

      console.log("dashborad", subscriptions)

      setSubscriptions(subscriptions); // Assuming service has a 'name' property

    } catch (err) {
      console.error("Error fetching entities:", err);
    }
  };

  // Fetch entities on mount
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Calculate remaining payments
  const calculateRemainingPayments = () => {
    return Subscriptions.map(sub => {
      const remainingAmount = parseFloat(sub.remainingAmount);
      const category = sub.category;

      return {
        ...sub,
        remainingPayment: category === 'income' ? remainingAmount : -remainingAmount, // Positive for income, negative for expense
      };
    });
  };

  const updatedSubscriptions = calculateRemainingPayments();

  // Group subscriptions by entity
  const groupByEntity = (subscriptions) => {
    return subscriptions.reduce((acc, sub) => {
      if (!acc[sub.entity_name]) {
        acc[sub.entity_name] = [];
      }
      acc[sub.entity_name].push(sub);
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
      const response = await axios.get('http://localhost:3000/api/EditUser ', {
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




  return (
    <>
      <div className='container'>

        <div className="row g-6">
          <div className="col-sm-6 col-lg-3">
            <div className="card card-border-shadow-primary h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <div className="avatar me-4">
                    <span className="avatar-initial rounded-3 bg-label-primary"
                    ><i className="ri-line-chart-line ri-24px"></i
                    ></span>
                  </div>
                  <h4 className="mb-0">{(
                    parseFloat(formData.startAmount || 0) +
                    Income.reduce((total, income) => total + parseFloat(income.amount || 0), 0) -
                    Expense.reduce((total, expense) => total + parseFloat(expense.amount || 0), 0)
                  ).toFixed(2)}</h4>
                </div>
                <h6 className="mb-0 fw-normal">Amount To Start With</h6>
                <p className="mb-0">
                  <span className="me-1 fw-medium">Note : </span>
                  <small className="text-muted">Amount after adding or substracting income and expenses</small>
                </p>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card card-border-shadow-info h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <div className="avatar me-4">
                    <span className="avatar-initial rounded-3 bg-label-info"
                    ><i className="ri-money-dollar-circle-line ri-24px"></i
                    ></span>
                  </div>
                  <h4 className="mb-0">{Income.reduce((total, income) => total + parseFloat(income.amount) || 0, 0).toFixed(2)}</h4>
                </div>
                <h6 className="mb-0 fw-normal">Total Income</h6>
                <p className="mb-0">
                  <span className="me-1 fw-medium">+4.3%</span>
                  <small className="text-muted">than last week</small>
                </p>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="card card-border-shadow-danger h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <div className="avatar me-4">
                    <span className="avatar-initial rounded-3 bg-label-danger"
                    ><i className="ri-wallet-line ri-24px"></i
                    ></span>
                  </div>
                  <h4 className="mb-0">{Expense.reduce((total, expense) => total + parseFloat(expense.amount) || 0, 0).toFixed(2)}</h4>
                </div>
                <h6 className="mb-0 fw-normal">Total Expense</h6>
                <p className="mb-0">
                  <span className="me-1 fw-medium">-2.5%</span>
                  <small className="text-muted">than last week</small>
                </p>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-3">
            <div className="card card-border-shadow-warning h-100">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <div className="avatar me-4">
                    <span className="avatar-initial rounded-3 bg-label-warning"
                    ><i className="ri-bar-chart-line ri-24px"></i
                    ></span>
                  </div>
                  <h4 className="mb-0">{Income.reduce((total, income) => total + parseFloat(income.amount) || 0, 0).toFixed(2) - Expense.reduce((total, expense) => total + parseFloat(expense.amount) || 0, 0).toFixed(2)}</h4>
                </div>
                <h6 className="mb-0 fw-normal">Operating Difference</h6>
                <p className="mb-0">
                  <span className="me-1 fw-medium">-8.7%</span>
                  <small className="text-muted">than last week</small>
                </p>
              </div>
            </div>
          </div>

          <div className="col-xxl-6 order-5 order-xxl-0">
            <div className="card h-100">
              <div className="card-header d-flex align-items-center justify-content-between">
                <div className="card-title mb-0">
                  <h5 className="m-0 me-2">Income overview</h5>
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-text-secondary rounded-pill text-muted border-0 p-1"
                    type="button"
                    id="deliveryExceptions"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    <i className="ri-more-2-line ri-20px"></i>
                  </button>
                  <div className="dropdown-menu dropdown-menu-end" aria-labelledby="deliveryExceptions">
                    <a className="dropdown-item" href="javascript:void(0);">Select All</a>
                    <a className="dropdown-item" href="javascript:void(0);">Refresh</a>
                    <a className="dropdown-item" href="javascript:void(0);">Share</a>
                  </div>
                </div>
              </div>
              <div className="card-body pb-2">
                <div className="d-none d-lg-flex vehicles-progress-labels mb-5">
                  {IncomeEntities.map((income) => {
                    return <>

                      <div className="vehicles-progress-label on-the-way-text" style={{ width: "100%" }}>{income.entity_name}</div>
                    </>
                  })}

                </div>
                <div
                  className="vehicles-overview-progress progress rounded-4 bg-transparent mb-2"
                  style={{ height: "46px" }}>

                  {IncomeEntities.map((income) => {

                    const maxAmount = Math.max(...IncomeEntities.map(income => income.total_amount));

                    const getClassByIncome = (amount) => {
                      if (amount < 5000) {
                        return 'bg-light';
                      } else if (amount < 10000) {
                        return 'bg-info';
                      } else if (amount < 600000) {
                        return 'bg-primary';
                      } else if (amount < 800000) {
                        return 'bg-warning';
                      } else {
                        return 'bg-danger';
                      }
                    };

                    const widthPercentage = maxAmount > 0 ? (income.total_amount / maxAmount) * 100 : 0;

                    return <div
                      className={`progress-bar small fw-medium text-start text-heading  ${getClassByIncome(income.total_amount)}  px-1 px-lg-4`}
                      role="progressbar"
                      // style={{ width: `${widthPercentage}` }}
                      style={{ width: `100%` }}
                      aria-valuenow={income.total_amount}
                      aria-valuemin="0"
                      aria-valuemax="1000000">
                      {income.total_amount}
                    </div>
                  })}


                </div>

                <div className='d-flex justify-content-between align-items-center py-3'>
                  <div className=' text-dark'><b>Amount : <span className='text-primary'>{Income.reduce((total, income) => total + parseFloat(income.amount) || 0, 0).toFixed(2)}</span></b></div>
                  <div className=' text-dark'><b>Paid : <span className='text-success'>{Income.reduce((total, income) => total + parseFloat(income.paidAmount) || 0, 0).toFixed(2)}</span></b></div>
                  <div className=' text-dark'><b>Pending Income : <span className='text-danger'>{Income.reduce((total, income) => total + parseFloat(income.remainingAmount) || 0, 0).toFixed(2)}</span></b>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table card-table">
                    <tbody className="table-border-bottom-0">
                      {Income.map((income) => {
                        return (<>
                          <tr  >
                            <td className="w-75 ps-0">
                              <div className="d-flex justify-content-start align-items-center">
                                <div className="me-2">
                                  <i className="text-heading ri-building-line ri-24px"></i>
                                </div>
                                <div>
                                  <h6 className="mb-0 fw-normal">{income.payee_name}</h6>
                                  <p className="mb-0 fw-normal">{income.entity_name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="text-end pe-0 text-nowrap">
                              <h6 className="mb-0 text-primary">{income.amount}</h6>
                            </td>
                            <td className="text-end pe-0 ps-6">
                              <span className='text-success'>{income.paidAmount}</span>
                            </td>
                            <td className="text-end pe-0 ps-6">
                              <span className='text-danger'>{income.remainingAmount}</span>
                            </td>
                          </tr>
                        </>)
                      })}





                    </tbody>
                  </table>



                </div>
              </div>
            </div>
          </div>

          <div className="col-xxl-6 order-5 order-xxl-0">
            <div className="card h-100">
              <div className="card-header d-flex align-items-center justify-content-between">
                <div className="card-title mb-0">
                  <h5 className="m-0 me-2">Expense overview</h5>
                </div>
                <div className="dropdown">
                  <button
                    className="btn btn-text-secondary rounded-pill text-muted border-0 p-1"
                    type="button"
                    id="deliveryExceptions"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    <i className="ri-more-2-line ri-20px"></i>
                  </button>
                  <div className="dropdown-menu dropdown-menu-end" aria-labelledby="deliveryExceptions">
                    <a className="dropdown-item" href="javascript:void(0);">Select All</a>
                    <a className="dropdown-item" href="javascript:void(0);">Refresh</a>
                    <a className="dropdown-item" href="javascript:void(0);">Share</a>
                  </div>
                </div>
              </div>
              <div className="card-body pb-2">
                <div className="d-none d-lg-flex vehicles-progress-labels mb-5">
                  {ExpenseEntities.map((expense) => {
                    return <>

                      <div className="vehicles-progress-label on-the-way-text" style={{ width: "100%" }}>{expense.entity_name}</div>
                    </>
                  })}

                </div>
                <div
                  className="vehicles-overview-progress progress rounded-4 bg-transparent mb-2"
                  style={{ height: "46px" }}>

                  {ExpenseEntities.map((expense) => {

                    const maxAmount = Math.max(...IncomeEntities.map(expense => expense.total_amount));

                    const getClassByExpense = (amount) => {
                      if (amount < 5000) {
                        return 'bg-light';
                      } else if (amount < 10000) {
                        return 'bg-info';
                      } else if (amount < 100000) {
                        return 'bg-primary';
                      } else if (amount < 800000) {
                        return 'bg-warning';
                      } else {
                        return 'bg-danger';
                      }
                    };

                    const widthPercentage = maxAmount > 0 ? (expense.total_amount / maxAmount) * 100 : 0;

                    return <div
                      className={`progress-bar small fw-medium text-start text-heading  ${getClassByExpense(expense.total_amount)}  px-1 px-lg-4`}
                      role="progressbar"
                      // style={{ width: `${widthPercentage}` }}
                      style={{ width: `100%` }}
                      aria-valuenow={expense.total_amount}
                      aria-valuemin="0"
                      aria-valuemax="1000000">
                      {expense.total_amount}
                    </div>
                  })}


                </div>
                <div className='d-flex justify-content-between align-items-center py-3'>
                  <div className=' text-dark'><b>Amount : <span className='text-primary'>{Expense.reduce((total, income) => total + parseFloat(income.amount) || 0, 0).toFixed(2)}</span></b></div>
                  <div className=' text-dark'><b>Paid : <span className='text-success'>{Expense.reduce((total, income) => total + parseFloat(income.paidAmount) || 0, 0).toFixed(2)}</span></b></div>
                  <div className=' text-dark'><b>Pending Expense : <span className='text-danger'>{Expense.reduce((total, income) => total + parseFloat(income.remainingAmount) || 0, 0).toFixed(2)}</span></b>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table card-table">
                    <tbody className="table-border-bottom-0">
                      {Expense.map((expense) => {
                        return (<>
                          <tr  >
                            <td className="w-75 ps-0">
                              <div className="d-flex justify-content-start align-items-center">
                                <div className="me-2">
                                  <i className="text-heading ri-building-line ri-24px"></i>
                                </div>
                                <div>
                                  <h6 className="mb-0 fw-normal">{expense.payee_name}</h6>
                                  <p className="mb-0 fw-normal">{expense.entity_name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="text-end pe-0 text-nowrap">
                              <h6 className="mb-0 text-primary">{expense.amount}</h6>
                            </td>
                            <td className="text-end pe-0 ps-6">
                              <span className='text-success'>{expense.paidAmount}</span>
                            </td>
                            <td className="text-end pe-0 ps-6">
                              <span className='text-danger'>{expense.remainingAmount}</span>
                            </td>
                          </tr>
                        </>)
                      })}

                    </tbody>
                  </table>


                </div>
              </div>
            </div>
          </div>


        </div>

        <div className="card-body my-5">
          <div className='row'>

            {Object.keys(groupedSubscriptions).map(entity => {
              const entitySubscriptions = groupedSubscriptions[entity];

              // Update the chart data construction for each entity
              const data = {
                labels: entitySubscriptions.map(sub => sub.payee_name), // Payee names as labels
                datasets: [
                  {
                    label: 'Remaining Payments',
                    data: entitySubscriptions.map(sub => sub.remainingPayment), // Remaining payments
                    backgroundColor: entitySubscriptions.map(sub => sub.category === 'income' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'),
                    borderColor: entitySubscriptions.map(sub => sub.category === 'income' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'),
                    borderWidth: 1,
                  },
                ],
              };

              return (
                <div className='container'>

                  <div key={entity} className="card p-5 mb-3">
                    <h5>{entity} Entity Overview</h5>
                    <Bar data={data} options={{ responsive: true }} />
                    <div className="row row-cols-1 row-cols-md-3 g-4 mt-4">
                      {entitySubscriptions.map((subscription) => (
                        <div className="col" key={subscription.id}>
                          <div className="card shadow-sm border-0 h-100">
                            <div className="card-body d-flex flex-column">
                              <h5 className="card-title mb-1">{subscription.payee_name}</h5>
                              <span className="badge bg-label-primary me-1">Entity: {subscription.entity_name}</span>
                              <span className="badge bg-label-info">Service: {subscription.service_name}</span>
                              <p className="mt-2 mb-1 text-muted">Phone: {subscription.phone}</p>
                              <p className="text-muted">Email: {subscription.email}</p>
                              <div className="d-flex justify-content-between align-items-center mt-3">
                                <span className={`fw-bold ${subscription.category === 'income' ? 'text-success' : 'text-danger'}`}>
                                  Amt: ${Math.abs(subscription.remainingPayment)}
                                </span>
                                <small className="text-muted">Start: {new Date(subscription.startDate).toLocaleDateString()}</small>
                                <small className="text-muted">End: {new Date(subscription.endDate).toLocaleDateString()}</small>
                              </div>
                              <p className="text-muted mt-3 mb-0">Payment Date: {new Date(subscription.paymentDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

          </div>

        </div>
      </div>
    </>
  );
}