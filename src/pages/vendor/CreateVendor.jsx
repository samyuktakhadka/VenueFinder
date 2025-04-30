import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { getToken, logout } from "../../utils/jwtUtils";
const CreateVendor = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  // const [priceRange, setPriceRange] = useState("");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const token = getToken();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateForm = () => {
    if (
      name.trim() === "" ||
      email.trim() === "" ||
      contactInfo.trim() === "" ||
      description.trim() === ""
    ) {
      toast.error("Please fill all fields!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      return;
    }

    const vendorData = {
      name,
      email,
      contact_info: contactInfo,
      description,
    };

    try {
      const response = await axios.post(
        `${apiKey}api/vendors/create`,
        vendorData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success(response.data.message);
        setLoading(false);
        navigate("/admin/vendors");
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setLoading(false);
        if (error.response) {
          const errorMessage =
            error.response.data.message || error.response.data.error;

          if (errorMessage === "jwt expired") {
            logout(navigate);
            return;
          }

          // Handle 400 error for email conflict
          if (error.response.status === 400) {
            toast.error(errorMessage);
            return;
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

  return (
    <Layout activePage="Vendor">
      <div className="">
        <div>
          <h2 className="text-sm inline-block border-b-2 border-gray-400">
            Create Vendor
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
                id="contactInfo"
                class="block px-2.5 pb-2 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-primary-light peer"
                placeholder=" "
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              />
              <label
                for="name"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label
                for="email"
                class="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white  px-2 peer-focus:px-2 peer-focus:text-primary-light  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
              >
                Email
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
              <div>
                {loading ? (
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-300 text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-300 duration-500 transition-all flex items-center"
                    disabled
                  >
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateVendor;
