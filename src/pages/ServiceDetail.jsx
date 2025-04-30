import React, { useEffect, useState } from 'react'
import Loader from '../common/Loader';
import Footer from './Footer';
import Nav from './Nav';
import axios from 'axios';
import { MdLocationPin } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar } from "@demark-pro/react-booking-calendar";
import "@demark-pro/react-booking-calendar/dist/react-booking-calendar.css";
import toast from 'react-hot-toast';
import { getToken, logout } from '../utils/jwtUtils';
import { BsFillSuitcaseLgFill } from "react-icons/bs";
import PayPalButton from './PaypalButton';
import bgimg from "../images/1.jpg";

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = getToken();
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [vendor, setVendor] = useState([]);
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    const [reservedDates, setReservedDates] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
      };
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
    useEffect(() => {
        fetchvendor();
        fetchReservedDates();
    }, [])
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = "hidden"; // Disable background scrolling
        } else {
            document.body.style.overflow = ""; // Re-enable background scrolling
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = "";
        };
    }, [isSidebarOpen]);
    const fetchvendor = async () => {
        setIsLoading(true);
        await axios
            .get(`${apiKey}api/vendors/${id}`, {
            })
            .then(function (response) {
                console.log(response)
                console.log(response.data);
                setVendor(response.data);
                setIsLoading(false);
            })
            .catch(function (error) {
                var errorMessage = error.response.data.error;
                if (errorMessage == "jwt expired") {
                    logout(navigate)
                }
                setIsLoading(false);
            });
    }

    const fetchReservedDates = async () => {
        setIsLoading(true);
        await axios
            .get(`${apiKey}api/vendors/getReservedDates/${id}`, {
            })
            .then(function (response) {
                console.log(response)
                setReservedDates(response.data);

                setIsLoading(false);
            })
            .catch(function (error) {
                var errorMessage = error.response.data.error;
                if (errorMessage == "jwt expired") {
                    logout(navigate)
                }
                setIsLoading(false);
            });
    }

    const formatDateForMySQL = (date) => {
        if (date instanceof Date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
        }
        return null;
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!selectedDates || selectedDates.length === 0) {
            toast.error("No date selected. Please select a date.");
            return;
        }
        const firstDate = selectedDates[0];
        const formattedDate = formatDateForMySQL(firstDate);
        const bookingData = {
            vendor_id: id,
            booking_date: formattedDate
        };
        setIsLoading(true);
        var api;
        if(isChecked)
        {
            api=`${apiKey}api/paypal/create-vendor-payment`;
        }
        else
        {
            api=`${apiKey}api/booking/createVendorBooking`;
        }
        await axios
            .post(api, bookingData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(function (response) {
                if(isChecked)
                {
                    var redirect=response.data.approvalUrl;
                    window.location.href = redirect;
                }
                else
                {
                    if (response.status === 201) {
                        toast.success(response.data.message);
                        navigate("/services");
                    }
                    setIsLoading(false);
                }
            })
            .catch(function (error) {
                var errorMessage = error.response.data.error;
                if (errorMessage == "jwt expired") {
                    toast.error("Token Expired!")
                    logout(navigate)
                }
                setIsLoading(false);
            });
    }

    return (
        <>

            {isLoading && (
                <Loader />
            )}

            {!isLoading && (
                <>

                    {/* overlay */}
                    <div onClick={toggleSidebar} className={`fixed left-0 top-0 w-full h-full z-[998] bg-gray-600 bg-opacity-50 transition-all duration-300 ease-linear  ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0  pointer-events-none"} `}>
                    </div>
                    {/*end of overlay */}
                    <Nav toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                    <section className='mt-16'>
                        <div class="w-full h-[25vh] lg:h-[50vh] relative">
                            <div class="absolute z-[1] top-0 w-full left-0 h-full flex items-center justify-center">
                                <div class="text-white   text-center w-1/2">
                                    <h2 class="lg:text-6xl md:text-4xl text-2xl font-extrabold wow animate__animated animate__lightSpeedInLeft">{vendor.name}</h2>
                                </div>
                            </div>
                            <div class="w-full h-full">
                                <img class="w-full h-full object-cover object-top brightness-50" src={bgimg} />
                            </div>
                        </div>
                        <div class="lg:pl-20  px-5 py-10 bg-blue-50">
                            <div className=' grid grid-cols-2 gap-5'>
                                <div className=''>
                                    <div className='flex gap-4'>
                                        <div class="mb-4 rounded-full bg-cyan-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm text-center">
                                            $ {vendor.price_range}
                                        </div>
                                        <p className='text-slate-600 leading-normal text-sm mb-2 font-semibold flex gap-2 line-clamp-1'>
                                            <BsFillSuitcaseLgFill className='text-xl' />{vendor.service_type}
                                        </p>
                                    </div>
                                    <div class=" mt-5 mb-20  mx-5">
                                        <div class="">
                                            <h2 class="text-2xl text-orange-500 font-semibold">
                                                {vendor.name}
                                            </h2>

                                            <div class="text-justify my-5">
                                                <p>
                                                    {vendor.description}
                                                </p>
                                            </div>

                                            <div className='mt-5 text-base font-semibold'>
                                                <h2>Contact: {vendor.contact_info}</h2>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className=''>
                                    <Calendar
                                        selected={selectedDates}
                                        reserved={reservedDates}
                                        onChange={setSelectedDates}
                                    />
                                    <div className='mt-5  gap-4'>
                                        <div class="flex items-center">
                                            <input onChange={handleCheckboxChange} id="link-checkbox" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                            <label for="link-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Pay In Advance</label>
                                        </div>
                                        <button onClick={handleBooking} class="inline-block mt-5 px-6 py-3 mb-4 text-white text-sm  font-semibold button-gradient rounded-full shadow-md  transition hover:bg-right">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                    <Footer />

                </>
            )}

        </>
    )
}

export default ServiceDetail