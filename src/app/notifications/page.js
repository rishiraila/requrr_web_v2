'use client';
import React, { useEffect, useState } from 'react';


export default function NotificationSettingsPage() {
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

  // Fetch user preferences on page load
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

  if (loading) return <p>Loading preferences...</p>;

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Notification Preferences</h2>
      {[
        { key: 'remind_30_days_before', label: '30 days before expiry' },
        { key: 'remind_15_days_before', label: '15 days before expiry' },
        { key: 'remind_7_days_before', label: '7 days before expiry' },
        { key: 'remind_overdue', label: 'Overdue renewals' },
        { key: 'email_notifications', label: 'Email Notifications' },
        { key: 'dashboard_notifications', label: 'Dashboard Notifications' },
        { key: 'payment_received_notifications', label: 'Payment Received' },
      ].map(({ key, label }) => (
        <div key={key} style={{ marginBottom: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={!!prefs[key]}
              onChange={() => handleToggle(key)}
              style={{ marginRight: '8px' }}
            />
            {label}
          </label>
        </div>
      ))}
      <button onClick={savePrefs} style={{ marginTop: '1rem', padding: '10px 20px' }}>
        Save Preferences
      </button>
    </div>
  );
}
