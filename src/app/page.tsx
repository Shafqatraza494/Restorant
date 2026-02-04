"use client";

import { log } from "console";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useFetch from "src/hooks/useFetch";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
};

export default function Home() {
  const [data] = useFetch("https://dummyjson.com/posts");
  const [booking, setBooking] = useState({
    name: "",
    email: "",
    datetime: "",
    people: "1",
    message: "",
  });

  function handleBookingChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setBooking({
      ...booking,
      [e.target.id]: e.target.value,
    });
  }

  function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();

    const isReserved = Math.random() < 0.4;

    if (isReserved) {
      toast.error("❌ Sorry! Table Already Reserved");
      return;
    }

    const oldBookings = JSON.parse(localStorage.getItem("bookings") || "[]");

    localStorage.setItem("bookings", JSON.stringify([...oldBookings, booking]));

    toast.success("✅ Booking Successful!");

    setBooking({
      name: "",
      email: "",
      datetime: "",
      people: "1",
      message: "",
    });
  }

  const [menuItems, setMenuItems] = useState<CartItem[]>([]);
  console.log("mmm", setMenuItems);

  function addToCart(item: CartItem) {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const existingIndex = cart.findIndex(
      (cartItem: CartItem) => cartItem.id === item.id,
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += item.category;
    } else {
      cart.push(item);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    // Dispatch event so Navbar and other components know cart updated
    window.dispatchEvent(new Event("cartUpdate"));

    toast.success("Added to cart!");
  }
  async function handleCart(item: any) {
    let localData = localStorage.getItem("loggedInUser");
    if (localData) {
      let loggedInUser = JSON.parse(localData);
      item.user_id = loggedInUser.id;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      const data = await res.json();
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.message || "Error While adding to cart");
    }
  }

  async function fetchData() {
    try {
      const response = await fetch("/api/menu");
      const result: any = await response.json();
      setMenuItems(result);
      console.log(result);
    } catch (error) {
      console.log("error fetching menu");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className=" bg-white p-0">
        {/* <!-- Navbar & Hero Start --> */}
        <div className=" position-relative p-0">
          <div className=" py-5 bg-dark hero-header mb-5">
            <div className="container my-5 py-5">
              <div className="row align-items-center g-5">
                <div className="col-lg-6 text-center text-lg-start">
                  <h1 className="display-3 text-white animated slideInLeft">
                    {/* {data.posts.map((item) => item.title)} */}
                    <br />
                    Delicious Meal
                  </h1>
                  <p className="text-white animated slideInLeft mb-4 pb-2">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Nihil quam saepe porro voluptatum commodi ratione accusamus
                    assumenda modi unde molestias, odit dicta non expedita
                    quaerat suscipit aliquid consequatur. Quae, quas!
                  </p>
                  <Link
                    href=""
                    className="btn btn-primary py-sm-3 px-sm-5 me-3 animated slideInLeft"
                  >
                    Book A Table
                  </Link>
                </div>
                <div className="col-lg-6 text-center text-lg-end overflow-hidden">
                  <img className="img-fluid" src="/hero.png" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Navbar & Hero End --> */}
        {/* <!-- Service Start --> */}
        <div className=" py-5">
          <div className="container">
            <div className="row g-4">
              <div
                className="col-lg-3 col-sm-6 wow fadeInUp"
                data-wow-delay="0.1s"
              >
                <div className="service-item rounded pt-3">
                  <div className="p-4">
                    <i className="fa fa-3x fa-user-tie text-primary mb-4"></i>
                    <h5>Master Chefs</h5>
                    <p>
                      Diam elitr kasd sed at elitr sed ipsum justo dolor sed
                      clita amet diam
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3 col-sm-6 wow fadeInUp"
                data-wow-delay="0.3s"
              >
                <div className="service-item rounded pt-3">
                  <div className="p-4">
                    <i className="fa fa-3x fa-utensils text-primary mb-4"></i>
                    <h5>Quality Food</h5>
                    <p>
                      Diam elitr kasd sed at elitr sed ipsum justo dolor sed
                      clita amet diam
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3 col-sm-6 wow fadeInUp"
                data-wow-delay="0.5s"
              >
                <div className="service-item rounded pt-3">
                  <div className="p-4">
                    <i className="fa fa-3x fa-cart-plus text-primary mb-4"></i>
                    <h5>Online Order</h5>
                    <p>
                      Diam elitr kasd sed at elitr sed ipsum justo dolor sed
                      clita amet diam
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3 col-sm-6 wow fadeInUp"
                data-wow-delay="0.7s"
              >
                <div className="service-item rounded pt-3">
                  <div className="p-4">
                    <i className="fa fa-3x fa-headset text-primary mb-4"></i>
                    <h5>24/7 Service</h5>
                    <p>
                      Diam elitr kasd sed at elitr sed ipsum justo dolor sed
                      clita amet diam
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Service End --> */}

        {/* <!-- About Start --> */}
        <div className=" py-5">
          <div className="container">
            <div className="row g-5 align-items-center">
              <div className="col-lg-6">
                <div className="row g-3">
                  <div className="col-6 text-start">
                    <img
                      className="img-fluid rounded w-100 wow zoomIn"
                      data-wow-delay="0.1s"
                      src="/about-1.jpg"
                    />
                  </div>
                  <div className="col-6 text-start">
                    <img
                      className="img-fluid rounded w-75 wow zoomIn"
                      data-wow-delay="0.3s"
                      src="/about-2.jpg"
                      style={{ marginTop: "25%" }}
                    />
                  </div>
                  <div className="col-6 text-end">
                    <img
                      className="img-fluid rounded w-75 wow zoomIn"
                      data-wow-delay="0.5s"
                      src="/about-3.jpg"
                    />
                  </div>
                  <div className="col-6 text-end">
                    <img
                      className="img-fluid rounded w-100 wow zoomIn"
                      data-wow-delay="0.7s"
                      src="/about-4.jpg"
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <h5 className="section-title ff-secondary text-start text-primary fw-normal">
                  About Us
                </h5>
                <h1 className="mb-4">
                  Welcome to
                  <i className="fa fa-utensils text-primary me-2"></i>Restoran
                </h1>
                <p className="mb-4">
                  Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit.
                  Aliqu diam amet diam et eos erat ipsum et lorem et sit, sed
                  stet lorem sit.
                </p>
                <p className="mb-4">
                  Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit.
                  Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit,
                  sed stet lorem sit clita duo justo magna dolore erat amet
                </p>
                <div className="row g-4 mb-4">
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center border-start border-5 border-primary px-3">
                      <h1
                        className="flex-shrink-0 display-5 text-primary mb-0"
                        data-toggle="counter-up"
                      >
                        15
                      </h1>
                      <div className="ps-4">
                        <p className="mb-0">Years of</p>
                        <h6 className="text-uppercase mb-0">Experience</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex align-items-center border-start border-5 border-primary px-3">
                      <h1
                        className="flex-shrink-0 display-5 text-primary mb-0"
                        data-toggle="counter-up"
                      >
                        50
                      </h1>
                      <div className="ps-4">
                        <p className="mb-0">Popular</p>
                        <h6 className="text-uppercase mb-0">Master Chefs</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <a className="btn btn-primary py-3 px-5 mt-2" href="">
                  Read More
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- About End --> */}

        {/* <!-- Menu Start --> */}
        <div>
          {/* ... your existing header and nav here ... */}

          {/* Menu Items */}
          <div className="py-5">
            <div className="container">
              <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
                <h5 className="section-title ff-secondary text-center text-primary fw-normal">
                  Food Menu
                </h5>
                <h1 className="mb-5">Most Popular Items</h1>
              </div>
              <div className="row g-4">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="col-lg-6 d-flex align-items-center"
                  >
                    <img
                      className="flex-shrink-0 img-fluid rounded"
                      src={
                        item.image ||
                        "https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?semt=ais_hybrid&w=740&q=80"
                      }
                      alt={item.name}
                      style={{ width: "80px" }}
                    />
                    <div className="w-100 d-flex flex-column text-start ps-4">
                      <h5 className="d-flex justify-content-between border-bottom pb-2">
                        <span>{item.name}</span>
                        <span className="text-primary">Rs. {item.price}</span>
                      </h5>
                      <small className="fst-italic">
                        Ipsum ipsum clita erat amet dolor justo diam
                      </small>

                      <button
                        className="btn btn-sm btn-primary mt-2"
                        onClick={() => handleCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Menu End --> */}

        {/* <!-- Reservation Start --> */}
        <div className=" py-5 px-0 wow fadeInUp" data-wow-delay="0.1s">
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
                <form onSubmit={handleBookingSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          placeholder="Your Name"
                          value={booking.name}
                          onChange={handleBookingChange}
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
                          onChange={handleBookingChange}
                        />
                        <label htmlFor="email">Your Email</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div
                        className="form-floating date"
                        id="date3"
                        data-target-input="nearest"
                      >
                        <input
                          type="text"
                          className="form-control datetimepicker-input"
                          id="datetime"
                          placeholder="Date & Time"
                          value={booking.datetime}
                          onChange={handleBookingChange}
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
                          onChange={handleBookingChange}
                        >
                          <option value="1">People 1</option>
                          <option value="2">People 2</option>
                          <option value="3">People 3</option>
                        </select>

                        <label htmlFor="select1">No Of People</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating">
                        <textarea
                          className="form-control"
                          placeholder="Special Request"
                          id="message"
                          style={{ height: "80px" }}
                          value={booking.message}
                          onChange={handleBookingChange}
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
              <div className="modal-body">
                {/* <!-- 16:9 aspect ratio --> */}
                {/* <div className="ratio ratio-16x9">
                  <iframe
                    className="embed-responsive-item"
                    src=""
                    id="video"
                    allowfullscreen
                    allowscriptaccess="always"
                    allow="autoplay"
                  ></iframe>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Reservation Start --> */}

        {/* <!-- Team Start --> */}
        <div className=" pt-5 pb-3">
          <div className="container">
            <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
              <h5 className="section-title ff-secondary text-center text-primary fw-normal">
                Team Members
              </h5>
              <h1 className="mb-5">Our Master Chefs</h1>
            </div>
            <div className="row g-4">
              <div
                className="col-lg-3 col-md-6 wow fadeInUp"
                data-wow-delay="0.1s"
              >
                <div className="team-item text-center rounded overflow-hidden">
                  <div className="rounded-circle overflow-hidden m-4">
                    <img className="img-fluid" src="/team-1.jpg" alt="" />
                  </div>
                  <h5 className="mb-0">Full Name</h5>
                  <small>Designation</small>
                  <div className="d-flex justify-content-center mt-3">
                    <a className="btn btn-square btn-primary mx-1" href="">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a className="btn btn-square btn-primary mx-1" href="">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a className="btn btn-square btn-primary mx-1" href="">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3 col-md-6 wow fadeInUp"
                data-wow-delay="0.3s"
              >
                <div className="team-item text-center rounded overflow-hidden">
                  <div className="rounded-circle overflow-hidden m-4">
                    <img className="img-fluid" src="/team-2.jpg" alt="" />
                  </div>
                  <h5 className="mb-0">Full Name</h5>
                  <small>Designation</small>
                  <div className="d-flex justify-content-center mt-3">
                    <a className="btn btn-square btn-primary mx-1" href="">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a className="btn btn-square btn-primary mx-1" href="">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a className="btn btn-square btn-primary mx-1" href="">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3 col-md-6 wow fadeInUp"
                data-wow-delay="0.5s"
              >
                <div className="team-item text-center rounded overflow-hidden">
                  <div className="rounded-circle overflow-hidden m-4">
                    <img className="img-fluid" src="/team-3.jpg" alt="" />
                  </div>
                  <h5 className="mb-0">Full Name</h5>
                  <small>Designation</small>
                  <div className="d-flex justify-content-center mt-3">
                    <a className="btn btn-square btn-primary mx-1" href="">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a className="btn btn-square btn-primary mx-1" href="">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a className="btn btn-square btn-primary mx-1" href="">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3 col-md-6 wow fadeInUp"
                data-wow-delay="0.7s"
              >
                <div className="team-item text-center rounded overflow-hidden">
                  <div className="rounded-circle overflow-hidden m-4">
                    <img className="img-fluid" src="/team-4.jpg" alt="" />
                  </div>
                  <h5 className="mb-0">Full Name</h5>
                  <small>Designation</small>
                  <div className="d-flex justify-content-center mt-3">
                    <a className="btn btn-square btn-primary mx-1" href="">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a className="btn btn-square btn-primary mx-1" href="">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a className="btn btn-square btn-primary mx-1" href="">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Team End --> */}

        {/* <!-- Testimonial Start --> */}
        <div className=" py-5 wow fadeInUp" data-wow-delay="0.1s">
          <div className="container ">
            <div className="text-center">
              <h5 className="section-title ff-secondary text-center text-primary fw-normal">
                Testimonial
              </h5>
              <h1 className="mb-5">Our Clients Say!!!</h1>
            </div>
            <div className="owl-carousel testimonial-carousel">
              <div className="testimonial-item bg-transparent border rounded p-4">
                <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                <p>
                  Dolor et eos labore, stet justo sed est sed. Diam sed sed
                  dolor stet amet eirmod eos labore diam
                </p>
                <div className="d-flex align-items-center">
                  <img
                    className="img-fluid flex-shrink-0 rounded-circle"
                    src="/testimonial-1.jpg"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="ps-3">
                    <h5 className="mb-1">Client Name</h5>
                    <small>Profession</small>
                  </div>
                </div>
              </div>
              <div className="testimonial-item bg-transparent border rounded p-4">
                <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                <p>
                  Dolor et eos labore, stet justo sed est sed. Diam sed sed
                  dolor stet amet eirmod eos labore diam
                </p>
                <div className="d-flex align-items-center">
                  <img
                    className="img-fluid flex-shrink-0 rounded-circle"
                    src="/testimonial-2.jpg"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="ps-3">
                    <h5 className="mb-1">Client Name</h5>
                    <small>Profession</small>
                  </div>
                </div>
              </div>
              <div className="testimonial-item bg-transparent border rounded p-4">
                <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                <p>
                  Dolor et eos labore, stet justo sed est sed. Diam sed sed
                  dolor stet amet eirmod eos labore diam
                </p>
                <div className="d-flex align-items-center">
                  <img
                    className="img-fluid flex-shrink-0 rounded-circle"
                    src="/testimonial-3.jpg"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="ps-3">
                    <h5 className="mb-1">Client Name</h5>
                    <small>Profession</small>
                  </div>
                </div>
              </div>
              <div className="testimonial-item bg-transparent border rounded p-4">
                <i className="fa fa-quote-left fa-2x text-primary mb-3"></i>
                <p>
                  Dolor et eos labore, stet justo sed est sed. Diam sed sed
                  dolor stet amet eirmod eos labore diam
                </p>
                <div className="d-flex align-items-center">
                  <img
                    className="img-fluid flex-shrink-0 rounded-circle"
                    src="/testimonial-4.jpg"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="ps-3">
                    <h5 className="mb-1">Client Name</h5>
                    <small>Profession</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Testimonial End --> */}

        {/* <!-- Back to Top --> */}
        <a
          href="#"
          className="btn btn-lg btn-primary btn-lg-square back-to-top"
        >
          <i className="bi bi-arrow-up"></i>
        </a>
      </div>
    </div>
  );
}
