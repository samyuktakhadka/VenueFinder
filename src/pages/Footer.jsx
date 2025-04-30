import React from 'react'
import logo from "../images/logo2.png";
import TwakToWidget from "../pages/TwakToWidget"
import { Link } from 'react-router-dom';

const Footer = () => (
    <>
        {/* footer section */}
        <div className="relative mt-16 bg-[#227ec0]">
            <svg
                className="absolute top-0 w-full h-6 -mt-5 sm:-mt-10 sm:h-16 text-deep-purple-accent-400"
                preserveAspectRatio="none"
                viewBox="0 0 1440 54"
            >
                <path
                    fill="#227ec0"
                    d="M0 22L120 16.7C240 11 480 1.00001 720 0.700012C960 1.00001 1200 11 1320 16.7L1440 22V54H1320C1200 54 960 54 720 54C480 54 240 54 120 54H0V22Z" />
            </svg>
            <div className="px-4 pt-12 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 text-white">
                <div className="flex flex-wrap gap-16 row-gap-10 mb-8">
                    <div className="md:w-1/3">
                        <a
                            href="/"
                            aria-label="Go home"
                            title="Company"
                            className="flex items-center"
                        >
                            <div className='h-10 w-10'>
                                <img src={logo} className='h-full w-full object-cover object-center' alt="" />
                            </div>
                            <span className="ml-2 mt-auto text-lg font-bold tracking-wide text-gray-100 uppercase">
                                Venue Management Software
                            </span>
                        </a>
                        <div className="mt-4 text-sm">
                            <p className="text-sm text-deep-purple-50 text-justify ">
                                Our Venue Management Services are designed to make your event planning seamless and stress-free.
                            </p>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-white font-semibold mb-2">Contact Us</h3>
                            <p className="text-sm text-deep-purple-50">
                                Email: info@venuemanagement.com<br />
                                Phone: 01-5200543<br />
                                Address: Kathmandu, Nepal
                            </p>
                        </div>
                    </div>
                    <div className="flex-grow flex items-center">
                        <div className='text-center flex justify-center flex-col w-full'>
                            <p className="font-semibold tracking-wide text-teal-accent-400">
                                Quick Links
                            </p>
                            <ul className="mt-5 flex gap-5 justify-center">
                                <li>
                                    <Link
                                        to="/"
                                        className="transition-colors duration-300 text-deep-purple-50 hover:text-teal-accent-400"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/venues"
                                        className="transition-colors duration-300 text-deep-purple-50 hover:text-teal-accent-400"
                                    >
                                        Venues
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/services"
                                        className="transition-colors duration-300 text-deep-purple-50 hover:text-teal-accent-400"
                                    >
                                        Services
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about"
                                        className="transition-colors duration-300 text-deep-purple-50 hover:text-teal-accent-400"
                                    >
                                        About Us
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Copyright section */}
                <div className="border-t border-deep-purple-accent-200 pt-5 pb-10">
                    <p className="text-sm text-center text-deep-purple-50">
                        © {new Date().getFullYear()} Venue Management Software. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
        {/*end of footer section */}
        <TwakToWidget />
    </>
)

export default Footer