"use client";
import EditPlanModal from "./EditPlanModal"
import AddPlanModal from "./AddPlanModal"


import { useEffect, useState } from 'react';

export default function SubscribeButton() {

  const [userCountry, setUserCountry] = useState('IN');

  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [isIndia, setIsIndia] = useState(true); // new

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
    const fetchData = async () => {
      try {
        // 1. Load all pricing plans
        const plansRes = await fetch('/api/plans');
        const plansData = await plansRes.json();
        setPlans(plansData);

        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };

        // 2. Load subscription status
        const subRes = await fetch('/api/subscription/status', { headers });
        const subData = await subRes.json();

        // if (subData.subscribed) {
        //   setCurrentPlan({
        //     plan_name: subData.plan_name,
        //     price: subData.price,
        //     start_date: subData.start_date,
        //     end_date: subData.end_date,
        //     max_renewals: subData.max_renewals
        //   });
        // }

        if (subData.subscribed) {
          const subPrice = isIndia ? subData.price_inr : subData.price_usd;
          setCurrentPlan({
            plan_name: subData.plan_name,
            price: subPrice,
            start_date: subData.start_date,
            end_date: subData.end_date,
            max_renewals: subData.max_renewals
          });
        }


        // 3. Load user info to get country
        const userRes = await fetch('/api/me', { headers });
        const user = await userRes.json();
        const country = user.country_code || 'IN';
        setUserCountry(country);

        // 4. Map country to currency code and symbol
        const countryCode = user.country_code?.toUpperCase() || 'IN';
        const isIndianUser = countryCode === 'IN';
        setIsIndia(isIndianUser);
        setCurrencySymbol(isIndianUser ? '₹' : '$');

        const countryInfo = countries[countryCode];

      } catch (err) {
        console.error('Error loading plans, subscription, or user info:', err);
      }
    };

    fetchData();
  }, [token]);

  // const handleValidateCoupon = async (planId) => {
  //   const code = couponInputs[planId];
  //   try {
  //     const res = await fetch('/api/payment/create-order', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ planId, couponCode: code }),

  //     });
  //     const data = await res.json();
  //     if (data && !data.error) {
  //       setCouponValidation(prev => ({ ...prev, [planId]: 'success' }));
  //       setDiscountedPrices(prev => ({ ...prev, [planId]: data.finalPrice }));
  //     } else {
  //       setCouponValidation(prev => ({ ...prev, [planId]: 'error' }));
  //     }
  //     setShowCouponPopup(prev => ({ ...prev, [planId]: false }));
  //   } catch (err) {
  //     console.error('Coupon validation error:', err);
  //     setCouponValidation(prev => ({ ...prev, [planId]: 'error' }));
  //   }
  // };

  const handleValidateCoupon = async (planId) => {
    const code = couponInputs[planId];
    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          planId,
          couponCode: code,
          userCurrency: isIndia ? 'INR' : 'USD',  // pass user currency
        }),
      });

      const data = await res.json();
      if (data && !data.error) {
        setCouponValidation(prev => ({ ...prev, [planId]: 'success' }));

        setDiscountedPrices(prev => ({
          ...prev,
          [planId]: isIndia ? data.finalPrice : data.localPrice
        }));
      } else {
        setCouponValidation(prev => ({ ...prev, [planId]: 'error' }));
      }

      setShowCouponPopup(prev => ({ ...prev, [planId]: false }));
    } catch (err) {
      console.error('Coupon validation error:', err);
      setCouponValidation(prev => ({ ...prev, [planId]: 'error' }));
    }
  };



const handleOneTimePayment = async (plan, finalAmount) => {
  try {
    // Find the plan ID from the plans array
    const planData = plans.find(p => p.name === plan.name);
    if (!planData) {
      throw new Error("Plan not found");
    }

    // Create order with plan details
    const res = await fetch("/api/payment/create-order", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        planId: planData.id,
        userCurrency: isIndia ? 'INR' : 'USD'
      }),
    });

    const orderData = await res.json();
    if (!res.ok) throw new Error(orderData.error || "Order creation failed");

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Requrr",
      description: `Payment for ${plan.name} Plan`,
      order_id: orderData.id,
      handler: async function (response) {
        try {
          // Verify payment and create subscription
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan_id: planData.id,
              final_price: finalAmount,
              currency: orderData.currency
            }),
          });

          const verifyData = await verifyRes.json();
          
          if (verifyData.error) {
            alert("Payment verification failed: " + verifyData.error);
          } else {
            alert("Payment successful! Subscription activated.");
            // Refresh the page to show updated subscription
            window.location.reload();
          }
        } catch (error) {
          console.error("Verification error:", error);
          alert("Error verifying payment");
        }
      },
      prefill: {
        name: userData?.name || "Customer",
        email: userData?.email || "customer@example.com",
      },
      theme: { color: "#3399cc" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("Payment Error:", error);
    alert("Payment initiation failed: " + error.message);
  }
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


                // const isUpgrade = !isSubscribed || plan.price > currentPlan.price;







                const basePrice = isIndia
                  ? Number(plan.price_inr || 0)
                  : Number(plan.price_usd || 0);

                // const finalPrice = discountedPrices[plan.id] || basePrice;
                const finalPrice = Number(discountedPrices[plan.id] ?? basePrice);
                const currentPrice = currentPlan?.price || 0;
                const isUpgrade = !isSubscribed || basePrice > currentPrice;

                const disableButton = isCurrentPlan || !isUpgrade;

                const couponCode = couponInputs[plan.id] || '';
                const validated = couponValidation[plan.id];



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
                            <sup className="h6 pricing-currency mt-2 mb-0 me-1 text-body">{currencySymbol}</sup>
                            <h1 className="mb-0 text-primary">
                              {currencySymbol}{(finalPrice / 12).toFixed(2)}
                            </h1>
                            <sub className="h6 pricing-duration mt-auto mb-1 text-body">/month</sub>
                          </div>
                          <p>[ Billed Annually at {currencySymbol}{finalPrice.toFixed(2)} ]</p>
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
                            onClick={() => handleOneTimePayment(plan.price, plan.name)}



                          >
                            {disableButton
                              ? 'Not Available'
                              : `Subscribe ${currencySymbol}${(finalPrice / 12).toFixed(2)} /month`}
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
