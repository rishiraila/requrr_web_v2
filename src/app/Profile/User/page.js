'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import "@/app/assets/vendor/css/pages/page-profile.css"

export default function page() {

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    name: '',
    phone: '',
  });

  const [isEdited, setIsEdited] = useState(false);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get('http://localhost:3000/api/EditUser ', {
        headers: {
          'Authorization': `${token}`,
        },
      });
      if (response.status === 200) {
        setFormData(response.data);
      } else {
        console.error('Error fetching user data:', response.status, response.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error.response ? error.response.data : error.message);
    }
  };
  useEffect(() => {

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setIsEdited(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put('/api/EditUser', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`, // Replace with actual token
        },
      });

      if (response.status === 200) {
        console.log('Profile updated successfully:', response.data);
        setIsEdited(false); // Reset the edited state after submission
      } else {
        console.error('Error updating profile:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.delete('/api/DeleteUser ', {
          headers: {
            'Authorization': `${token}`,
          },
        });

        if (response.status === 200) {
          console.log('User  deleted successfully:', response.data);
          // Optionally, redirect or update the UI after deletion
          localStorage.removeItem('token'); // Remove token from local storage
        } else {
          console.error('Error deleting user:', response.data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  return (
    <>

      <div className="container-xxl flex-grow-1 container-p-y">

        <div className="row">
          <div className="col-12">
            <div className="card mb-6">
              <div className="user-profile-header-banner">
                <img src="/assets/img/pages/profile-banner.png" alt="Banner image" className="rounded-top" />
              </div>
              <div className="user-profile-header d-flex flex-column flex-sm-row text-sm-start text-center mb-5">
                <div className="flex-shrink-0 mt-n2 mx-sm-0 mx-auto">
                  <img
                    src="/assets/img/avatars/1.png"
                    alt="user image"
                    className="d-block h-auto ms-0 ms-sm-5 rounded-4 user-profile-img" />
                </div>
                <div className="flex-grow-1 mt-4 mt-sm-12">
                  <div
                    className="d-flex align-items-md-end align-items-sm-start align-items-center justify-content-md-between justify-content-start mx-5 flex-md-row flex-column gap-6">
                    <div className="user-profile-info">
                    <h4 className="mb-2">{formData.name || 'John Doe'}</h4>
                      <ul
                        className="list-inline mb-0 d-flex align-items-center flex-wrap justify-content-sm-start justify-content-center gap-4">
                        <li className="list-inline-item">
                          <i className="ri-palette-line me-2 ri-24px"></i><span className="fw-medium">UX Designer</span>
                        </li>
                        <li className="list-inline-item">
                          <i className="ri-map-pin-line me-2 ri-24px"></i><span className="fw-medium">Vatican City</span>
                        </li>
                        <li className="list-inline-item">
                          <i className="ri-calendar-line me-2 ri-24px"></i
                          ><span className="fw-medium"> Joined April 2021</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <button onClick={handleDelete} className="btn btn-danger">
                      <i className="ri-user-follow-line ri-16px me-2"></i>Delete User
                      </button>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>








        <div className="row">
          <div className="col-xl-4 col-lg-5 col-md-5">

            <div className="card mb-6">
              <div className="card-body">
                <small className="card-text text-uppercase text-muted small">About</small>
                <ul className="list-unstyled my-3 py-1">
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-user-3-line ri-24px"></i><span className="fw-medium mx-2">Full Name:</span>
                    <span>John Doe</span>
                  </li>
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-check-line ri-24px"></i><span className="fw-medium mx-2">Status:</span>
                    <span>Active</span>
                  </li>
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-star-smile-line ri-24px"></i><span className="fw-medium mx-2">Role:</span>
                    <span>Developer</span>
                  </li>
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-flag-2-line ri-24px"></i><span className="fw-medium mx-2">Country:</span>
                    <span>USA</span>
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <i className="ri-translate-2 ri-24px"></i><span className="fw-medium mx-2">Languages:</span>
                    <span>English</span>
                  </li>
                </ul>
                <small className="card-text text-uppercase text-muted small">Contacts</small>
                <ul className="list-unstyled my-3 py-1">
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-phone-line ri-24px"></i><span className="fw-medium mx-2">Contact:</span>
                    <span>(123) 456-7890</span>
                  </li>
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-wechat-line ri-24px"></i><span className="fw-medium mx-2">Skype:</span>
                    <span>john.doe</span>
                  </li>
                  <li className="d-flex align-items-center mb-2">
                    <i className="ri-mail-open-line ri-24px"></i><span className="fw-medium mx-2">Email:</span>
                    <span>john.doe@example.com</span>
                  </li>
                </ul>
                <small className="card-text text-uppercase text-muted small">Teams</small>
                <ul className="list-unstyled mb-0 mt-3 pt-1">
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-github-line ri-24px text-body me-2"></i>
                    <div className="d-flex flex-wrap">
                      <span className="fw-medium me-2">Backend Developer</span><span>(126 Members)</span>
                    </div>
                  </li>
                  <li className="d-flex align-items-center">
                    <i className="ri-reactjs-line ri-24px text-body me-2"></i>
                    <div className="d-flex flex-wrap">
                      <span className="fw-medium me-2">React Developer</span><span>(98 Members)</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>



            <div className="card mb-6">
              <div className="card-body">
                <small className="card-text text-uppercase text-muted small">Overview</small>
                <ul className="list-unstyled mb-0 mt-3 pt-1">
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-check-line ri-24px"></i><span className="fw-medium mx-2">Task Compiled:</span>
                    <span>13.5k</span>
                  </li>
                  <li className="d-flex align-items-center mb-4">
                    <i className="ri-user-3-line ri-24px"></i><span className="fw-medium mx-2">Projects Compiled:</span>
                    <span>146</span>
                  </li>
                  <li className="d-flex align-items-center">
                    <i className="ri-star-smile-line ri-24px"></i><span className="fw-medium mx-2">Connections:</span>
                    <span>897</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>


          <div className="col-xl-8 col-lg-7 col-md-7">
            <div className="card card-action mb-6">
              <div className="card-header align-items-center">
                <h5 className="card-action-title mb-0">
                  <i className="ri-user-3-line ri-24px text-body me-4"></i>Edit Profile
                </h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {isEdited && (
                    <button type="submit" className="btn btn-primary">Update</button>
                  )}
                </form>
              </div>
            </div>
          </div>
          </div>

      </div>

    </>
  )
}
