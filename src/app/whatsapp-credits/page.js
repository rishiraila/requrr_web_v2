"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Preloader from "../components/Preloader";

export default function WhatsAppCreditsPage() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = { Authorization: `Bearer ${token}` };

  const [pricing, setPricing] = useState([]);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

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

  if (loading) return <Preloader />;

  return (
    <div className="container-xxl container-p-y">

      <div className="card p-4 mb-4">
        <h4>📲 WhatsApp Credits</h4>
        <p className="text-muted">
          1 WhatsApp notification = 1 credit
        </p>

        <div className="alert alert-info">
          <b>Remaining Credits:</b>{" "}
          {credits?.remaining_credits ?? 0}
        </div>
      </div>

      <div className="row">
        {pricing.map((plan) => (
          <div className="col-md-4 mb-4" key={plan.id}>
            <div className="card h-100 text-center p-4 shadow-sm">
              <h5>{plan.credits} Credits</h5>
              <h4 className="my-3">₹{plan.price_inr}</h4>
              <button
                className="btn btn-primary"
                disabled={processing}
                onClick={() => buyCredits(plan.credits)}
              >
                {processing ? "Processing..." : "Buy Credits"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
