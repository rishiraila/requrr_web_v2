import React from 'react'

export default function page() {
    return (
        <>

            <div className="container-xxl flex-grow-1 container-p-y">
                <div className="row">
                    <div className="col-md-12">
                        <div className="nav-align-top">
                            <ul className="nav nav-pills flex-column flex-md-row mb-6 gap-2 gap-lg-0">
                                <li className="nav-item">
                                    <a className="nav-link" href="/Accounts/Account"
                                    ><i className="ri-group-line me-2"></i> Account</a
                                    >
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active" href="javascript:void(0);"
                                    ><i className="ri-lock-line me-2"></i> Security</a
                                    >
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/Accounts/Billing"
                                    ><i className="ri-bookmark-line me-2"></i> Billing & Plans</a
                                    >
                                </li>

                            </ul>
                        </div>

                        <div className="card mb-6">
                            <h5 className="card-header">Change Password</h5>
                            <div className="card-body pt-1">
                                <form id="formAccountSettings" method="GET" onsubmit="return false">
                                    <div className="row">
                                        <div className="mb-5 col-md-6 form-password-toggle">
                                            <div className="input-group input-group-merge">
                                                <div className="form-floating form-floating-outline">
                                                    <input
                                                        className="form-control"
                                                        type="password"
                                                        name="currentPassword"
                                                        id="currentPassword"
                                                        placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" />
                                                    <label for="currentPassword">Current Password</label>
                                                </div>
                                                <span className="input-group-text cursor-pointer"><i className="ri-eye-off-line"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row g-5 mb-6">
                                        <div className="col-md-6 form-password-toggle">
                                            <div className="input-group input-group-merge">
                                                <div className="form-floating form-floating-outline">
                                                    <input
                                                        className="form-control"
                                                        type="password"
                                                        id="newPassword"
                                                        name="newPassword"
                                                        placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" />
                                                    <label for="newPassword">New Password</label>
                                                </div>
                                                <span className="input-group-text cursor-pointer"><i className="ri-eye-off-line"></i></span>
                                            </div>
                                        </div>
                                        <div className="col-md-6 form-password-toggle">
                                            <div className="input-group input-group-merge">
                                                <div className="form-floating form-floating-outline">
                                                    <input
                                                        className="form-control"
                                                        type="password"
                                                        name="confirmPassword"
                                                        id="confirmPassword"
                                                        placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" />
                                                    <label for="confirmPassword">Confirm New Password</label>
                                                </div>
                                                <span className="input-group-text cursor-pointer"><i className="ri-eye-off-line"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                    <h6 className="text-body">Password Requirements:</h6>
                                    <ul className="ps-4 mb-0">
                                        <li className="mb-4">Minimum 8 characters long - the more, the better</li>
                                        <li className="mb-4">At least one lowercase character</li>
                                        <li>At least one number, symbol, or whitespace character</li>
                                    </ul>
                                    <div className="mt-6">
                                        <button type="submit" className="btn btn-primary me-3">Save changes</button>
                                        <button type="reset" className="btn btn-outline-secondary">Reset</button>
                                    </div>
                                </form>
                            </div>
                        </div>



                        <div className="card mb-6">
                            <div className="card-body">
                                <h5 className="mb-6">Two-steps verification</h5>
                                <p className="mb-4">Two factor authentication is not enabled yet.</p>
                                <p className="w-75">
                                    Two-factor authentication adds an additional layer of security to your account by requiring more
                                    than just a password to log in.
                                    <a href="javascript:void(0);">Learn more.</a>
                                </p>
                                <button className="btn btn-primary mt-2" data-bs-toggle="modal" data-bs-target="#enableOTP">
                                    Enable Two-Factor Authentication
                                </button>
                            </div>
                        </div>



                        <div className="modal fade" id="enableOTP" tabindex="-1" aria-hidden="true">
                            <div className="modal-dialog modal-simple modal-enable-otp modal-dialog-centered">
                                <div className="modal-content">
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    <div className="modal-body p-0">
                                        <div className="text-center mb-6">
                                            <h4 className="mb-2">Enable One Time Password</h4>
                                            <p>Verify Your Mobile Number for SMS</p>
                                        </div>
                                        <p className="mb-5">
                                            Enter your mobile phone number with country code and we will send you a verification code.
                                        </p>
                                        <form id="enableOTPForm" className="row g-5" onsubmit="return false">
                                            <div className="col-12">
                                                <div className="input-group input-group-merge">
                                                    <span className="input-group-text">US (+1)</span>
                                                    <div className="form-floating form-floating-outline">
                                                        <input
                                                            type="text"
                                                            id="modalEnableOTPPhone"
                                                            name="modalEnableOTPPhone"
                                                            className="form-control phone-number-otp-mask"
                                                            placeholder="202 555 0111" />
                                                        <label for="modalEnableOTPPhone">Phone Number</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 d-flex flex-wrap justify-content-center gap-4 row-gap-4">
                                                <button type="submit" className="btn btn-primary">Submit</button>
                                                <button
                                                    type="reset"
                                                    className="btn btn-outline-secondary"
                                                    data-bs-dismiss="modal"
                                                    aria-label="Close">
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>




                        <div className="card mb-6">
                            <h5 className="card-header mb-1">Create an API key</h5>
                            <div className="row row-gap-1">
                                <div className="col-xl-5 col-md-7">
                                    <div className="card-body">
                                        <form id="formAccountSettingsApiKey" method="GET" onsubmit="return false">
                                            <div className="row gy-5">
                                                <div className="col-12">
                                                    <div className="form-floating form-floating-outline">
                                                        <select id="apiAccess" className="select2 form-select">
                                                            <option value="">Choose Key Type</option>
                                                            <option value="full">Full Control</option>
                                                            <option value="modify">Modify</option>
                                                            <option value="read-execute">Read & Execute</option>
                                                            <option value="folders">List Folder Contents</option>
                                                            <option value="read">Read Only</option>
                                                            <option value="read-write">Read & Write</option>
                                                        </select>
                                                        <label for="apiAccess">Choose the Api key type you want to create</label>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="form-floating form-floating-outline">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="apiKey"
                                                            name="apiKey"
                                                            placeholder="Server Key 1" />
                                                        <label for="apiKey">Name the API key</label>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <button type="submit" className="btn btn-primary me-2 w-100">Create Key</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="col-xl-7 col-md-5">
                                    <div className="text-center">
                                        <img
                                            src="/assets/img/illustrations/account-settings-security-illustration.png"
                                            className="img-fluid"
                                            alt="Api Key Image"
                                            width="143" />
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="card mb-6">
                            <div className="card-body">
                                <h5>API Key List & Access</h5>
                                <p className="mb-6">
                                    An API key is a simple encrypted string that identifies an application without any principal.
                                    They are useful for accessing public data anonymously, and are used to associate API requests
                                    with your project for quota and billing.
                                </p>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="bg-lighter rounded-3 p-4 mb-6">
                                            <div className="d-flex align-items-center mb-2">
                                                <h6 className="mb-0 me-3">Server Key 1</h6>
                                                <span className="badge bg-label-primary rounded-pill">Full Access</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <span className="me-3 fw-medium">23eaf7f0-f4f7-495e-8b86-fad3261282ac</span>
                                                <span className="cursor-pointer"><i className="ri-file-copy-line ri-20px"></i></span>
                                            </div>
                                            <span className="text-muted">Created on 28 Apr 2021, 18:20 GTM+4:10</span>
                                        </div>
                                        <div className="bg-lighter rounded-3 p-4 mb-6">
                                            <div className="d-flex align-items-center mb-2">
                                                <h6 className="mb-0 me-3">Server Key 2</h6>
                                                <span className="badge bg-label-primary rounded-pill">Read Only</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <span className="me-3 fw-medium">bb98e571-a2e2-4de8-90a9-2e231b5e99</span>
                                                <span className="cursor-pointer"><i className="ri-file-copy-line ri-20px"></i></span>
                                            </div>
                                            <span className="text-muted">Created on 12 Feb 2021, 10:30 GTM+2:30</span>
                                        </div>
                                        <div className="bg-lighter rounded-3 p-4">
                                            <div className="d-flex align-items-center mb-2">
                                                <h6 className="mb-0 me-3">Server Key 3</h6>
                                                <span className="badge bg-label-primary rounded-pill">Full Access</span>
                                            </div>
                                            <div className="d-flex align-items-center mb-2">
                                                <span className="me-3 fw-medium">2e915e59-3105-47f2-8838-6e46bf83b711</span>
                                                <span className="cursor-pointer"><i className="ri-file-copy-line ri-20px"></i></span>
                                            </div>
                                            <span className="text-muted">Created on 28 Dec 2020, 12:21 GTM+4:10</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="card">
                            <h6 className="card-header">Recent Devices</h6>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th className="text-truncate">Browser</th>
                                            <th className="text-truncate">Device</th>
                                            <th className="text-truncate">Location</th>
                                            <th className="text-truncate">Recent Activities</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-truncate text-heading">
                                                <i className="ri-macbook-line ri-20px text-warning me-3"></i>Chrome on Windows
                                            </td>
                                            <td className="text-truncate">HP Spectre 360</td>
                                            <td className="text-truncate">Switzerland</td>
                                            <td className="text-truncate">10, July 2021 20:07</td>
                                        </tr>
                                        <tr>
                                            <td className="text-truncate text-heading">
                                                <i className="ri-android-line ri-20px text-success me-3"></i>Chrome on iPhone
                                            </td>
                                            <td className="text-truncate">iPhone 12x</td>
                                            <td className="text-truncate">Australia</td>
                                            <td className="text-truncate">13, July 2021 10:10</td>
                                        </tr>
                                        <tr>
                                            <td className="text-truncate text-heading">
                                                <i className="ri-smartphone-line ri-20px text-danger me-3"></i>Chrome on Android
                                            </td>
                                            <td className="text-truncate">Oneplus 9 Pro</td>
                                            <td className="text-truncate">Dubai</td>
                                            <td className="text-truncate">14, July 2021 15:15</td>
                                        </tr>
                                        <tr>
                                            <td className="text-truncate text-heading">
                                                <i className="ri-mac-line ri-20px text-info me-3"></i>Chrome on MacOS
                                            </td>
                                            <td className="text-truncate">Apple iMac</td>
                                            <td className="text-truncate">India</td>
                                            <td className="text-truncate">16, July 2021 16:17</td>
                                        </tr>
                                        <tr>
                                            <td className="text-truncate text-heading">
                                                <i className="ri-macbook-line ri-20px text-warning me-3"></i>Chrome on Windows
                                            </td>
                                            <td className="text-truncate">HP Spectre 360</td>
                                            <td className="text-truncate">Switzerland</td>
                                            <td className="text-truncate">20, July 2021 21:01</td>
                                        </tr>
                                        <tr className="border-transparent">
                                            <td className="text-truncate text-heading">
                                                <i className="ri-android-line ri-20px text-success me-3"></i>Chrome on Android
                                            </td>
                                            <td className="text-truncate">Oneplus 9 Pro</td>
                                            <td className="text-truncate">Dubai</td>
                                            <td className="text-truncate">21, July 2021 12:22</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}
