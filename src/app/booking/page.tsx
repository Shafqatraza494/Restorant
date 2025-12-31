"use client";

import React, { useState } from "react";

export default function Page() {
  // Controlled form state
  const [booking, setBooking] = useState({
    name: "",
    email: "",
    datetime: "",
    people: "1",
    message: "",
  });

  // Handle input changes
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { id, value } = e.target;
    setBooking((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  // Submit handler
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Basic validation
    if (
      !booking.name.trim() ||
      !booking.email.trim() ||
      !booking.datetime.trim()
    ) {
      alert("Please fill in Name, Email, and Date & Time.");
      return;
    }

    // Save booking to localStorage (or send to API)
    const existingBookings = JSON.parse(
      localStorage.getItem("bookings") || "[]"
    );
    localStorage.setItem(
      "bookings",
      JSON.stringify([...existingBookings, booking])
    );

    alert("Booking successful!");

    // Reset form
    setBooking({
      name: "",
      email: "",
      datetime: "",
      people: "1",
      message: "",
    });
  }

  return (
    <div>
      {/* Navbar & Hero Start */}
      <div className="py-5 bg-dark hero-header mb-5">
        <div className="container text-center my-5 pt-5 pb-4">
          <h1 className="display-3 text-white mb-3 animated slideInDown">
            Booking
          </h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center text-uppercase">
              <li className="breadcrumb-item">
                <a href="#">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="#">Pages</a>
              </li>
              <li
                className="breadcrumb-item text-white active"
                aria-current="page"
              >
                Booking
              </li>
            </ol>
          </nav>
        </div>
      </div>
      {/* Navbar & Hero End */}

      {/* Reservation Start */}
      <div className="py-5 px-0 wow fadeInUp" data-wow-delay="0.1s">
        <div className="row g-0">
          <div className="col-md-6">
            <div className="video">
              <button
                type="button"
                className="btn-play"
                data-bs-toggle="modal"
                data-src="https://www.youtube.com/embed/DWRcNpR6Kdc"
                data-bs-target="#videoModal"
              >
                <span></span>
              </button>
            </div>
          </div>
          <div className="col-md-6 bg-dark d-flex align-items-center">
            <div className="p-5 wow fadeInUp" data-wow-delay="0.2s">
              <h5 className="section-title ff-secondary text-start text-primary fw-normal">
                Reservation
              </h5>
              <h1 className="text-white mb-4">Book A Table Online</h1>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Your Name"
                        value={booking.name}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="name">Your Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Your Email"
                        value={booking.email}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="email">Your Email</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="datetime"
                        placeholder="Date & Time"
                        value={booking.datetime}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="datetime">Date & Time</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id="people"
                        value={booking.people}
                        onChange={handleChange}
                      >
                        <option value="1">People 1</option>
                        <option value="2">People 2</option>
                        <option value="3">People 3</option>
                      </select>
                      <label htmlFor="people">No Of People</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <textarea
                        className="form-control"
                        placeholder="Special Request"
                        id="message"
                        style={{ height: "100px" }}
                        value={booking.message}
                        onChange={handleChange}
                      ></textarea>
                      <label htmlFor="message">Special Request</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100 py-3"
                      type="submit"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="videoModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content rounded-0">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Youtube Video
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            {/* Uncomment and fix iframe if you want video embed */}
            {/* <div className="modal-body">
              <div className="ratio ratio-16x9">
                <iframe
                  className="embed-responsive-item"
                  src="https://www.youtube.com/embed/DWRcNpR6Kdc"
                  allowFullScreen
                  allow="autoplay"
                  title="Youtube Video"
                ></iframe>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      {/* Reservation End */}
    </div>
  );
}
