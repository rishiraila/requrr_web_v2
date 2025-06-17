'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import axios from "axios";

export default function page() {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/auth/login", {
        email: email,  // Adjust this if the backend expects `username`
        password: password,
      });

      console.log("Login Success:", response.data);

      // Save token to localStorage
      localStorage.setItem('token', response.data.token);

      // Redirect to dashboard or homepage
      window.location.href = "/";
    } catch (err) {
      console.error("Login Error:", err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
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
              src="/assets/img/illustrations/auth-login-illustration-light.png"
              className="auth-cover-illustration w-100"
              alt="auth-illustration"
              data-app-light-img="illustrations/auth-login-illustration-light.png"
              data-app-dark-img="illustrations/auth-login-illustration-dark.png" />
            <img
              src="/assets/img/illustrations/auth-cover-login-mask-light.png"
              className="authentication-image"
              alt="mask"
              data-app-light-img="illustrations/auth-cover-login-mask-light.png"
              data-app-dark-img="illustrations/auth-cover-login-mask-dark.png" />
          </div>



          <div
            className="d-flex col-12 col-lg-5 col-xl-4 align-items-center authentication-bg position-relative py-sm-12 px-12 py-6">
            <div className="w-px-400 mx-auto pt-5 pt-lg-0">
              <h4 className="mb-1">Welcome to Requrr! 👋</h4>
              <p className="mb-5">Take control of your finances—track your income now</p>

              <form id="formAuthentication" className="mb-5" onSubmit={handleLogin}>
                <div className="form-floating form-floating-outline mb-5">
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    name="email-username"
                    placeholder="Enter your email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus />
                  <label htmlFor="email">Email or Username</label>
                </div>
                <div className="mb-5">
                  <div className="form-password-toggle">
                    <div className="input-group input-group-merge">
                      <div className="form-floating form-floating-outline">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          className="form-control"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••"
                          aria-describedby="password"
                        />
                        <label htmlFor="password">Password</label>
                      </div>
                      <span
                        className="input-group-text cursor-pointer"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <i className={`ri-${showPassword ? 'eye-line' : 'eye-off-line'}`}></i>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-5 d-flex justify-content-between mt-5">
                  
                  <Link href="/Forgot" className="float-end mb-1 mt-2">
                    <span>Forgot Password?</span>
                  </Link>
                </div>
                {/* Error Message */}
                {error && <p className="text-danger">{error}</p>}


                {/* Submit Button */}
                <button className="btn btn-primary d-grid w-100" type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Sign in"}
                </button>
              </form>

              <p className="text-center">
                <span>New on our platform?</span>
                <Link href="/SignUp">
                  <span> Create an account</span>
                </Link>
              </p>

            </div>
          </div>

        </div>
      </div>

    </>
  )
}
