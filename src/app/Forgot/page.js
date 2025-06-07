'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Page() {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            await axios.post('/api/users/forgot-password', { email, newPassword });
            setMessage('✅ Password reset successfully! You can now log in.');
            setEmail('');
            setNewPassword('');
        } catch (err) {
            setMessage('❌ ' + (err.response?.data?.error || 'Something went wrong'));
        }
    };

    return (
        <div className="authentication-wrapper authentication-cover">
            <a href="/" className="auth-cover-brand d-flex align-items-center gap-2">
                <span className="app-brand-logo demo">
                    <span style={{ color: "var(--bs-primary)" }}>
                        <svg width="268" height="150" viewBox="0 0 38 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30.0944 2.22569C29.0511 0.444187 26.7508 -0.172113 24.9566 0.849138..." fill="currentColor" />
                            {/* <!-- SVG content truncated for brevity --> */}
                        </svg>
                    </span>
                </span>
                <span className="app-brand-text demo text-heading fw-semibold">Materialize</span>
            </a>

            <div className="authentication-inner row m-0">
                <div className="d-none d-lg-flex col-lg-7 col-xl-8 align-items-center justify-content-center p-12 pb-2">
                    <img
                        src="/assets/img/illustrations/auth-forgot-password-illustration-light.png"
                        className="auth-cover-illustration w-100"
                        alt="auth-illustration"
                    />
                    <img
                        src="/assets/img/illustrations/auth-cover-forgot-password-mask-light.png"
                        className="authentication-image"
                        alt="mask"
                    />
                </div>

                <div className="d-flex col-12 col-lg-5 col-xl-4 align-items-center authentication-bg p-sm-12 p-6">
                    <div className="w-px-400 mx-auto">
                        <h4 className="mb-1">Forgot Password? 🔒</h4>
                        <p className="mb-4">Enter your email and new password to reset it.</p>

                        <form onSubmit={handleSubmit} className="mb-4">
                            <div className="form-floating form-floating-outline mb-4">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="form-floating form-floating-outline mb-4">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="newPassword"
                                    name="newPassword"
                                    placeholder="New password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <label htmlFor="newPassword">New Password</label>
                            </div>

                            <button className="btn btn-primary d-grid w-100" type="submit">Reset Password</button>
                        </form>

                        {message && <div className="alert alert-info text-center">{message}</div>}

                        <div className="text-center">
                            <Link href="/Login" className="d-flex align-items-center justify-content-center">
                                <i className="ri-arrow-left-s-line scaleX-n1-rtl ri-20px me-1_5"></i>
                                Back to login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
