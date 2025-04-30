import React, { useEffect, useState } from 'react'
import Loader from '../common/Loader';
import Footer from './Footer';
import Nav from './Nav';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BsFillSuitcaseLgFill } from "react-icons/bs";
import { getToken } from '../utils/jwtUtils';
import { MdLocationPin } from "react-icons/md";
const MyBooking = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [vendors, setVendors] = useState([]);
    const [venues, setVenues] = useState([]);

    const token = getToken();
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
    useEffect(() => {
        const getData = async () => {
            await fetchUserBookings();
        };
        getData();  
    }, [])

    const fetchUserBookings= async ()=>{
        await fetchVendorUserBookings();
        await fetchVenueUserBookings();
    }
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
    const fetchVendorUserBookings = async () => {
        setIsLoading(true);
        await axios
            .get(`${apiKey}api/vendors/bookings/get-User-Bookings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(function (response) {
                console.log(response)
                console.log(response.data);
                setVendors(response.data);
                setIsLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                var errorMessage = error.response.data.error;
                if (errorMessage == "jwt expired") {
                    logout(navigate)
                }
                setIsLoading(false);
            });
    }
    const fetchVenueUserBookings = async () => {
        setIsLoading(true);
        await axios
            .get(`${apiKey}api/venues/bookings/get-User-Bookings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(function (response) {
                console.log(response.data);
                setVenues(response.data);
                setIsLoading(false);
            })
            .catch(function (error) {
                console.log(error);
                var errorMessage = error.response.data.error;
                if (errorMessage == "jwt expired") {
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


                    {/* about section */}
                    <section className='md:px-20 px-10 py-10 mt-20 min-h-[60vh]'>
                        <h2 className='text-center text-3xl md:text-4xl font-bold text-[#236a9d] underline mb-12'>My Bookings</h2>
                        <h2 className='text-center text-2xl md:text-3xl font-bold text-[#236a9d] underline mb-5'>Venues</h2>
                        <div className='grid grid-cols-3 gap-12'>
                            {venues.length > 0 ? (
                                venues.map((element, index) => (
                                    <a href="javascript:void(0)" key={index}>
                                        <div class="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg">
                                            <div class="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
                                                <img src={apiKey + element.imageUrl} alt="card-image" />
                                            </div>
                                            <div class="px-4">
                                                <div className='flex gap-4'>
                                                    <div class="mb-4 rounded-full bg-cyan-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm text-center">
                                                        {element.payment_status}
                                                    </div>
                                                    <p className='text-slate-600 leading-normal text-sm mb-2 font-semibold flex gap-2 line-clamp-1'>
                                                        <MdLocationPin className='text-xl' />{element.location}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className='text-slate-600 leading-normal text-sm mb-2 font-semibold flex gap-2 line-clamp-1'>
                                                        Booked Date: {new Date(element.booking_date).toLocaleDateString('en-GB', {
                                                            weekday: 'short',   // Abbreviated weekday, e.g., "Wed"
                                                            day: '2-digit',     // Day of the month, e.g., "25"
                                                            month: 'short',     // Abbreviated month, e.g., "Dec"
                                                            year: 'numeric',    // Full year, e.g., "2024"
                                                        })}
                                                    </p>
                                                </div>
                                                <h6 class="mb-2 text-slate-800 text-lg font-semibold line-clamp-1">
                                                    {element.name}
                                                </h6>
                                                <p class="text-slate-600 leading-normal font-light text-sm line-clamp-2 mb-3">
                                                    {element.description}
                                                </p>
                                                <Link to={`/venues/${element.id}`} class="inline-block px-4 py-1.5 mb-4 text-white text-sm font-semibold button-gradient rounded-full shadow-md  transition hover:bg-right">
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    </a>

                                ))) : (
                                <p className="text-gray-500 text-center mt-10">No venues available.</p>
                            )}
                        </div>

                        <h2 className='text-center text-2xl md:text-3xl font-bold text-[#236a9d] underline mb-5 mt-12'>Vendors</h2>
                        <div className='grid grid-cols-3 gap-12'>
                            {vendors.length > 0 ? (
                                vendors.map((element, index) => (
                                    <a href="javascript:void(0)" key={index}>
                                        <div class="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg">
                                            {/* <div class="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
                                                <img src={apiKey + element.imageUrl} alt="card-image" />
                                            </div> */}
                                            <div class="px-4 mt-5">
                                                <div className='flex gap-4'>
                                                    <div class="mb-4 rounded-full bg-cyan-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm text-center">
                                                        {element.payment_status}
                                                    </div>
                                                    <p className='text-slate-600 leading-normal text-sm mb-2 font-semibold flex gap-2 line-clamp-1'>
                                                        <BsFillSuitcaseLgFill className='text-xl' />{element.service_type}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className='text-slate-600 leading-normal text-sm mb-2 font-semibold flex gap-2 line-clamp-1'>
                                                        Booked Date: {new Date(element.booking_date).toLocaleDateString('en-GB', {
                                                            weekday: 'short',   // Abbreviated weekday, e.g., "Wed"
                                                            day: '2-digit',     // Day of the month, e.g., "25"
                                                            month: 'short',     // Abbreviated month, e.g., "Dec"
                                                            year: 'numeric',    // Full year, e.g., "2024"
                                                        })}
                                                    </p>
                                                </div>
                                                <h6 class="mb-2 text-slate-800 text-lg font-semibold line-clamp-1">
                                                    {element.name}
                                                </h6>
                                                <p class="text-slate-600 leading-normal font-light text-sm line-clamp-2 mb-3">
                                                    {element.description}
                                                </p>
                                                <Link to={`/services/${element.id}`} class="inline-block px-4 py-1.5 mb-4 text-white text-sm font-semibold button-gradient rounded-full shadow-md  transition hover:bg-right">
                                                View
                                                </Link>
                                            </div>
                                        </div>
                                    </a>

                                ))) : (
                                <p className="text-gray-500 text-center mt-10">No vendors available.</p>
                            )}
                        </div>
                        
                    </section>
                    {/*end of about section */}


                    {/* <BookingCalendar /> */}

                    <Footer />

                </>
            )}

        </>
    )
}

export default MyBooking