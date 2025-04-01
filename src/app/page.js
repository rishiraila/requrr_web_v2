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
      const response = await axios.get("http://localhost:3000/api/Subscriptions", {
        headers: { Authorization: token }, // Ensure Bearer token format
      });

      const subscriptions = response.data.data

      console.log(subscriptions)

      setSubscriptions(response.data.data); // Assuming service has a 'name' property

    } catch (err) {
      console.error("Error fetching entities:", err);
    }
  };
  // Fetch entities on mount
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Update the chart data construction
  const data = {
    labels: Subscriptions.map(sub => sub.entity_name), // This will work now
    datasets: [
      {
        label: 'Subscription Amounts',
        data: Subscriptions.map(sub => sub.amount), // This will work now
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className='container'>

        <div className="card-body my-5">
          <h4>Subscription Amounts Overview</h4>
          <Bar data={data} options={{ responsive: true }} />
          <div className="row row-cols-1 row-cols-md-3 g-4 mt-4">
            {Subscriptions.map((subscription) => (
              <div className="col" key={subscription.id}>
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title mb-1">{subscription.payee_name}</h5>
                    <span className="badge bg-label-primary me-1">Entity: {subscription.entity_name}</span>
                    <span className="badge bg-label-info">Service: {subscription.service_name}</span>
                    <p className="mt-2 mb-1 text-muted">Phone: {subscription.payee_phone}</p>
                    <p className="text-muted">Email: {subscription.payee_email}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="fw-bold text-success">Amt: ${subscription.amount}</span>
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

    </>
  );
}
