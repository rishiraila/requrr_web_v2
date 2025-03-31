import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EditServiceModal({ show, onClose, service, onServiceUpdated }) {
    const [formData, setFormData] = useState(service || {});

    useEffect(() => {
        console.log('Receiving service', service);
        setFormData(service || {}); // Update formData when service changes
    }, [service]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:3000/api/Services/`, formData, {
                headers: { Authorization: token },
            });
            onServiceUpdated();
            onClose();
        } catch (error) {
            console.error("Error updating service:", error);
        }
    };

    if (!show) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '8px',
                width: '400px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
            }}>
                <h3>Edit Service</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input type="text" name="service_name" value={formData.service_name || ''} onChange={handleChange} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    <textarea name="service_desc" value={formData.service_desc || ''} onChange={handleChange} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'none' }} />
                    <input type="number" name="min_duration" value={formData.min_duration || ''} onChange={handleChange} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    <input type="number" name="amount" value={formData.amount || ''} onChange={handleChange} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    <select name="category" value={formData.category || ''} onChange={handleChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Update</button>
                        <button type="button" onClick={onClose} style={{ padding: '10px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}