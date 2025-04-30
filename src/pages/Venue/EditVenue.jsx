import React, { useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import { getToken, decodeToken } from "../../utils/jwtUtils";
import axios from "axios";
import toast from "react-hot-toast";
import { MdAddAPhoto } from "react-icons/md";

const EditVenue = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [capacity, setCapacity] = useState("");
    const [amenities, setAmenities] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [email, setEmail] = useState("");
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    const token = getToken();
    const decodedToken = decodeToken(token);
    const [createdBy, setCreatedBy] = useState(decodedToken.id);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchVenue();
    }, []);

    const fileInputRef = useRef(null); // Reference to hidden file input
    const [isDragging, setIsDragging] = useState(false);
    // Handle drag events
    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault(); // Prevent default behavior
        const files = event.dataTransfer.files; // Access the files
        setIsDragging(false);
        if (files.length > 0) {
            const file = files[0]; // Get the first file

            // Validate that the file is an image
            const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
            if (validImageTypes.includes(file.type)) {
                setFile(file);
                const reader = new FileReader();

                // Read the selected file and set it to state
                reader.onloadend = () => {
                    setImage(reader.result); // Set the image data URL
                };

                reader.readAsDataURL(file);
            } else {
                toast.error('Invalid file type. Please upload a PNG or JPEG image.');
            }
        }
    };

    const handleClick = (event) => {
        fileInputRef.current.click();
    }

    // Handle file selection
    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validImageTypes = ["image/png", "image/jpeg", "image/jpg"];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        const validFiles = selectedFiles.filter(file => {
            if (!validImageTypes.includes(file.type)) {
                toast.error(`${file.name} is not a valid image type`);
                return false;
            }
            if (file.size > maxSize) {
                toast.error(`${file.name} is too large. Maximum size is 5MB`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) {
            return;
        }

        setFiles(prevFiles => [...prevFiles, ...validFiles]);

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prevImages => [...prevImages, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index, isExisting = false) => {
        if (isExisting) {
            setExistingImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setImages(prev => prev.filter((_, i) => i !== index));
            setFiles(prev => prev.filter((_, i) => i !== index));
        }
    };

    const validateForm = () => {
        console.log(capacity)
        if (
            name.trim() === "" ||
            location.trim() === "" ||
            String(price).trim() === "" || // Convert price to string
            String(capacity).trim() === "" || // Convert capacity to string
            amenities.trim() === "" ||
            description.trim() === ""

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
        formData.append("name", name.trim());
        formData.append("location", location.trim());
        formData.append("price", Number(price));
        formData.append("capacity", Number(capacity));
        formData.append("amenities", amenities.trim());
        formData.append("description", description.trim());
        formData.append("email", email.trim());
        formData.append("created_by", createdBy);

        // Append existing images that weren't removed
        formData.append("existing_images", JSON.stringify(existingImages));

        // Append new images
        if (files.length > 0) {
            files.forEach((file, index) => {
                formData.append(index === 0 ? "image" : `additional_images`, file);
            });
        }

        try {
            const response = await axios.put(`${apiKey}api/publicVenues/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                navigate("/admin/venues");
            }
        } catch (error) {
            console.log(error);
            if (error.response?.data?.error === "jwt expired") {
                logout(navigate);
                toast.error("Session expired! Please login again.");
            } else {
                toast.error(error.response?.data?.error || "Failed to update venue");
            }
        }
    };


    const fetchVenue = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiKey}api/venues/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            const data = response.data;
            setName(data.name);
            setLocation(data.location);
            setPrice(data.price);
            setDescription(data.description);
            setCapacity(data.capacity);
            setAmenities(data.amenities);
            setEmail(data.email);
            
            // Handle multiple images
            if (data.imageUrl) {
                setExistingImages([apiKey + data.imageUrl]);
            }
            if (data.additionalImages) {
                setExistingImages(prev => [...prev, ...data.additionalImages.map(img => apiKey + img)]);
            }
            
            setLoading(false);
        } catch (error) {
            console.log(error);
            if (error.response?.data?.error === "jwt expired") {
                logout(navigate);
            }
            toast.error(error.response?.data?.error || "Failed to fetch venue");
            setLoading(false);
        }
    }

    return (
        <Layout activePage="Venue">
            <div className="">
                <div>
                    <h2 className="text-sm inline-block border-b-2 border-gray-400">
                        Edit Venue
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
                                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer h-[42px]"
                                placeholder=" "
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer h-[42px]"
                                placeholder=" "
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
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
                                type="text"
                                id="price"
                                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer h-[42px]"
                                placeholder=" "
                                value={price}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*\.?\d*$/.test(value)) {
                                        setPrice(value);
                                    }
                                }}
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
                                type="text"
                                id="capacity"
                                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer h-[42px]"
                                placeholder=" "
                                value={capacity}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*$/.test(value)) {
                                        setCapacity(value === "" ? "" : parseInt(value));
                                    }
                                }}
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
                                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer h-[42px]"
                                placeholder=" "
                                value={amenities}
                                onChange={(e) => setAmenities(e.target.value)}
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
                                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer h-[42px]"
                                placeholder=" "
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label
                                htmlFor="email"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                            >
                                Contact Email
                            </label>
                        </div>
                        <div className="relative">
                            <textarea
                                id="description"
                                className="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-light peer h-[42px] resize-none"
                                placeholder=" "
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="1"
                            ></textarea>
                            <label
                                htmlFor="description"
                                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-primary-light peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                            >
                                Description
                            </label>
                        </div>
                    </div>
                    <div className="mt-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {/* Existing Images */}
                            {existingImages.map((image, index) => (
                                <div key={`existing-${index}`} className="relative">
                                    <img 
                                        src={image} 
                                        className="w-full h-48 object-cover rounded-lg" 
                                        alt={`Venue ${index + 1}`} 
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index, true)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <FaXmark className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {/* New Images */}
                            {images.map((image, index) => (
                                <div key={`new-${index}`} className="relative">
                                    <img 
                                        src={image} 
                                        className="w-full h-48 object-cover rounded-lg" 
                                        alt={`New upload ${index + 1}`} 
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <FaXmark className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                            
                            {/* Upload Button */}
                            <div
                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-primary-light transition-colors"
                                onClick={() => document.getElementById('image-upload').click()}
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <MdAddAPhoto className="w-8 h-8 mb-4 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span>
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, JPEG</p>
                                </div>
                                <input
                                    type="file"
                                    id="image-upload"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    accept=".png, .jpg, .jpeg"
                                    multiple
                                />
                            </div>
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
                            <button type="submit" className="bg-blue-600 text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all">
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default EditVenue;
