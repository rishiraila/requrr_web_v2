'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Home() {

  const [Subscriptions, setSubscriptions] = useState([])

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

      console.log(subscriptions)

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

  return (
    <>
      <div className='container'>
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