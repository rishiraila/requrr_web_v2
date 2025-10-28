'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import countries from 'world-countries';


export default function page() {

  const allCountries = countries.map(country => ({
    label: country.name.common,
    value: country.cca2, // country code (e.g., 'IN')
    phoneCode: country.idd?.root + (country.idd?.suffixes?.[0] || '') || ''
  }));

  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    country_code: '',
    phone_code: '',
    phone: '',
    full_name: ''
  });


  const handleCountryChange = (e) => {
    const selected = allCountries.find(c => c.value === e.target.value);
    setFormData(prev => ({
      ...prev,
      country_code: selected?.value || '',
      phone_code: selected?.phoneCode || ''
    }));
  };



  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s]+$/;
    const phoneRegex = /^\d+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!formData.full_name.trim()) {
      errors.full_name = "Full name is required.";
    } else if (!nameRegex.test(formData.full_name)) {
      errors.full_name = "Full name can only contain letters and spaces.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.country_code) {
      errors.country_code = "Please select a country.";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Phone number must be numeric.";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required.";
    } else if (!passwordRegex.test(formData.password)) {
      errors.password = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.";
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Parse full name into first and last
    const nameParts = formData.full_name.trim().split(/\s+/);
    let first_name = '';
    let last_name = '';

    if (nameParts.length === 1) {
      first_name = nameParts[0];
    } else if (nameParts.length === 2) {
      [first_name, last_name] = nameParts;
    } else if (nameParts.length > 2) {
      first_name = nameParts[0];
      last_name = nameParts[nameParts.length - 1];
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
          first_name,
          last_name,
          email: formData.email,
          password: formData.password,
          country_code: formData.country_code,
          phone_code: formData.phone_code,
          phone: formData.phone
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
          <img src='/images/logo.png' style={{ width: "30%" }} />
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
                    name="full_name"
                    placeholder="Full Name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                  <label>Full Name</label>
                  {fieldErrors.full_name && <div className="text-danger small">{fieldErrors.full_name}</div>}
                </div>


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
                  {fieldErrors.email && <div className="text-danger small">{fieldErrors.email}</div>}
                </div>

                <div className="form-floating form-floating-outline mb-5">
                  <select
                    className="form-select"
                    name="country_code"
                    value={formData.country_code}
                    onChange={handleCountryChange}
                    required
                  >
                    <option value="">Select Country</option>
                    {allCountries.map(country => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  <label>Country</label>
                  {fieldErrors.country_code && <div className="text-danger small">{fieldErrors.country_code}</div>}
                </div>

                <div className="form-floating form-floating-outline mb-5">
                  <input
                    type="text"
                    className="form-control"
                    name="phone_code"
                    placeholder="Phone Code"
                    value={formData.phone_code}
                    readOnly
                  />
                  <label>Phone Code</label>
                </div>

                <div className="form-floating form-floating-outline mb-5">
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <label>Phone</label>
                  {fieldErrors.phone && <div className="text-danger small">{fieldErrors.phone}</div>}
                </div>

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
                  {fieldErrors.password && <div className="text-danger small">{fieldErrors.password}</div>}
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
                  {fieldErrors.confirmPassword && <div className="text-danger small">{fieldErrors.confirmPassword}</div>}
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
