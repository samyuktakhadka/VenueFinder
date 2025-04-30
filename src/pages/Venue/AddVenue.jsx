import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../common/Loader';
import Footer from '../Footer';
import Nav from '../Nav';
import { MdLocationPin, MdAddAPhoto } from "react-icons/md";
import { getToken } from "../../utils/jwtUtils";

const AddVenue = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        price: '',
        capacity: '',
        amenities: '',
        email: '',
        imageUrl: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    const token = getToken();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                imageUrl: file
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();

            Object.keys(formData).forEach(key => {
                if (key === 'imageUrl' && formData[key]) {
                    formDataToSend.append('images', formData[key]); // match with backend expectation
                } else {
                    formDataToSend.append(key, formData[key].trim());
                }
            });

            // Debug log (can be removed later)
            console.log("Submitting venue data:");
            for (let [key, value] of formDataToSend.entries()) {
                console.log(`${key}:`, value);
            }

            await axios.post(`${apiKey}api/venues/create`, formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            navigate('/venues');
        } catch (error) {
            console.error('Error adding venue:', error);
            if (error.response) {
                alert(error.response.data.error || 'Something went wrong');
            } else {
                alert('Network error or unexpected issue');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && (
                <>
                    <div onClick={toggleSidebar} className={`fixed left-0 top-0 w-full h-full z-[998] bg-gray-600 bg-opacity-50 transition-all duration-300 ease-linear ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}></div>
                    <Nav toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

                    <section className='md:px-20 px-10 py-10 mt-20 min-h-[60vh]'>
                        <h2 className='text-center text-3xl md:text-4xl font-bold text-[#236a9d] underline mb-12'>Add New Venue</h2>

                        <form onSubmit={handleSubmit} className='max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md overflow-y-auto max-h-[80vh]'>
                            <div className='mb-6'>
                                <label className='block text-gray-700 text-sm font-bold mb-2'>Venue Name</label>
                                <input
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#236a9d]'
                                    required
                                />
                            </div>

                            <div className='mb-6'>
                                <label className='block text-gray-700 text-sm font-bold mb-2'>Description</label>
                                <textarea
                                    name='description'
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#236a9d] h-32'
                                    required
                                />
                            </div>

                            <div className='mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200'>
                                <label className='block text-gray-700 text-sm font-bold mb-2'>Venue Contact Email</label>
                                <input
                                    type='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#236a9d]'
                                    required
                                />
                                <p className='text-sm text-gray-500 mt-1'>This email will be visible to those wanting to contact the venue</p>
                            </div>

                            <div className='grid grid-cols-2 gap-6 mb-6'>
                                <div>
                                    <label className='block text-gray-700 text-sm font-bold mb-2'>Price ($)</label>
                                    <input
                                        type='number'
                                        name='price'
                                        min="0"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#236a9d]'
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='block text-gray-700 text-sm font-bold mb-2'>Capacity</label>
                                    <input
                                        type='number'
                                        name='capacity'
                                        min="1"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#236a9d]'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='mb-6'>
                                <label className='block text-gray-700 text-sm font-bold mb-2'>Amenities (comma-separated)</label>
                                <input
                                    type='text'
                                    name='amenities'
                                    value={formData.amenities}
                                    onChange={handleInputChange}
                                    className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#236a9d]'
                                    required
                                />
                            </div>

                            <div className='mb-6'>
                                <label className='block text-gray-700 text-sm font-bold mb-2'>Location</label>
                                <div className='relative'>
                                    <MdLocationPin className='absolute left-3 top-2.5 text-xl text-gray-500' />
                                    <input
                                        type='text'
                                        name='location'
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className='w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#236a9d]'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='mb-6'>
                                <label className='block text-gray-700 text-sm font-bold mb-2'>Venue Image</label>
                                <div className='relative'>
                                    <input
                                        type='file'
                                        name='imageUrl'
                                        onChange={handleImageChange}
                                        accept='image/*'
                                        className='hidden'
                                        id='image-upload'
                                        required
                                    />
                                    <label
                                        htmlFor='image-upload'
                                        className='flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#236a9d] transition-colors'
                                    >
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt='Preview'
                                                className='max-h-full max-w-full object-contain'
                                            />
                                        ) : (
                                            <div className='text-center'>
                                                <MdAddAPhoto className='mx-auto text-3xl text-gray-400 mb-2' />
                                                <span className='text-sm text-gray-500'>Click to upload image</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className='flex justify-center'>
                                <button
                                    type='submit'
                                    className='px-6 py-2 bg-[#236a9d] text-white rounded-lg hover:bg-[#1a4f7a] transition-colors'
                                >
                                    Add Venue
                                </button>
                            </div>
                        </form>
                    </section>

                    <Footer />
                </>
            )}
        </>
    );
};

export default AddVenue;
