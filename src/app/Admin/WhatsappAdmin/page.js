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

  if (loading) return <p className="p-5">Loading WhatsApp Admin...</p>;

  return (
    <div className="container-xxl container-p-y">

      {/* -------------------- PRICING -------------------- */}
      <div className="card mb-4 p-4">
        <div className="d-flex justify-content-between mb-3">
          <h4>📲 WhatsApp Credit Pricing</h4>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Add Pricing
          </button>
        </div>

        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Credits</th><th>INR</th><th>USD</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pricing.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No pricing found</td>
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
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setEditItem(p);
                        setForm(p);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* -------------------- USER CREDITS -------------------- */}
      <div className="card mb-4 p-4">
        <h4>👤 User Credit Balances</h4>
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>User</th><th>Total</th><th>Used</th><th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {credits.map((c) => (
              <tr key={c.user_id}>
                <td>{c.email}</td>
                <td>{c.total_credits}</td>
                <td>{c.used_credits}</td>
                <td>{c.remaining_credits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* -------------------- TRANSACTIONS -------------------- */}
      <div className="card p-4">
        <h4>💳 Credit Transactions</h4>
        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>User</th><th>Credits</th><th>Amount</th><th>Status</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.email}</td>
                <td>{t.credits_added}</td>
                <td>{t.currency} {t.amount}</td>
                <td>
                  <span className="badge bg-success">{t.status}</span>
                </td>
                <td>{new Date(t.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* -------------------- MODAL -------------------- */}
      {showForm && (
        <div className="modal-backdrop show d-flex align-items-center justify-content-center">
          <div className="bg-white p-4 rounded" style={{ width: 400 }}>
            <h5>{editItem ? "Edit Pricing" : "Add Pricing"}</h5>

            <form onSubmit={handleSubmit}>
              <input
                className="form-control mb-2"
                placeholder="Credits"
                value={form.credits}
                onChange={(e) => setForm({ ...form, credits: e.target.value })}
                required
              />
              <input
                className="form-control mb-2"
                placeholder="Price INR"
                value={form.price_inr}
                onChange={(e) => setForm({ ...form, price_inr: e.target.value })}
                required
              />
              <input
                className="form-control mb-2"
                placeholder="Price USD"
                value={form.price_usd}
                onChange={(e) => setForm({ ...form, price_usd: e.target.value })}
                required
              />
              <select
                className="form-control mb-3"
                value={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.value })}
              >
                <option value={1}>Active</option>
                <option value={0}>Disabled</option>
              </select>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
