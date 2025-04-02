'use client'
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function page() {
 
  const [Entities, setEntities] = useState([])
  const [Services, setServices] = useState([])
  const [Payees, setPayees] = useState([])

  const [subscriptions, setSubscriptions] = useState([]);

  const [CurrentMonthDues, setCurrentMonthDues] = useState([])

  const [showForm, setShowForm] = useState(false); // State to manage form visibility
  const [formData, setFormData] = useState({ // State to manage form input values
    entity_name: '',
    service_name: '',
    payee_name: '',
    startDate: '',
    endDate: '',
    amount: '',
    paymentDate: '',
    category: ''
  });

  // New state for update form
  const [updateFormData, setUpdateFormData] = useState({
    id: null,
    entity_name: '',
    service_name: '',
    payee_name: '',
    startDate: '',
    endDate: '',
    amount: '',
    paymentDate: '',
    category: ''
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Fetch subscriptions using Axios
  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('token'); // Get token from storage
      const response = await axios.get(`http://localhost:3000/api/Subscriptions`, {
        headers: {
          Authorization: ` ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data.data)
      setSubscriptions(response.data.data)

      const responseData = response.data.data;

      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to start of the day

      // Get the date 30 days from today
      const next30Days = new Date();
      next30Days.setDate(today.getDate() + 30);
      next30Days.setHours(23, 59, 59, 999); // Ensure we include the full last day

      // Get current year and month
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth(); // 0-indexed (Jan = 0)

      // Filter endDates for the current month and within the next 30 days
      const filteredEndDates = responseData
        .map(sub => new Date(sub.endDate)) // Convert to Date objects
        .filter(endDate => {
          endDate.setHours(0, 0, 0, 0); // Normalize to start of the day
          return (
            endDate.getFullYear() === currentYear && // Same year
            endDate.getMonth() === currentMonth && // Same month
            endDate >= today && // Not in the past
            endDate <= next30Days // Within the next 30 days
          );
        })
        .map(endDate => endDate.toISOString()); // Convert back to string if needed

      console.log("Filtered End Dates (Current Month & Next 30 Days):", filteredEndDates);
      setCurrentMonthDues(filteredEndDates)


      return response.data.data; // Return fetched subscriptions data
    } catch (error) {
      console.error('Error fetching subscriptions:', error.response?.data?.message || error.message);
      return [];
    }
  };


  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/Subscriptions?id=${id}`, {
          headers: {
            Authorization: ` ${token}`,
            'Content-Type': 'application/json',
          },
        });
        fetchSubscriptions(); // Refresh data
      } catch (error) {
        console.error("Error deleting subscription:", error);
      }
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // New onChange handler for update form
  const handleUpdateInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({ ...updateFormData, [name]: value });
  };

  // New function to handle update submission
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/api/Subscriptions/`, {
        id: updateFormData.id,
        entity_name: updateFormData.entity_name,
        service_name: updateFormData.service_name,
        payee_name: updateFormData.payee_name,
        startDate: updateFormData.startDate,
        endDate: updateFormData.endDate,
        amount: Number(updateFormData.amount),
        paymentDate: updateFormData.paymentDate,
        category: updateFormData.category
      }, {
        headers: {
          Authorization: ` ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data);
      fetchSubscriptions(); // Refresh subscriptions list
      setUpdateFormData({ // Reset update form data
        id: null,
        entity_name: '',
        service_name: '',
        payee_name: '',
        startDate: '',
        endDate: '',
        amount: '',
        paymentDate: '',
        category: ''
      });
    } catch (error) {
      console.error("Error updating subscription:", error.response?.data?.message || error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Ensure it's not undefined or null
    return new Date(dateString).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
  };

  const handleEdit = (subscription) => {
    console.log(subscription.endDate)
    setUpdateFormData({
      ...subscription,
      startDate: formatDate(subscription.startDate),
      endDate: formatDate(subscription.endDate),
      paymentDate: formatDate(subscription.paymentDate),
    });
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:3000/api/Subscriptions`, {
        entity_name: formData.entity_name,
        service_name: formData.service_name,
        payee_name: formData.payee_name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        amount: Number(formData.amount), // Ensure amount is a number
        paymentDate: formData.paymentDate,
        category: formData.category
      }, {
        headers: {
          Authorization: ` ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(response.data); // Log the response for debugging
      fetchSubscriptions(); // Refresh subscriptions list
      setShowForm(false); // Hide form after submission
      setFormData({ // Reset form data
        entity_name: '',
        service_name: '',
        payee_name: '',
        startDate: '',
        endDate: '',
        amount: '',
        paymentDate: '',
        category: ''
      });
    } catch (error) {
      console.error("Error adding subscription:", error.response?.data?.message || error.message);
    }
  };



  const fetchEntities = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/Login";
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/Entities", {
        headers: { Authorization: token }, // Ensure Bearer token format
      });

      const entities = response.data.data;

      setEntities([...new Set(entities.map(entity => entity.entity_name))]); // Assuming entity has a 'name' property

    } catch (err) {
      console.error("Error fetching entities:", err);
    }
  };

  const fetchServices = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/Login";
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/Services", {
        headers: { Authorization: token }, // Ensure Bearer token format
      });

      const services = response.data.data
      console.log(services)

      setServices([...new Set(services.map(service => service.service_name))]); // Assuming service has a 'name' property

    } catch (err) {
      console.error("Error fetching entities:", err);
    }
  };

  const fetchPayees = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/Login";
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/api/Payees", {
        headers: { Authorization: token }, // Ensure Bearer token format
      });

      const payees = response.data.data

      console.log(payees)

      setPayees([...new Set(payees.map(payees => payees.payee_name))]); // Assuming service has a 'name' property

    } catch (err) {
      console.error("Error fetching entities:", err);
    }
  };
  // Fetch entities on mount
  useEffect(() => {
    fetchEntities();
    fetchServices();
    fetchPayees();
  }, []);


  return (
    <>
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="card shadow-lg border-0">
          <div className="card-header d-flex justify-content-between align-items-center border-bottom mb-4">
            <h4 className="card-title mb-4">All Subscriptions</h4>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Subscriptions</button>
          </div>

          {showForm && (
            <div className="form-container">
              <h4>Add Subscription</h4>
              <form onSubmit={handleSubmit} className="mb-4">
                {/* <input type="text" name="entity_name" placeholder="Entity Name" value={formData.entity_name} onChange={handleInputChange} required /> */}
                {/* <input type="text" name="service_name" placeholder="Service Name" value={formData.service_name} onChange={handleInputChange} required /> */}
                {/* <input type="text" name="payee_name" placeholder="Payee Name" value={formData.payee_name} onChange={handleInputChange} required /> */}

                <select name="entity_name" value={formData.entity_name} onChange={handleInputChange} required className="form-control mb-2">
                  <option value="">Select Entity</option>
                  {Entities.map((entity, index) => (
                    <option key={index} value={entity}>{entity}</option>
                  ))}
                </select>

                {/* Dropdown for Service */}
                <select name="service_name" value={formData.service_name} onChange={handleInputChange} required className="form-control mb-2">
                  <option value="">Select Service</option>
                  {Services.map((service, index) => (
                    <option key={index} value={service}>{service}</option>
                  ))}
                </select>

                {/* Dropdown for Payee */}
                <select name="payee_name" value={formData.payee_name} onChange={handleInputChange} required className="form-control mb-2">
                  <option value="">Select Payee</option>
                  {Payees.map((payee, index) => (
                    <option key={index} value={payee}>{payee}</option>
                  ))}
                </select>


                <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required />
                <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required />
                <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleInputChange} required />
                <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleInputChange} required />
                <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} required />
                <button type="submit" className="btn btn-success">Add</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </form>
            </div>
          )}

          {updateFormData.id && (
            <div className="form-container">
              <h4>Update Subscription</h4>
              <form onSubmit={handleUpdateSubmit} className="mb-4">
                {/* <input type="text" name="entity_name" placeholder="Entity Name" value={updateFormData.entity_name} onChange={handleUpdateInputChange} required /> */}
                <select name="entity_name" value={updateFormData.entity_name} onChange={handleUpdateInputChange} required className="form-control mb-2">
                  <option value="">Select Entity</option>
                  {Entities.map((entity, index) => (
                    <option key={index} value={entity}>{entity}</option>
                  ))}
                </select>
                
                {/* <input type="text" name="service_name" placeholder="Service Name" value={updateFormData.service_name} onChange={handleUpdateInputChange} required /> */}
                <select name="service_name" value={updateFormData.service_name} onChange={handleUpdateInputChange} required className="form-control mb-2">
                  <option value="">Select Service</option>
                  {Services.map((service, index) => (
                    <option key={index} value={service}>{service}</option>
                  ))}
                </select>
                
                {/* <input type="text" name="payee_name" placeholder="Payee Name" value={updateFormData.payee_name} onChange={handleUpdateInputChange} required /> */}
                <select name="payee_name" value={updateFormData.payee_name} onChange={handleUpdateInputChange} required className="form-control mb-2">
                  <option value="">Select Payee</option>
                  {Payees.map((payee, index) => (
                    <option key={index} value={payee}>{payee}</option>
                  ))}
                </select>

                <input type="date" name="startDate" value={updateFormData.startDate} onChange={handleUpdateInputChange} required />
                <input type="date" name="endDate" value={updateFormData.endDate} onChange={handleUpdateInputChange} required />
                <input type="number" name="amount" placeholder="Amount" value={updateFormData.amount} onChange={handleUpdateInputChange} required />
                <input type="date" name="paymentDate" value={updateFormData.paymentDate} onChange={handleUpdateInputChange} required />
                <input type="text" name="category" placeholder="Category" value={updateFormData.category} onChange={handleUpdateInputChange} required />
                <button type="submit" className="btn btn-success">Update</button>
                <button type="button" className="btn btn-secondary" onClick={() => setUpdateFormData({ id: null, entity_name: '', service_name: '', payee_name: '', startDate: '', endDate: '', amount: '', paymentDate: '', category: '' })}>Cancel</button>
              </form>
            </div>
          )}
          <div className="card-body my-5">
            <div className="row row-cols-1 row-cols-md-3 g-4">
              {subscriptions.map((subscription) => {
                const isDueThisMonth = CurrentMonthDues.includes(subscription.endDate);


                return <div className="col" key={subscription.id}>

                  <div className={`card shadow-sm ${isDueThisMonth ? 'border border-danger' : 'border-0  '} h-100`}>

                    <div className="card-body d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="card-title mb-1">{subscription.payee_name}</h5>
                          <span className="badge bg-label-primary me-1">
                            Entity: {subscription.entity_name}
                          </span>
                          <span className="badge bg-label-info">
                            Service: {subscription.service_name}
                          </span>
                          <p className="mt-2 mb-1 text-muted">
                            Phone: {subscription.payee_phone}
                          </p>
                          <p className="text-muted">Email: {subscription.payee_email}</p>
                        </div>
                        <div>
                          <i
                            className="ri-pencil-line text-primary me-2"
                            role="button"
                            title="Edit"
                            onClick={() => handleEdit(subscription)}
                          ></i>
                          <i
                            className="ri-delete-bin-line text-danger"
                            role="button"
                            title="Delete"
                            onClick={() => handleDelete(subscription.id)}
                          ></i>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <span className="fw-bold text-success">Amt: ${subscription.amount}</span>
                        <small className="text-muted">Start: {new Date(subscription.startDate).toLocaleDateString()}</small>
                        <small className="text-muted">End: {new Date(subscription.endDate).toLocaleDateString()}</small>
                      </div>
                      <p className="text-muted mt-3 mb-0">
                        Payment Date: {new Date(subscription.paymentDate).toLocaleDateString()}
                      </p>
                    </div>
                    {isDueThisMonth && <p className="text-danger ps-5">Ends Soon <i class="bi bi-exclamation-triangle"></i></p>}
                  </div>
                </div>
              })}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
