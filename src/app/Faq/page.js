import React from 'react'

export default function page() {
  return (
    <>
    
    <div className="container-xxl flex-grow-1 container-p-y">
              <div
                className="faq-header d-flex flex-column justify-content-center align-items-center h-px-300 position-relative overflow-hidden rounded-4">
                {/* <img
                  src="/assets/img/pages/header-light.png"
                  className="scaleX-n1-rtl faq-banner-img h-px-300 z-n1"
                  alt="background image"
                  data-app-light-img="pages/header-light.png"
                  data-app-dark-img="pages/header-dark.png" /> */}
                <h4 className="text-center text-primary mb-2">Hello, how can we help?</h4>
                <p className="text-body text-center mb-0 px-4">or choose a category to quickly find the help you need</p>
                <div className="input-wrapper mb-6 mt-7 input-group input-group-merge px-sm-5">
                  <span className="input-group-text" id="basic-addon1"><i className="ri-search-line"></i></span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ask a question...."
                    aria-label="Search"
                    aria-describedby="basic-addon1" />
                </div>
              </div>

              <div className="row mt-6">

                <div className="col-lg-3 col-md-4 col-12 mb-md-0 mb-4">
                  <div className="d-flex justify-content-between flex-column nav-align-left mb-2 mb-md-0">
                    <ul className="nav nav-pills flex-column flex-nowrap">
                      <li className="nav-item">
                        <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#payment">
                          <i className="ri-bank-card-line me-2"></i>
                          <span className="align-middle">Payment</span>
                        </button>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#delivery">
                          <i className="ri-shopping-cart-line me-2"></i>
                          <span className="align-middle">Delivery</span>
                        </button>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#cancellation">
                          <i className="ri-refresh-line me-2"></i>
                          <span className="align-middle">Cancellation & Return</span>
                        </button>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#orders">
                          <i className="ri-inbox-archive-line me-2"></i>
                          <span className="align-middle">My Orders</span>
                        </button>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#product">
                          <i className="ri-settings-4-line me-2"></i>
                          <span className="align-middle">Product & Services</span>
                        </button>
                      </li>
                    </ul>
                    <div className="d-none d-md-block">
                      <div className="mt-4 text-center">
                        <img
                          src="/assets/img/illustrations/faq-illustration.png"
                          className="img-fluid"
                          width="135"
                          alt="FAQ Image" />
                      </div>
                    </div>
                  </div>
                </div>
                

                
                <div className="col-lg-9 col-md-8 col-12">
                  <div className="tab-content p-0">
                    <div className="tab-pane fade show active" id="payment" role="tabpanel">
                      <div className="d-flex mb-4 gap-4">
                        <div className="avatar avatar-md">
                          <div className="avatar-initial bg-label-primary rounded-4">
                            <i className="ri-bank-card-line ri-30px"></i>
                          </div>
                        </div>
                        <div>
                          <h5 className="mb-0">
                            <span className="align-middle">Payment</span>
                          </h5>
                          <span>Get help with payment</span>
                        </div>
                      </div>
                      <div id="accordionPayment" className="accordion">
                        <div className="accordion-item active">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              aria-expanded="true"
                              data-bs-target="#accordionPayment-1"
                              aria-controls="accordionPayment-1">
                              When is payment taken for my order?
                            </button>
                          </h2>

                          <div id="accordionPayment-1" className="accordion-collapse collapse show">
                            <div className="accordion-body">
                              Payment is taken during the checkout process when you pay for your order. The order number
                              that appears on the confirmation screen indicates payment has been successfully processed.
                            </div>
                          </div>
                        </div>

                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#accordionPayment-2"
                              aria-controls="accordionPayment-2">
                              How do I pay for my order?
                            </button>
                          </h2>
                          <div id="accordionPayment-2" className="accordion-collapse collapse">
                            <div className="accordion-body">
                              We accept Visa®, MasterCard®, American Express®, and PayPal®. Our servers encrypt all
                              information submitted to them, so you can be confident that your credit card information
                              will be kept safe and secure.
                            </div>
                          </div>
                        </div>

                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#accordionPayment-3"
                              aria-controls="accordionPayment-3">
                              What should I do if I'm having trouble placing an order?
                            </button>
                          </h2>
                          <div id="accordionPayment-3" className="accordion-collapse collapse">
                            <div className="accordion-body">
                              For any technical difficulties you are experiencing with our website, please contact us at
                              our
                              <a href="javascript:void(0);">support portal</a>, or you can call us toll-free at
                              <span className="fw-medium">1-000-000-000</span>, or email us at
                              <a href="javascript:void(0);">order@companymail.com</a>
                            </div>
                          </div>
                        </div>

                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#accordionPayment-4"
                              aria-controls="accordionPayment-4">
                              Which license do I need for an end product that is only accessible to paying users?
                            </button>
                          </h2>
                          <div id="accordionPayment-4" className="accordion-collapse collapse">
                            <div className="accordion-body">
                              If you have paying users or you are developing any SaaS products then you need an Extended
                              License. For each products, you need a license. You can get free lifetime updates as well.
                            </div>
                          </div>
                        </div>

                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#accordionPayment-5"
                              aria-controls="accordionPayment-5">
                              Does my subscription automatically renew?
                            </button>
                          </h2>
                          <div id="accordionPayment-5" className="accordion-collapse collapse">
                            <div className="accordion-body">
                              No, This is not subscription based item.Pastry pudding cookie toffee bonbon jujubes
                              jujubes powder topping. Jelly beans gummi bears sweet roll bonbon muffin liquorice. Wafer
                              lollipop sesame snaps.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="delivery" role="tabpanel">
                      <div className="d-flex mb-4 gap-4 align-items-center">
                        <div className="avatar avatar-md">
                          <span className="avatar-initial bg-label-primary rounded-4">
                            <i className="ri-shopping-cart-line ri-30px"></i>
                          </span>
                        </div>
                        <div>
                          <h5 className="mb-0">
                            <span className="align-middle">Delivery</span>
                          </h5>
                          <span>Lorem ipsum, dolor sit amet.</span>
                        </div>
                      </div>
                      <div id="accordionDelivery" className="accordion">
                        <div className="accordion-item active">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              aria-expanded="true"
                              data-bs-target="#accordionDelivery-1"
                              aria-controls="accordionDelivery-1">
                              How would you ship my order?
                            </button>
                          </h2>

                          <div id="accordionDelivery-1" className="accordion-collapse collapse show">
                            <div className="accordion-body">
                              For large products, we deliver your product via a third party logistics company offering
                              you the “room of choice” scheduled delivery service. For small products, we offer free
                              parcel delivery.
                            </div>
                          </div>
                        </div>

                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#accordionDelivery-2"
                              aria-controls="accordionDelivery-2">
                              What is the delivery cost of my order?
                            </button>
                          </h2>
                          <div id="accordionDelivery-2" className="accordion-collapse collapse">
                            <div className="accordion-body">
                              The cost of scheduled delivery is $69 or $99 per order, depending on the destination
                              postal code. The parcel delivery is free.
                            </div>
                          </div>
                        </div>

                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#accordionDelivery-4"
                              aria-controls="accordionDelivery-4">
                              What to do if my product arrives damaged?
                            </button>
                          </h2>
                          <div id="accordionDelivery-4" className="accordion-collapse collapse">
                            <div className="accordion-body">
                              We will promptly replace any product that is damaged in transit. Just contact our
                              <a href="javascript:void(0);">support team</a>, to notify us of the situation within 48
                              hours of product arrival.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="cancellation" role="tabpanel">
                      <div className="d-flex mb-4 gap-4 align-items-center">
                        <div className="avatar avatar-md">
                          <span className="avatar-initial bg-label-primary rounded-4">
                            <i className="ri-refresh-line ri-30px"></i>
                          </span>
                        </div>
                        <div>
                          <h5 className="mb-0"><span className="align-middle">Cancellation & Return</span></h5>
                          <span>Lorem ipsum, dolor sit amet.</span>
                        </div>
                      </div>
                      <div id="accordionCancellation" className="accordion">
                        <div className="accordion-item active">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              aria-expanded="true"
                              data-bs-target="#accordionCancellation-1"
                              aria-controls="accordionCancellation-1">
                              Can I cancel my order?
                            </button>
                          </h2>

                          <div id="accordionCancellation-1" className="accordion-collapse collapse show">
                            <div className="accordion-body">
                              <p>
                                Scheduled delivery orders can be cancelled 72 hours prior to your selected delivery date
                                for full refund.
                              </p>
                              <p className="mb-0">
                                Parcel delivery orders cannot be cancelled, however a free return label can be provided
                                upon request.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#accordionCancellation-2"
                              aria-controls="accordionCancellation-2">
                              Can I return my product?
                            </button>
                          </h2>
                          <div id="accordionCancellation-2" className="accordion-collapse collapse">
                            <div className="accordion-body">
                              You can return your product within 15 days of delivery, by contacting our
                              <a href="javascript:void(0);">support team</a>, All merchandise returned must be in the
                              original packaging with all original items.
                            </div>
                          </div>
                        </div>

                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              aria-controls="accordionCancellation-3"
                              data-bs-target="#accordionCancellation-3">
                              Where can I view status of return?
                            </button>
                          </h2>
                          <div id="accordionCancellation-3" className="accordion-collapse collapse">
                            <div className="accordion-body">
                              <p>Locate the item from Your <a href="javascript:void(0);">Orders</a></p>
                              <p className="mb-0">Select <span className="fw-medium">Return/Refund</span> status</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="orders" role="tabpanel">
                      <div className="d-flex mb-4 gap-4 align-items-center">
                        <div className="avatar avatar-md">
                          <span className="avatar-initial bg-label-primary rounded-4">
                            <i className="ri-inbox-archive-line ri-30px"></i>
                          </span>
                        </div>
                        <div>
                          <h5 className="mb-0">
                            <span className="align-middle">My Orders</span>
                          </h5>
                          <span>Lorem ipsum, dolor sit amet.</span>
                        </div>
                      </div>
                      <div id="accordionOrders" className="accordion">
                        <div className="accordion-item active">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              aria-expanded="true"
                              data-bs-target="#accordionOrders-1"
                              aria-controls="accordionOrders-1">
                              Has my order been successful?
                            </button>
                          </h2>

                          <div id="accordionOrders-1" className="accordion-collapse collapse show">
                            <div className="accordion-body">
                              <p>
                                All successful order transactions will receive an order confirmation email once the
                                order has been processed. If you have not received your order confirmation email within
                                24 hours, check your junk email or spam folder.
                              </p>
                              <p className="mb-0">
                                Alternatively, log in to your account to check your order summary. If you do not have a
                                account, you can contact our Customer Care Team on
                                <span className="fw-medium">1-000-000-000</span>.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#accordionOrders-2"
                              aria-controls="accordionOrders-2">
                              My Promotion Code is not working, what can I do?
                            </button>
                          </h2>
                          <div id="accordionOrders-2" className="accordion-collapse collapse">
                            <div className="accordion-body">
                              If you are having issues with a promotion code, please contact us at
                              <span className="fw-medium">1 000 000 000</span> for assistance.
                            </div>
                          </div>
                        </div>

                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#accordionOrders-3"
                              aria-controls="accordionOrders-3">
                              How do I track my Orders?
                            </button>
                          </h2>
                          <div id="accordionOrders-3" className="accordion-collapse collapse">
                            <div className="accordion-body">
                              <p>
                                If you have an account just sign into your account from
                                <a href="javascript:void(0);">here</a> and select
                                <span className="fw-medium">“My Orders”</span>.
                              </p>
                              <p className="mb-0">
                                If you have a a guest account track your order from
                                <a href="javascript:void(0);">here</a> using the order number and the email address.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="product" role="tabpanel">
                      <div className="d-flex mb-4 gap-4 align-items-center">
                        <div className="avatar avatar-md">
                          <span className="avatar-initial bg-label-primary rounded-4">
                            <i className="ri-settings-4-line ri-30px"></i>
                          </span>
                        </div>
                        <div>
                          <h5 className="mb-0">
                            <span className="align-middle">Product & Services</span>
                          </h5>
                          <span>Lorem ipsum, dolor sit amet.</span>
                        </div>
                      </div>
                      <div id="accordionProduct" className="accordion">
                        <div className="accordion-item active">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              aria-expanded="true"
                              data-bs-target="#accordionProduct-1"
                              aria-controls="accordionProduct-1">
                              Will I be notified once my order has shipped?
                            </button>
                          </h2>

                          <div id="accordionProduct-1" className="accordion-collapse collapse show">
                            <div className="accordion-body">
                              Yes, We will send you an email once your order has been shipped. This email will contain
                              tracking and order information.
                            </div>
                          </div>
                        </div>

                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#accordionProduct-2"
                              aria-controls="accordionProduct-2">
                              Where can I find warranty information?
                            </button>
                          </h2>
                          <div id="accordionProduct-2" className="accordion-collapse collapse">
                            <div className="accordion-body">
                              We are committed to quality products. For information on warranty period and warranty
                              services, visit our Warranty section <a href="javascript:void(0);">here</a>.
                            </div>
                          </div>
                        </div>

                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#accordionProduct-3"
                              aria-controls="accordionProduct-3">
                              How can I purchase additional warranty coverage?
                            </button>
                          </h2>
                          <div id="accordionProduct-3" className="accordion-collapse collapse">
                            <div className="accordion-body">
                              For the peace of your mind, we offer extended warranty plans that add additional year(s)
                              of protection to the standard manufacturer’s warranty provided by us. To purchase or find
                              out more about the extended warranty program, visit Extended Warranty section
                              <a href="javascript:void(0);">here</a>.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>

              
              <div className="row my-6">
                <div className="col-12 text-center my-6">
                  <div className="badge bg-label-primary rounded-pill">Question?</div>
                  <h4 className="my-2">You still have a question?</h4>
                  <p className="mb-0">
                    If you can't find question in our FAQ, you can contact us. We'll answer you shortly!
                  </p>
                </div>
              </div>
              <div className="row justify-content-center gap-sm-0 gap-6">
                <div className="col-sm-6">
                  <div className="p-6 rounded-4 bg-faq-section d-flex align-items-center flex-column">
                    <div className="avatar avatar-md">
                      <span className="avatar-initial bg-label-primary rounded-3">
                        <i className="ri-phone-line ri-30px"></i>
                      </span>
                    </div>
                    <h5 className="mt-4 mb-1"><a className="text-heading" href="tel:+(810)25482568">+ (810) 2548 2568</a></h5>
                    <p className="mb-0">We are always happy to help</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-6 rounded-4 bg-faq-section d-flex align-items-center flex-column">
                    <div className="avatar avatar-md">
                      <span className="avatar-initial bg-label-primary rounded-3">
                        <i className="ri-mail-line ri-30px"></i>
                      </span>
                    </div>
                    <h5 className="mt-4 mb-1"><a className="text-heading" href="mailto:help@help.com">help@help.com</a></h5>
                    <p className="mb-0">Best way to get a quick answer</p>
                  </div>
                </div>
              </div>
              
            </div>

    </>
  )
}
