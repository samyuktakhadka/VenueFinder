import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Link, useNavigate } from "react-router-dom";
import { MdLocationPin, MdAddAPhoto } from "react-icons/md";
import { getToken, decodeToken, logout } from "../../utils/jwtUtils";
import axios from "axios";
import toast from "react-hot-toast";

const CreateVenue = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        location: "",
        price: "",
        capacity: "",
        amenities: "",
        imageUrl: "",
        email: ""
    });
    const [imagePreview, setImagePreview] = useState(null);
    const apiKey = import.meta.env.VITE_APP_BASE_URL;
    const token = getToken();
    const decodedToken = decodeToken(token);
    const [createdBy] = useState(decodedToken.id);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, imageUrl: file });
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === "imageUrl" && formData[key]) {
                formDataToSend.append("image", formData[key]);
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });
        formDataToSend.append("created_by", createdBy);

        try {
            const res = await axios.post(`${apiKey}api/venues/create`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            if (res.status === 201) {
                toast.success(res.data.message);
                navigate("/admin/venues");
            }
        } catch (error) {
            console.log(error);
            if (error.response?.data?.error === "jwt expired") {
                logout(navigate);
                toast.error("Session expired! Please login again.");
            } else {
                toast.error(error.response?.data?.error || error.message || "An error occurred.");
            }
        }
    };

    return (
        <Layout activePage="Venue">
            <div className="">
                <div>
                    <h2 className="text-sm inline-block border-b-2 border-gray-400">
                        Create Venue
                    </h2>
                </div>
            </div>
            <div className="mt-5">
                <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="relative">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                placeholder=" "
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <label
                                htmlFor="name"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                            >
                                Name
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                id="location"
                                name="location"
                                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                placeholder=" "
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                            />
                            <label
                                htmlFor="location"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                            >
                                Location
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                id="price"
                                name="price"
                                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                placeholder=" "
                                value={formData.price}
                                onChange={handleInputChange}
                                required
                            />
                            <label
                                htmlFor="price"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                            >
                                Price
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                id="capacity"
                                name="capacity"
                                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                placeholder=" "
                                value={formData.capacity}
                                onChange={handleInputChange}
                                required
                            />
                            <label
                                htmlFor="capacity"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                            >
                                Capacity
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                id="amenities"
                                name="amenities"
                                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                placeholder=" "
                                value={formData.amenities}
                                onChange={handleInputChange}
                                required
                            />
                            <label
                                htmlFor="amenities"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                            >
                                Amenities
                            </label>
                        </div>
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer"
                                placeholder=" "
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <label
                                htmlFor="email"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                            >
                                Contact Email
                            </label>
                        </div>
                    </div>
                    <div className="relative mt-5">
                        <textarea
                            id="description"
                            name="description"
                            className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer h-20 resize-none"
                            placeholder=" "
                            value={formData.description}
                            onChange={handleInputChange}
                            required
                        />
                        <label
                            htmlFor="description"
                            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                        >
                            Description
                        </label>
                    </div>
                    <div className="mt-5">
                        <div className="relative">
                            <input
                                type="file"
                                name="imageUrl"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                                id="image-upload"
                                required
                            />
                            <label
                                htmlFor="image-upload"
                                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-light transition-colors"
                            >
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <div className="text-center">
                                        <MdAddAPhoto className="mx-auto text-3xl text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Click to upload image</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-between mt-5">
                        <div>
                            <Link
                                to="/admin/venues"
                                className="py-1.5 px-9 border border-blue-600 rounded-xl text-gray-900 hover:bg-blue-50 transition-all duration-500"
                            >
                                Back To List
                            </Link>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default CreateVenue;
