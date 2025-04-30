import React, { useState } from 'react'
import logo from "../images/logo2.png";
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import { decodeToken, getToken, logout } from '../utils/jwtUtils';
import toast from 'react-hot-toast';
import dummy from "../images/dummy-image.jpg";
const Nav = ({ toggleSidebar, isSidebarOpen }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const token = getToken();
    console.log(token)
    const user = decodeToken(token);
    const handleLogout = () => {
        logout(navigate)
        toast.success("logged Out Successfully!");
    }
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };
    return (
        <>

            {/* navbar */}
            <div className={`flex justify-between items-center fixed top-0 z-50 left-0 right-0 md:px-20 px-10 py-4 bg-[#227ec0] `}>
                <div className='w-10 h-10'>
                    <img src={logo} className='w-full h-full object-center object-cover' alt="" />
                </div>
                <div className='md:block hidden'>
                    <ul className='flex items-center gap-10 text-white text-lg font-semibold font-sans'>
                        <li> <Link to="/">Home</Link> </li>
                        <li><Link to="/about">About Us</Link> </li>
                        <li><Link to="/venues">Venues</Link> </li>
                        <li><Link to="/services">Services</Link> </li>
                    </ul>
                </div>
                <div className='flex gap-2 items-center relative'>
                    {token ? (
                        <>

                            <p className="text-white">Welcome !</p>
                            <div className="w-[40px] h-[40px]">
                                <img
                                    src={dummy}
                                    className="w-full  rounded-full h-full overflow-hidden object-cover object-center cursor-pointer"
                                    alt=""
                                    onClick={toggleModal}
                                />
                            </div>
                            {/* modal */}
                            <div
                                className={`absolute flex flex-col gap-0.5  top-[110%] right-0 bg-white text-sm text-gray-700 m-w-28 py-2 z-50 border border-gray-300 rounded-md transition-all duration-300 ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
                                    } `}
                            >
                                <Link to="/profile" className="hover:bg-blue-100 hover:text-blue-600 px-3 py-1  cursor-pointer">
                                    My Profile
                                </Link>
                                <Link to="/mybookings" className="hover:bg-blue-100 hover:text-blue-600 px-3 py-1  cursor-pointer">
                                    My Bookings
                                </Link>
                                <h2 onClick={handleLogout} className="px-3 py-1 hover:bg-blue-100 hover:text-blue-600  cursor-pointer">
                                    Logout
                                </h2>
                            </div>
                            {/*end of modal */}
                        </>

                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-white text-black rounded-xl hover:bg-gray-200 duration-300 transition-all ease-linear"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 bg-[#28a5ff] text-white rounded-xl hover:bg-[#3fa5ed] duration-300 transition-all ease-linear"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
                <div onClick={toggleSidebar} className="lg:hidden block ">
                    <FaBars className='text-2xl cursor-pointer text-white' />
                </div>
            </div>

            {/* mobile nav */}
            <div className={`fixed  top-0  w-[70%] h-screen z-[999] bg-[#227ec0] px-10 py-4 pt-32 transition-all duration-500 ease-linear ${isSidebarOpen ? "left-0" : "-left-full"}`}>
                <div className='block'>
                    <ul className='flex flex-col  gap-2 text-white text-lg font-semibold font-sans'>
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Contact</li>
                    </ul>
                </div>
                <div>
                    {token ? (
                        <p className="text-white">Welcome ! {user.name}</p>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-white text-black rounded-xl hover:bg-gray-200 duration-300 transition-all ease-linear"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 bg-[#28a5ff] text-white rounded-xl hover:bg-[#3fa5ed] duration-300 transition-all ease-linear"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
            {/*end of mobile nav */}
            {/*end of navbar */}
        </>
    )
}

export default Nav