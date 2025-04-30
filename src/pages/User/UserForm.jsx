import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import dummyImg from "../../images/dummy-image.jpg"
import Select from "react-tailwindcss-select";
const roles = [
    { value: "1", label: "Admin" },
    { value: "2", label: "User" },
    { value: "3", label: "Receptionist" }
];

const MODULES = [
    {
        moduleName: "Standard",
        permissions: ["Admin Access", "Dashboard Access"],
    },
    {
        moduleName: "Room",
        permissions: ["Read", "Write"],
    },
    {
        moduleName: "User",
        permissions: ["Read", "Write"],
    },
    {
        moduleName: "Booking",
        permissions: ["Read", "Write"],
    },
    {
        moduleName: "Role",
        permissions: ["Read", "Write"],
    },
    {
        moduleName: "Check Availability",
        permissions: ["Read"],
    },
    {
        moduleName: "Front Desk",
        permissions: ["Read"],
    },
];
const UserForm = () => {
    const [date, setDate] = useState();
    const [imageSrc, setImageSrc] = useState(null);
    const [file, setFile] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleRoleChange = value => {
        console.log("value:", value);
        setSelectedRoles(value);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
        <Layout activePage="User">
            <div className="">
                <div>
                    <h2 className="text-sm inline-block border-b-2 border-gray-400">
                        Create User
                    </h2>
                </div>
            </div>
            <div className="mt-5">
                <div>
                    <h2>User Details</h2>
                </div>
                <div className=" flex lg:flex-row flex-col gap-5 mt-5 ml-5">
                    <div>
                        <div className='w-[80px] h-[80px] relative '>
                            <img
                                src={imageSrc ? imageSrc : dummyImg}
                                alt="Profile"
                                className='w-full h-full object-cover object-center rounded-full'
                            />
                            <div className='absolute -bottom-1 -right-1 '>
                                <FaEdit className='cursor-pointer text-sm' onClick={triggerFileInput} />
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow">
                        <form action="">
                            <input type="file" className='hidden' id="fileInput" accept="image/*" onChange={handleImageChange} />
                            <div className="grid lg:grid-cols-2 gap-5">
                                <div class="relative">
                                    <input
                                        type="text"
                                        id="firstName"
                                        class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                        placeholder=" "
                                    />
                                    <label
                                        for="firstName"
                                        class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                    >
                                        First Name
                                    </label>
                                </div>
                                <div class="relative">
                                    <input
                                        type="text"
                                        id="middleName"
                                        class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                        placeholder=" "
                                    />
                                    <label
                                        for="middleName"
                                        class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                    >
                                        Middle Name
                                    </label>
                                </div>
                                <div class="relative">
                                    <input
                                        type="text"
                                        id="lastName"
                                        class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                        placeholder=" "
                                    />
                                    <label
                                        for="lastName"
                                        class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                    >
                                        Last Name
                                    </label>
                                </div>
                                <div class="relative">
                                    <input
                                        type="text"
                                        id="contact"
                                        class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                        placeholder=" "
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
                                    />
                                    <label
                                        for="address"
                                        class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                    >
                                        Address
                                    </label>
                                </div>
                                <div class="relative">
                                    <input
                                        type="date"
                                        id="address"
                                        class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                        placeholder=" "
                                    />
                                    <label
                                        for="address"
                                        class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                    >
                                        Date Of Birth
                                    </label>
                                </div>
                                <div class="relative">
                                    <select
                                        type="text"
                                        id="sex"
                                        class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                        placeholder=" "
                                    >
                                        <option disabled selected>Select</option>
                                        <option value="" >Male</option>
                                        <option value="" >Female</option>
                                    </select>
                                    <label
                                        for="sex"
                                        class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                    >
                                        Sex
                                    </label>
                                </div>
                                <div className="relative">
                                    <Select
                                        value={selectedRoles}
                                        classNames="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                        isMultiple={true}
                                        onChange={handleRoleChange}
                                        options={roles}
                                        formatGroupLabel={data => (
                                            <div className={`py-2 text-xs flex items-center justify-between`}>
                                                <span className="font-bold">{data.label}</span>
                                                <span className="bg-gray-200 h-5 p-1.5 flex items-center justify-center rounded-full">
                                                    {data.options.length}
                                                </span>
                                            </div>
                                        )}
                                    />
                                    <label
                                        for="address"
                                        class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                                    >
                                        Role
                                    </label>
                                </div>
                                <div className="text-sm flex gap-2 items-center">
                                    <input
                                        type="checkbox"
                                        id="isactivecheckbox"

                                    />
                                    <label
                                        for="isactivecheckbox"
                                    >
                                        Active?
                                    </label>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mt-5">
                <div>
                    <Link
                        to="/user-management"
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
        </Layout>
    );
};

export default UserForm;
