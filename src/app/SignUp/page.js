'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function page() {

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    // username: '',
    password: '',
    confirmPassword: ''
  });


  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        router.push('/Login')
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Something went wrong: ' + error.message);
    }
  };


  return (
    <>

      <div className="authentication-wrapper authentication-cover">

        <Link href="/" className="auth-cover-brand d-flex align-items-center gap-2">
          {/* <div style={{ backgroundColor: "#666CFF", borderRadius: "10px" }} className='p-2'>
            < i className="ri-time-line" style={{ fontSize: "25px", color: "#ffffff" }}></i>
          </div>
          <span className="app-brand-text demo menu-text fw-semibold ms-2">ReQurr</span> */}
          <img src='/images/logo.png' style={{width:"30%"}}/>
        </Link>

        <div className="authentication-inner row m-0">

          <div className="d-none d-lg-flex col-lg-7 col-xl-8 align-items-center justify-content-center p-12 pb-2">
            <img
              src="/assets/img/illustrations/auth-register-illustration-light.png"
              className="auth-cover-illustration w-100"
              alt="auth-illustration"
              data-app-light-img="illustrations/auth-register-illustration-light.png"
              data-app-dark-img="illustrations/auth-register-illustration-dark.png" />
            <img
              src="/assets/img/illustrations/auth-cover-register-mask-light.png"
              className="authentication-image"
              alt="mask"
              data-app-light-img="illustrations/auth-cover-register-mask-light.png"
              data-app-dark-img="illustrations/auth-cover-register-mask-dark.png" />
          </div>


          <div
            className="d-flex col-12 col-lg-5 col-xl-4 align-items-center authentication-bg position-relative py-sm-12 px-12 py-6">
            <div className="w-px-400 mx-auto pt-5 pt-lg-0">
              <h4 className="mb-1">Empower Your Finances 🚀</h4>
              <p className="mb-5">Sign up now to take charge of your income—effortless tracking, smarter management!</p>

              <form id="formAuthentication" className="mb-5" onSubmit={handleSubmit}>
                <div className="form-floating form-floating-outline mb-5">
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="email">Email</label>
                </div>
                {/* <div className="form-floating form-floating-outline mb-5">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="username">Username</label>
                </div> */}
                <div className="mb-5 form-password-toggle">
                  <div className="input-group input-group-merge">
                    <div className="form-floating form-floating-outline">
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="password">Password</label>
                    </div>
                  </div>
                </div>
                <div className="mb-5 form-password-toggle">
                  <div className="input-group input-group-merge">
                    <div className="form-floating form-floating-outline">
                      <input
                        type="password"
                        id="confirmPassword"
                        className="form-control"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="confirmPassword">Confirm Password</label>
                    </div>
                  </div>
                </div>
                <button className="btn btn-primary d-grid w-100">Sign up</button>
              </form>

              <p className="text-center">
                <span>Already have an account?</span>
                <Link href="/Login">
                  <span> Sign in instead</span>
                </Link>
              </p>

            </div>
          </div>

        </div>
      </div>
    </>
  )
}
