import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Link, useLocation } from "react-router-dom";
const BookingForm = () => {
  const [date, setDate] = useState();
  const { state } = useLocation();
  const { selectedRooms } = state || {};
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Layout activePage="Booking">
      <div className="">
        <div>
          <h2 className="text-sm inline-block border-b-2 border-gray-400">
            Create Booking
          </h2>
        </div>
      </div>
      <div className="mt-5">
        <form action="">
          <div className="grid md:grid-cols-2 gap-5">
            <div class="relative">
              <input
                type="text"
                id="booking_id"
                class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                placeholder=" "
              />
              <label
                for="booking_id"
                class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Booking ID
              </label>
            </div>
            <div class="relative">
              <input
                type="text"
                id="guest_name"
                class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                placeholder=" "
              />
              <label
                for="guest_name"
                class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Guest Name
              </label>
            </div>
            <div class="relative">
              <input
                type="date"
                id="checkin_date"
                class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                placeholder=" "
              />
              <label
                for="checkin_date"
                class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Check-In Date
              </label>
            </div>
            <div class="relative">
              <input
                type="date"
                id="checkout_date"
                class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                placeholder=" "
              />
              <label
                for="checkout_date"
                class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Check-Out Date
              </label>
            </div>

            <div className="relative">
              <select
                id="status"
                className="block px-2.5 pb-2 pt-3 w-full text-sm  text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                placeholder=" "
              >
                <option value="">Pending</option>
                <option value="">Confirmed</option>
                <option value="">Canceled</option>
              </select>
              <label
                htmlFor="status"
                className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Status
              </label>
            </div>
          </div>
          <div className="flex justify-between mt-5">
            <div>
              <Link
                to="/booking-management"
                className="py-1.5 px-9 border border-blue-600 rounded-xl text-gray-900 hover:bg-blue-50 transition-all duration-500"
              >
                Back To List
              </Link>
            </div>
            <div>
              <button className="bg-blue-600 text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
      <div>{JSON.stringify(selectedRooms)}</div>
    </Layout>
  );
};

export default BookingForm;
