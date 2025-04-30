import React, { useEffect, useState } from 'react'
import Loader from '../common/Loader';
import Footer from './Footer';
import Nav from './Nav';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BsFillSuitcaseLgFill } from "react-icons/bs";
import { getToken, logout } from '../utils/jwtUtils';
import { MdLocationPin } from "react-icons/md";
import dummyImg from "../images/dummy-image.jpg"
import { FaEdit } from "react-icons/fa";
import toast from 'react-hot-toast';
const MyProfile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate=useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [profiel, setprofiel] = useState([]);
    const [imageSrc, setImageSrc] = useState(null);
    const [file, setFile] = useState(null);
    const[isEditable,setIsEditable]=useState(false);
    const[name,setName]=useState("");
    const[contact,setContact]=useState("");
    const[email,setEmail]=useState("");
    const[address,setAddress]=useState("");
    const token = getToken();
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
    useEffect(() => {
        fetchProfile();
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
    const fetchProfile = async () => {
        setIsLoading(true);
        await axios
            .get(`${apiKey}api/user/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(function (response) {
                console.log(response)
                console.log(response.data);
                setName(response.data.name);
                setEmail(response.data.email);
                setAddress(response.data.address);
                setContact(response.data.contact);
                setImageSrc(response.data.imageUrl?apiKey+response.data.imageUrl:"");
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

    
    const validateForm = () => {
        if (
            name.trim() === "" ||
            email.trim() === "" ||
            contact.trim() === "" || // Convert price to string
            address.trim() === "" || // Convert capacity to string
            !file
        ) {
            toast.error("Please fill all fields and upload a file!");
            return false;
        }
        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("contact", contact);
        formData.append("address", address);
        formData.append("file", file);
        setIsLoading(true);
        try {
            const response = await axios.put(`${apiKey}api/user`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                setIsLoading(false);
                setIsEditable(false);
                navigate("/profile");
            }
        } catch (error) {
            console.log(error);
            setTimeout(() => {
                setIsLoading(false);
                setIsEditable(false);
                if (error.response) {
                    var errorMessage = error.response.data.error;
                    if (errorMessage == "jwt expired") {
                        logout(navigate)
                    }
                    toast.error(errorMessage);
                } else if (error.message) {
                    toast.error("Error: " + error.message);
                } else {
                    toast.error("An unexpected error occurred.");
                }
            }, 1000);
        }
    };


    const triggerFileInput = () => {
        document.getElementById('fileInput').click();
    };
    const handleImageChange = (e) => {
        const image = e.target.files[0];
        setFile(image);
        if (image) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target.result);
            };
            reader.readAsDataURL(image);
        }
    };
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
                        <h2 className='text-center text-3xl md:text-4xl font-bold text-[#236a9d] underline mb-12'>My Profile</h2>
                        <div className="mt-5">
                            <div className=" flex justify-center flex-col gap-5 mt-5 ml-5">
                                <div className='flex justify-center'>
                                    <div className='w-[80px] h-[80px] relative '>
                                        <img
                                            src={imageSrc ? imageSrc : dummyImg}
                                            alt="Profile"
                                            className='w-full h-full object-cover object-center rounded-full'
                                        />
                                        {isEditable &&(
                                            <div className='absolute -bottom-1 -right-1 '>
                                                <FaEdit className='cursor-pointer text-sm' onClick={triggerFileInput} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-grow flex justify-center">
                                    <form action="" className='w-1/2'>
                                        <input type="file" className='hidden' id="fileInput" accept="image/*" onChange={handleImageChange} />
                                        <div className="grid gap-5">
                                            <div class="relative">
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                                    placeholder=" "
                                                    readOnly={!isEditable}
                                                    value={name}
                                                    onChange={(e)=>{setName(e.target.value)}}
                                                />
                                                <label
                                                    for="firstName"
                                                    class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                >
                                                    Name
                                                </label>
                                            </div>

                                            <div class="relative">
                                                <input
                                                    type="text"
                                                    id="contact"
                                                    class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                                    placeholder=" "
                                                    readOnly={!isEditable}
                                                    value={contact}
                                                    onChange={(e)=>{setContact(e.target.value)}}
                                                />
                                                <label
                                                    for="contact"
                                                    class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                >
                                                    Contact Number
                                                </label>
                                            </div>
                                            <div class="relative">
                                                <input
                                                    type="text"
                                                    id="email"
                                                    class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                                    placeholder=" "
                                                    readOnly={!isEditable}
                                                    value={email}
                                                    onChange={(e)=>{setEmail(e.target.value)}}
                                                />
                                                <label
                                                    for="email"
                                                    class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                >
                                                    Email Address
                                                </label>
                                            </div>
                                            <div class="relative">
                                                <input
                                                    type="text"
                                                    id="address"
                                                    class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                                    placeholder=" "
                                                    readOnly={!isEditable}
                                                    value={address}
                                                    onChange={(e)=>{setAddress(e.target.value)}}
                                                />
                                                <label
                                                    for="address"
                                                    class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                                >
                                                    Address
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex justify-between mt-5">
                                            {isEditable && (
                                                <div>
                                                    <button onClick={handleSubmit} className="bg-blue-600 text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all">
                                                        Save
                                                    </button>
                                                </div>
                                            )}
                                            {!isEditable && (
                                                <div>
                                                    <button onClick={(e)=>{e.preventDefault();setIsEditable(true)}} className="bg-blue-600 text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all">
                                                        Edit
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </div>
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

export default MyProfile