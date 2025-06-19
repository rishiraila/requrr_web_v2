'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Preloader from "../components/Preloader"

export default function NotificationPreferences() {
    const [loading, setLoading] = useState(true);
    const [prefs, setPrefs] = useState({
        remind_30_days_before: false,
        remind_15_days_before: false,
        remind_7_days_before: false,
        remind_overdue: false,
        email_notifications: false,
        dashboard_notifications: false,
        payment_received_notifications: false,
    });

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        if (!token) {
            alert('Unauthorized: No token found.');
            return;
        }

        fetch('/api/notification-preferences', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setPrefs((prev) => ({ ...prev, ...data }));
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch preferences:', err);
                setLoading(false);
            });
    }, [token]);

    const handleToggle = (key) => {
        setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const savePrefs = async () => {
        if (!token) {
            alert('Unauthorized: No token found.');
            return;
        }

        try {
            const res = await fetch('/api/notification-preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(prefs),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data?.error || 'Unknown error');
            alert('Preferences saved ✅');
        } catch (err) {
            alert('Failed to save preferences ❌');
            console.error(err.message);
        }
    };

    if (loading) return <Preloader />;

    return (
        <>
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row">
                    <div className="col-md-12">
                        <ul className="nav nav-pills flex-column flex-md-row mb-4">
                            <li className="nav-item me-2">
                                <Link className="nav-link active" href="/notification-preferences">
                                    <i className="ri-notification-2-line me-2"></i> Notifications
                                </Link>
                            </li>
                            <li className="nav-item me-2">
                                <Link className="nav-link" href="/Accounts/Account">
                                    <i className="ri-user-3-line me-2"></i> Account
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/Accounts/Security">
                                    <i className="ri-lock-line me-2"></i> Security
                                </Link>
                            </li>
                        </ul>

                        <div className="card ps-5 py-4">
                            <div className="notification-container">
                                <h1 className="notification-header">
                                    <span><i className="ri-notification-2-line" style={{ fontSize: "30px", color: "#2563EB" }}></i></span> Notification Preferences
                                </h1>
                                <p className="notification-subtext">
                                    Configure when and how you want to be notified
                                </p>

                                {/* Renewal Reminders Section */}
                                <div className="section mb-4">
                                    <h2 className="section-title border border-top-0 border-start-0 border-end-0">Renewal Reminders</h2>

                                    <div className="form-check form-switch d-flex justify-content-between align-items-center mb-2 p-3 border border-top-0 border-start-0 border-end-0">
                                        <label className="form-check-label" htmlFor="remind30"><h5 style={{marginBottom:"5px"}}><b>30 days before expiry</b></h5><p>Send a reminder 30 days before renewal is due</p></label>
                                        <input type="checkbox" className="form-check-input" id="remind30" checked={prefs.remind_30_days_before} onChange={() => handleToggle("remind_30_days_before")} />
                                    </div>

                                    <div className="form-check form-switch d-flex justify-content-between align-items-center mb-2 p-3 border border-top-0 border-start-0 border-end-0">
                                        <label className="form-check-label" htmlFor="remind15"><h5 style={{marginBottom:"5px"}}><b>15 days before expiry</b></h5><p>Send a reminder 15 days before renewal is due</p></label>
                                        <input type="checkbox" className="form-check-input" id="remind15" checked={prefs.remind_15_days_before} onChange={() => handleToggle("remind_15_days_before")} />
                                    </div>

                                    <div className="form-check form-switch d-flex justify-content-between align-items-center mb-2 p-3 border border-top-0 border-start-0 border-end-0">
                                        <label className="form-check-label" htmlFor="remind7"><h5 style={{marginBottom:"5px"}}><b>7 days before expiry</b></h5><p>Send a reminder 7 days before renewal is due</p></label>
                                        <input type="checkbox" className="form-check-input" id="remind7" checked={prefs.remind_7_days_before} onChange={() => handleToggle("remind_7_days_before")} />
                                    </div>

                                    <div className="form-check form-switch d-flex justify-content-between align-items-center mb-2 p-3 border border-top-0 border-start-0 border-end-0">
                                        <label className="form-check-label" htmlFor="overdue"><h5 style={{marginBottom:"5px"}}><b>Overdue renewals</b></h5><p>Send reminders for overdue renewals</p></label>
                                        <input type="checkbox" className="form-check-input" id="overdue" checked={prefs.remind_overdue} onChange={() => handleToggle("remind_overdue")} />
                                    </div>
                                </div>


                                {/* Notification Methods Section */}
                                <div className="section mb-4">
                                    <h2 className="section-title border border-top-0 border-start-0 border-end-0">Notification Methods</h2>

                                    <div className="form-check form-switch d-flex justify-content-between align-items-center mb-2 p-3 border border-top-0 border-start-0 border-end-0">
                                        <label className="form-check-label" htmlFor="email_notifications"><h5 style={{marginBottom:"5px"}}><b>Email Notifications</b><p>Receive notifications via email</p></h5></label>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="email_notifications"
                                            checked={prefs.email_notifications}
                                            onChange={() => handleToggle("email_notifications")}
                                        />
                                    </div>

                                    <div className="form-check form-switch d-flex justify-content-between align-items-center mb-2 p-3 border border-top-0 border-start-0 border-end-0">
                                        <label className="form-check-label" htmlFor="dashboard_notifications"><h5 style={{marginBottom:"5px"}}><b>Dashboard Notifications</b></h5><p>Show notifications in the dashboard</p></label>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="dashboard_notifications"
                                            checked={prefs.dashboard_notifications}
                                            onChange={() => handleToggle("dashboard_notifications")}
                                        />
                                    </div>
                                </div>


                                {/* Other Notifications Section */}
                                <div className="section mb-4">
                                    <h2 className="section-title border border-top-0 border-start-0 border-end-0">Other Notifications</h2>

                                    <div className="form-check form-switch d-flex justify-content-between align-items-center mb-2 p-3 border border-top-0 border-start-0 border-end-0">
                                        <label className="form-check-label" htmlFor="payment_received_notifications"><h5 style={{marginBottom:"5px"}}><b>Payment Received</b></h5><p>Notify when a payment is recorded</p></label>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="payment_received_notifications"
                                            checked={prefs.payment_received_notifications}
                                            onChange={() => handleToggle("payment_received_notifications")}
                                        />
                                    </div>
                                </div>


                                <button onClick={savePrefs} className="btn btn-primary mt-3">
                                    Save Preferences
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}
