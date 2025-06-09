'use client';

import React, { useState, useEffect } from 'react';

import Link from 'next/link';

const settingsTemplate = {
    reminder_30: true,
    reminder_15: true,
    reminder_7: true,
    overdue: true,
    email: true,
    dashboard: true,
    payment_received: true
};

export default function NotificationPreferences() {
    const [prefs, setPrefs] = useState(settingsTemplate);

    useEffect(() => {
        // Fetch from API
        fetch('/api/notification_preferences')
            .then(res => res.json())
            .then(data => setPrefs(prev => ({ ...prev, ...data })));
    }, []);

    const handleToggle = (key) => {
        setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        await fetch('/api/notification_preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prefs),
        });
        alert('Preferences saved!');
    };

    const RenderItem = ({ label, desc, keyName }) => (
        <div className="preference-row">
            <div className="preference-label">
                <h5><b>{label}</b></h5>
                <p>{desc}</p>
            </div>
            <label className="switch">
                <input
                    type="checkbox"
                    checked={prefs[keyName]}
                    onChange={() => handleToggle(keyName)}
                />
                <span className="slider"></span>
            </label>
        </div>
    );

    return (
        <>
            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row">
                    <div className="col-md-12">
                        {/* Tabs (you can leave this static for now) */}
                        <ul className="nav nav-pills flex-column flex-md-row mb-4">
                            <li className="nav-item me-2">
                                <Link className="nav-link active" href="/notification-preferences"
                                ><i className="ri-notification-2-line me-2"></i> Notifications</Link>
                            </li>
                            <li className="nav-item me-2">
                                <Link className="nav-link" href="/Accounts/Account"
                                ><i className="ri-user-3-line me-2"></i> Account</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link " href="/Accounts/Security"
                                ><i className="ri-lock-line me-2"></i> Security</Link>
                            </li>
                        </ul>
                        <div className='card ps-5'>
                            <div className="notification-container">
                                <h1 className="notification-header">
                                    <span><i class="ri-notification-2-line" style={{ fontSize: "30px", color: "#2563EB" }}></i></span>Notification Preferences
                                </h1>
                                <p className="notification-subtext">
                                    Configure when and how you want to be notified
                                </p>

                                <div className="section">
                                    <h2 className="section-title border border-top-0 border-start-0 border-end-0 ">Renewal Reminders</h2>
                                    <RenderItem
                                        label="30 days before expiry"
                                        desc="Send a reminder 30 days before renewal is due"
                                        keyName="reminder_30"
                                    />
                                    <RenderItem
                                        label="15 days before expiry"
                                        desc="Send a reminder 15 days before renewal is due"
                                        keyName="reminder_15"
                                    />
                                    <RenderItem
                                        label="7 days before expiry"
                                        desc="Send a reminder 7 days before renewal is due"
                                        keyName="reminder_7"
                                    />
                                    <RenderItem
                                        label="Overdue renewals"
                                        desc="Send reminders for overdue renewals"
                                        keyName="overdue"
                                    />
                                </div>

                                <div className="section">
                                    <h2 className="section-title border border-top-0 border-start-0 border-end-0 ">Notification Methods</h2>
                                    <RenderItem
                                        label="Email Notifications"
                                        desc="Receive notifications via email"
                                        keyName="email"
                                    />
                                    <RenderItem
                                        label="Dashboard Notifications"
                                        desc="Show notifications in the dashboard"
                                        keyName="dashboard"
                                    />
                                </div>

                                <div className="section">
                                    <h2 className="section-title border border-top-0 border-start-0 border-end-0 ">Other Notifications</h2>
                                    <RenderItem
                                        label="Payment Received"
                                        desc="Notify when a payment is recorded"
                                        keyName="payment_received"
                                    />
                                </div>

                                <button onClick={handleSave} className="save-button">
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
