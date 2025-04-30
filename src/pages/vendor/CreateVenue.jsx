import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "../../common/Loader";
import VendorLayout from "../../components/VendorLayout";
import { getToken } from "../../utils/jwtUtils";

const CreateVenue = () => {
  const navigate = useNavigate();
  const token = getToken();
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    capacity: "",
    amenities: "",
    description: "",
    email: "",
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate number of files
    if (files.length + images.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }

    // Validate file size and type
    const invalidFiles = files.filter((file) => {
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      const isValidType = ["image/jpeg", "image/png"].includes(file.type);
      return !isValidSize || !isValidType;
    });

    if (invalidFiles.length > 0) {
      toast.error(
        "Some files are invalid. Please ensure all files are JPEG/PNG and under 5MB"
      );
      return;
    }

    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviewUrls]);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      return newPreviews.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      "name",
      "location",
      "price",
      "capacity",
      "amenities",
      "description",
      "email",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append all images
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await axios.post(`${apiKey}api/venues/create`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message);
      navigate("/vendor/venues");
    } catch (error) {
      console.error(error);
      if (error.response) {
        const errorMessage =
          error.response.data.error || error.response.data.message;
        toast.error(errorMessage);
      } else {
        toast.error("An error occurred while creating the venue");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorLayout activePage="Venues">
      {loading ? (
        <Loader />
      ) : (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Create New Venue</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Venue Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Price per Booking *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Capacity *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Amenities (comma-separated) *
                </label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                  placeholder="WiFi, Parking, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                rows="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Venue Images *
              </label>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <FaCloudUploadAlt className="text-4xl mb-2 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Click to upload images (JPEG/PNG, max 5MB each, up to 10
                    images)
                  </span>
                </label>
              </div>

              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Venue
              </button>
            </div>
          </form>
        </div>
      )}
    </VendorLayout>
  );
};

export default CreateVenue;
