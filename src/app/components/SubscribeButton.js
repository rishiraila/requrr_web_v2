"use client";
import EditPlanModal from "./EditPlanModal"
import AddPlanModal from "./AddPlanModal"

import { useEffect, useState } from 'react';

export default function SubscribeButton() {

  const [showAddModal, setShowAddModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);

  const [couponInputs, setCouponInputs] = useState({});
  const [showCouponPopup, setShowCouponPopup] = useState({});
  const [couponValidation, setCouponValidation] = useState({});
  const [discountedPrices, setDiscountedPrices] = useState({});

  function decodeJWT(token) {
    if (!token) return null;
    const payload = token.split('.')[1];
    try {
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Invalid token', e);
      return null;
    }
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const userData = decodeJWT(token);
  const isAdmin = userData?.role === 'admin';

  useEffect(() => {
    fetch('/api/plans')
      .then(res => res.json())
      .then(data => setPlans(data))
      .catch(err => console.error('Error loading plans:', err));

    if (token) {
      fetch('/api/subscription/status', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.subscribed) {
            setCurrentPlan({
              plan_name: data.plan_name,
              price: data.price,
              start_date: data.start_date,
              end_date: data.end_date,
              max_renewals: data.max_renewals
            });
          }
        })
        .catch(err => console.error('Error loading subscription:', err));
    }
  }, [token]);

  const handleValidateCoupon = async (planId) => {
    const code = couponInputs[planId];
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId, couponCode: code }),
      });
      const data = await res.json();
      if (data && !data.error) {
        setCouponValidation(prev => ({ ...prev, [planId]: 'success' }));
        setDiscountedPrices(prev => ({ ...prev, [planId]: data.finalPrice }));
      } else {
        setCouponValidation(prev => ({ ...prev, [planId]: 'error' }));
      }
      setShowCouponPopup(prev => ({ ...prev, [planId]: false }));
    } catch (err) {
      console.error('Coupon validation error:', err);
      setCouponValidation(prev => ({ ...prev, [planId]: 'error' }));
    }
  };

  const handlePayment = async (planId, price, planName, couponCode = '') => {
    if (!token) return alert('User not authenticated');
    const res = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ planId, couponCode }),
    });

    const order = await res.json();
    if (!order || order.error) return alert(order.error || 'Order creation failed');

    const options = {
      key: "rzp_test_K2K20arHghyhnD",
      amount: order.amount,
      currency: order.currency,
      name: 'Income Tracker',
      description: `${planName} Plan - ₹${order.finalPrice}/year`,
      order_id: order.id,
      handler: async (response) => {
        const verifyRes = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            plan_id: planId,
            coupon_code: couponCode,
          }),
        });

        const verifyData = await verifyRes.json();
        alert(verifyData.message || verifyData.error);
      },
      theme: { color: '#3399cc' },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  const handleCouponChange = (planId, value) => {
    setCouponInputs(prev => ({ ...prev, [planId]: value }));
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="card">
        <div className="pb-sm-12 pb-2 rounded-top">
          <div className="container py-12">
            {isAdmin && (
              <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                  + Add Plan
                </button>
              </div>
            )}

            <h4 className="text-center mb-2 mt-0 mt-md-4">Pricing Plans</h4>
            <p className="text-center mb-2">
              All plans include 40+ advanced tools and features to boost your product. Choose the best plan to fit your needs.
            </p>

            <div className="pricing-plans row mx-4 gy-3 px-lg-12">
              {plans.map(plan => {
                const isCurrentPlan = currentPlan?.plan_name === plan.name;
                const isSubscribed = !!currentPlan;
                const isUpgrade = !isSubscribed || plan.price > currentPlan.price;
                const disableButton = isCurrentPlan || !isUpgrade;

                const couponCode = couponInputs[plan.id] || '';
                const validated = couponValidation[plan.id];
                const finalPrice = discountedPrices[plan.id] || plan.price;

                return (
                  <div className="col-lg mb-lg-0 mb-3" key={plan.id}>
                    <div className="card border shadow-none">
                      <div className="card-body pt-12">
                        <div className="mt-3 mb-5 text-center">
                          <img src="../../assets/img/illustrations/pricing-basic.png" alt="Plan" height="100" />
                        </div>
                        <h4 className="card-title text-center text-capitalize mb-2">{plan.name}</h4>
                        {isAdmin && (
                          <span
                            className="position-absolute top-0 end-0 p-2"
                            title="Edit Plan"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setSelectedPlan(plan);
                              setShowModal(true);
                            }}
                          >
                            <i className="bi bi-pencil-square fs-5 text-primary"></i>
                          </span>
                        )}

                        <p className="text-center mb-5">{plan.description}</p>
                        <div className="text-center">
                          <div className="d-flex justify-content-center">
                            <sup className="h6 pricing-currency mt-2 mb-0 me-1 text-body">₹</sup>
                            <h1 className="mb-0 text-primary">{finalPrice}</h1>
                            <sub className="h6 pricing-duration mt-auto mb-1 text-body">/year</sub>
                          </div>
                        </div>

                        <ul className="list-group ps-6 my-5 pt-4">
                          <li className="mb-4">
                            {plan.max_renewals === null ? 'Unlimited renewals' : `${plan.max_renewals} renewals per year`}
                          </li>
                          <li className="mb-4">Unlimited forms and surveys</li>
                          <li className="mb-4">Basic form creation tools</li>
                          <li className="mb-0">Email support</li>
                        </ul>

                        {!isCurrentPlan && !disableButton && !showCouponPopup[plan.id] && (
                          <p
                            className="text-primary text-center mb-2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowCouponPopup(prev => ({ ...prev, [plan.id]: true }))}
                          >
                            + Add Coupon Code
                          </p>
                        )}


                        {!isCurrentPlan && showCouponPopup[plan.id] && (
                          <div className="mb-3">
                            <label>Coupon Code</label>
                            <div className="d-flex gap-2">
                              <input
                                type="text"
                                placeholder="Enter coupon code"
                                className="form-control"
                                value={couponCode}
                                onChange={e => handleCouponChange(plan.id, e.target.value)}
                              />
                              <button className="btn btn-outline-primary" onClick={() => handleValidateCoupon(plan.id)}>Apply</button>
                            </div>
                          </div>
                        )}

                        {validated === 'success' && (
                          <p className="text-success text-center">Coupon applied successfully! 🎉</p>
                        )}
                        {validated === 'error' && (
                          <p className="text-danger text-center">Invalid or expired coupon 😞</p>
                        )}

                        {isCurrentPlan ? (
                          <button className="btn btn-outline-primary d-grid w-100" disabled>
                            Your Current Plan
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary d-grid w-100"
                            disabled={disableButton}
                            onClick={() => handlePayment(plan.id, finalPrice, plan.name, couponCode)}
                          >
                            {disableButton ? 'Not Available' : `Subscribe ₹${finalPrice}`}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <EditPlanModal
          show={showModal}
          onClose={() => setShowModal(false)}
          plan={selectedPlan}
          token={token}
          onUpdate={() => {
            setShowModal(false);
            setSelectedPlan(null);
            fetch('/api/plans')
              .then(res => res.json())
              .then(data => setPlans(data));
          }}
        />
      )}

      {showAddModal && (
        <AddPlanModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          token={token}
          onAdd={() => {
            setShowAddModal(false);
            fetch('/api/plans')
              .then(res => res.json())
              .then(data => setPlans(data));
          }}
        />
      )}
    </div>
  );
}
