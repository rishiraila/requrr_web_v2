"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function WhatsappAdminPage() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* -------------------- STATES -------------------- */
  const [pricing, setPricing] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [credits, setCredits] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [form, setForm] = useState({
    credits: "",
    price_inr: "",
    price_usd: "",
    active: 1,
  });

  /* -------------------- FETCH DATA -------------------- */
  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
    try {
      setLoading(true);

      const [p, t, c] = await Promise.all([
        axios.get("/api/whatsapp/pricing", { headers }),
        axios.get("/api/whatsapp/transactions", { headers }),
        axios.get("/api/whatsapp/all-credits", { headers }),
      ]);

      setPricing(p.data);
      setTransactions(t.data);
      setCredits(c.data);
    } catch (err) {
      console.error("Admin WhatsApp fetch error", err);
      alert("Unauthorized or server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/Login";
      return;
    }
    fetchAll();
  }, []);

  /* -------------------- SAVE PRICING -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      credits: parseInt(form.credits),
      price_inr: parseFloat(form.price_inr),
      price_usd: parseFloat(form.price_usd),
      active: parseInt(form.active),
    };

    try {
      if (editItem) {
        await axios.put(
          `/api/whatsapp/pricing/${editItem.id}`,
          payload,
          { headers }
        );
      } else {
        await axios.post("/api/whatsapp/pricing", payload, { headers });
      }

      setShowForm(false);
      setEditItem(null);
      setForm({ credits: "", price_inr: "", price_usd: "", active: 1 });
      fetchAll();
    } catch (err) {
      console.error("Pricing save failed", err);
      alert("Save failed");
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center p-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <span className="ms-2">Loading WhatsApp Admin...</span>
    </div>
  );

  return (
    <div className="container">
      {/* -------------------- INFO SECTION -------------------- */}
      <div className="alert alert-info mb-4" role="alert">
        <h5 className="alert-heading"><i className="bi bi-info-circle me-2"></i>WhatsApp Admin Dashboard</h5>
        <p className="mb-0">Manage WhatsApp credit pricing, view user credit balances, and monitor credit transactions. Use the tables below to oversee and update pricing plans, track user credits, and review transaction history.</p>
      </div>

      {/* -------------------- PRICING -------------------- */}
      <div className="card mb-4 p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0"><i className="bi bi-whatsapp me-2"></i>WhatsApp Credit Pricing</h4>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
            <i className="bi bi-plus-circle me-1"></i>Add Pricing
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead className="table-light">
              <tr>
                <th>Credits</th><th>INR</th><th>USD</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pricing.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">No pricing found</td>
                </tr>
              ) : (
                pricing.map((p) => (
                  <tr key={p.id}>
                    <td>{p.credits}</td>
                    <td>₹{p.price_inr}</td>
                    <td>${p.price_usd}</td>
                    <td>
                      <span className={`badge ${p.active ? "bg-success" : "bg-danger"}`}>
                        {p.active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => {
                          setEditItem(p);
                          setForm(p);
                          setShowForm(true);
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={async () => {
                          if (window.confirm("Are you sure you want to delete this pricing?")) {
                            try {
                              await axios.delete(`/api/whatsapp/pricing/${p.id}`, { headers });
                              fetchAll();
                            } catch (err) {
                              console.error("Delete failed", err);
                              alert("Delete failed");
                            }
                          }
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------- USER CREDITS -------------------- */}
      <div className="card mb-4 p-4 shadow-sm">
        <h4 className="mb-3"><i className="bi bi-people me-2"></i>User Credit Balances</h4>
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead className="table-light">
              <tr>
                <th>User</th><th>Total</th><th>Used</th><th>Remaining</th>
              </tr>
            </thead>
            <tbody>
              {credits.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted">No user credits found</td>
                </tr>
              ) : (
                credits.map((c) => (
                  <tr key={c.user_id}>
                    <td>{c.email}</td>
                    <td>{c.total_credits}</td>
                    <td>{c.used_credits}</td>
                    <td>{c.remaining_credits}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------- TRANSACTIONS -------------------- */}
      <div className="card p-4 shadow-sm">
        <h4 className="mb-3"><i className="bi bi-credit-card me-2"></i>Credit Transactions</h4>
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead className="table-light">
              <tr>
                <th>User</th><th>Credits</th><th>Amount</th><th>Status</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">No transactions found</td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.email}</td>
                    <td>{t.credits_added}</td>
                    <td>{t.currency} {t.amount}</td>
                    <td>
                      <span className="badge bg-success">{t.status}</span>
                    </td>
                    <td>{new Date(t.created_at).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* -------------------- MODAL -------------------- */}
      {showForm && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
          }}
        >
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
            <h5>{editItem ? "Edit Pricing" : "Add Pricing"}</h5>

            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label">Credits</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter number of credits (e.g., 100)"
                  value={form.credits}
                  onChange={(e) => setForm({ ...form, credits: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Price INR</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter price in INR (e.g., 500)"
                  value={form.price_inr}
                  onChange={(e) => setForm({ ...form, price_inr: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Price USD</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter price in USD (e.g., 6.50)"
                  value={form.price_usd}
                  onChange={(e) => setForm({ ...form, price_usd: e.target.value })}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Active Status</label>
                <select
                  className="form-control"
                  value={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.value })}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Disabled</option>
                </select>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-3">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">{editItem ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
