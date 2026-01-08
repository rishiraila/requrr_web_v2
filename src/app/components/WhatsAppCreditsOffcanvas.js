"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function WhatsAppCreditsOffcanvas() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = { Authorization: `Bearer ${token}` };

  const [pricing, setPricing] = useState([]);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [selectedCredits, setSelectedCredits] = useState(null);

  /* ---------------- FETCH DATA ---------------- */
  const fetchData = async () => {
    try {
      const [pricingRes, creditsRes] = await Promise.all([
        axios.get("/api/whatsapp/pricing"),
        axios.get("/api/whatsapp/credits", { headers }),
      ]);

      setPricing(pricingRes.data.filter(p => p.active === 1));
      setCredits(creditsRes.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load WhatsApp credits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      window.location.href = "/Login";
      return;
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (pricing.length > 0 && !selectedCredits) {
      setSelectedCredits(pricing[0]);
    }
  }, [pricing, selectedCredits]);

  /* ---------------- BUY CREDITS ---------------- */
  const buyCredits = async (creditsAmount) => {
    if (processing) return;
    setProcessing(true);

    try {
      const orderRes = await axios.post(
        "/api/whatsapp/create-order",
        { credits: creditsAmount, userCurrency: "INR" },
        { headers }
      );

      const order = orderRes.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Requrr",
        description: `Buy ${creditsAmount} WhatsApp Credits`,
        order_id: order.id,

        handler: async function (response) {
          await axios.post(
            "/api/whatsapp/verify-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              credits: creditsAmount,
              final_price: order.finalPrice,
              currency: order.currency,
            },
            { headers }
          );

          alert("Credits purchased successfully 🎉");
          fetchData();
        },

        theme: { color: "#2563EB" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2 text-muted">Loading WhatsApp Credits...</p>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-3">
        <i className="ri-whatsapp-line ri-2x text-success mb-1"></i>
        <h6 className="fw-bold mb-1">WhatsApp Credits</h6>
        <p className="text-muted small mb-0">1 notification = 1 credit</p>
      </div>

      {/* Total Credits */}
      <div className="text-center mb-3">
        <i className="ri-wallet-3-line ri-lg text-primary me-1"></i>
        <span className="fw-bold text-primary">{credits?.remaining_credits ?? 0} Total Credits</span>
      </div>

      {/* Select Credits */}
      <div className="mb-3">
        <label htmlFor="credits-select" className="form-label fw-bold">
          <i className="ri-coin-line me-1 text-warning"></i>Select Credits
        </label>
        <select
          id="credits-select"
          className="form-select form-select-sm"
          value={selectedCredits?.id || ""}
          onChange={(e) => {
            const selected = pricing.find(p => p.id === parseInt(e.target.value));
            setSelectedCredits(selected);
          }}
        >
          {pricing.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.credits} Credits
            </option>
          ))}
        </select>
      </div>

      {/* Selected Plan */}
      {selectedCredits && (
        <div className="text-center mb-3">
          <div className="d-flex align-items-center justify-content-center mb-2">
            <i className="ri-coin-line ri-xl text-warning me-2"></i>
            <div>
              <h5 className="mb-0 fw-bold">{selectedCredits.credits} Credits</h5>
              <h4 className="text-success fw-bold">₹{selectedCredits.price_inr}</h4>
            </div>
          </div>
          <small className="text-muted">Instant • Secure • 24/7 Support</small>
        </div>
      )}

      {/* Buy Button */}
      {selectedCredits && (
        <button
          className="btn btn-primary w-100"
          disabled={processing}
          onClick={() => buyCredits(selectedCredits.credits)}
        >
          <i className="ri-shopping-cart-line me-1"></i>
          {processing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Processing...
            </>
          ) : (
            `Buy Now`
          )}
        </button>
      )}
    </div>
  );
}
