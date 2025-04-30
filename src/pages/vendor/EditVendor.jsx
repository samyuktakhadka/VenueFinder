import React, { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import { getToken, decodeToken, logout } from "../../utils/jwtUtils";
import axios from "axios";
import toast from "react-hot-toast";
const EditVendor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [contactInfo, setContactInfo] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [description, setDescription] = useState("");
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    const token = getToken();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchVendor();
    }, []);

    const validateForm = () => {
        if (
            name.trim() === "" ||
            serviceType.trim() === "" ||
            contactInfo.trim() === "" ||
            String(priceRange).trim() === "" || // Convert priceRange to string
            description.trim() === ""
        ) {
            toast.error("Please fill all fields!");
            return false;
        }
        return true;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const vendorData = {
            name,
            service_type: serviceType,
            contact_info: contactInfo,
            price_range: priceRange,
            description,
        };

        try {
            const response = await axios.put(`${apiKey}api/vendors/${id}`, vendorData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                navigate("/admin/vendors");
            }
        } catch (error) {
            console.log(error);
            setTimeout(() => {
                setLoading(false);
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

    const fetchVendor = async () => {
        setLoading(true);
        await axios
            .get(`${apiKey}api/vendors/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(function (response) {
                console.log(response.data);
                const vendor = response.data;
                setName(vendor.name);
                setServiceType(vendor.service_type);
                setContactInfo(vendor.contact_info);
                setPriceRange(vendor.price_range);
                setDescription(vendor.description);
                setLoading(false);
            })
            .catch(function (error) {
                var errorMessage = error.response.data.error;
                    if (errorMessage == "jwt expired") {
                        logout(navigate)
                    }
                    toast.error(errorMessage);
                setLoading(false);
            });
    }

    return (
        <Layout activePage="Vendor">
            <div className="">
                <div>
                    <h2 className="text-sm inline-block border-b-2 border-gray-400">
                        Edit Vendor
                    </h2>
                </div>
            </div>
            <div className="mt-5">
                <form action="">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div class="relative">
                            <input
                                type="text"
                                id="name"
                                class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                placeholder=" "
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label
                                for="name"
                                class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                            >
                                name
                            </label>
                        </div>
                        <div class="relative">
                            <input
                                type="text"
                                id="location"
                                class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                placeholder=" "
                                value={serviceType}
                                onChange={(e) => setServiceType(e.target.value)}
                            />
                            <label
                                for="location"
                                class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                            >
                                Service Type
                            </label>
                        </div>

                        <div class="relative">
                            <input
                                type="text"
                                id="location"
                                class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                placeholder=" "
                                value={contactInfo}
                                onChange={(e) => setContactInfo(e.target.value)}
                            />
                            <label
                                for="location"
                                class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                            >
                                Contact Info
                            </label>
                        </div>

                        <div class="relative">
                            <input
                                type="text"
                                id="price"
                                class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                placeholder=" "
                                value={priceRange}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*\.?\d*$/.test(value)) {
                                        setPriceRange(value);
                                    }
                                }}
                            />
                            <label
                                for="price"
                                class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                            >
                                Price
                            </label>
                        </div>
                        <div class="relative">
                            <textarea
                                type="text"
                                id="description"
                                class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                placeholder=" "
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                            <label
                                for="description"
                                class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                            >
                                Description
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-between mt-5">
                        <div>
                            <Link
                                to="/admin/vendors"
                                className="py-1.5 px-9 border border-blue-600 rounded-xl text-gray-900 hover:bg-blue-50 transition-all duration-500"
                            >
                                Back To List
                            </Link>
                        </div>
                        <div>
                            <button onClick={handleSubmit} className="bg-blue-600 text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all">
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default EditVendor;
