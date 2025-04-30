import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import { handleRedirect, getToken } from "../utils/jwtUtils";
import bg from "../images/1.png"
import designerImage from "../images/Designer.png"
import { CiUser } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { FaAddressBook } from "react-icons/fa";
const Register = () => {
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (token) {
      handleRedirect(navigate);
    }
  }, []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisible = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }
  const validateForm = () => {
    if (
        name.trim() === "" ||
        email.trim() === "" ||
        password.trim() === "" ||
        contact.trim() === "" ||
        address.trim() === ""
    ) {
        toast.error("Please fill all fields!");
        return false;
    }

    // Validate phone number format (10 digits, Nepali number)
    const phoneRegex = /^9[6-8][0-9]{8}$/;
    if (!phoneRegex.test(contact.trim())) {
        toast.error("Enter a valid phone number");
        return false;
    }

    // Validate email format and common spelling errors
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|hotmail|outlook)\.(com|net|org)$/i;
    if (!emailRegex.test(email.trim())) {
        toast.error("Enter a valid Email address");
        return false;
    }

    return true;
};


const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const userData = {
        name,
        email,
        password,
        address,
        contact,
    };

    try {
        const response = await axios.post(`${apiKey}api/user/register`, userData, {
        });

        if (response.status === 201) {
            toast.success(response.data.message);
            navigate("/login");
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

  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <>
          <div class="font-[sans-serif]" style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            backgroundAttachment: 'fixed',
          }}>
            <div class="min-h-screen flex flex-col items-center justify-center backdrop-blur-sm">
              <div class="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md bg-white">
                <div class="md:max-w-md w-full px-4 py-4">
                  <form onSubmit={(e) => { e.preventDefault() }}>
                    <div class="mb-12">
                      <h3 class="text-gray-800 text-3xl font-extrabold">Register</h3>
                      <p class="text-sm mt-4 text-gray-800">Already got an account? <Link to="/login" class="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">Login here</Link></p>
                    </div>

                    <div class="">
                      <label class="text-gray-800 text-xs block mb-2">Name</label>
                      <div class="relative flex items-center">
                        <input name="name" type="text" class="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none" placeholder="Enter Name"
                        value={name}
                        onChange={(e)=>{setName(e.target.value)}}
                        />
                        <div className="absolute right-2">
                          <CiUser className="text-[#bbb] text-xl" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label class="text-gray-800 text-xs block mb-2">Phone Number</label>
                      <div class="relative flex items-center">
                        <input name="phone" type="text" class="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none" placeholder="Enter Phone Number" 
                        value={contact}
                        onChange={(e)=>{setContact(e.target.value)}}
                        />
                        <div className="absolute right-2">
                          <IoPhonePortraitOutline className="text-[#bbb] text-xl" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label class="text-gray-800 text-xs block mb-2">Email</label>
                      <div class="relative flex items-center">
                        <input name="email" type="text" class="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none" placeholder="Enter Email"
                        
                        value={email}
                        onChange={(e)=>{setEmail(e.target.value)}}
                        
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-2" viewBox="0 0 682.667 682.667">
                          <defs>
                            <clipPath id="a" clipPathUnits="userSpaceOnUse">
                              <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                            </clipPath>
                          </defs>
                          <g clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                            <path fill="none" stroke-miterlimit="10" stroke-width="40" d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z" data-original="#000000"></path>
                            <path d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z" data-original="#000000"></path>
                          </g>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label class="text-gray-800 text-xs block mb-2">Address</label>
                      <div class="relative flex items-center">
                        <input name="phone" type="text" class="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none" placeholder="Enter Address" 
                        value={address}
                        onChange={(e)=>{setAddress(e.target.value)}}
                        />
                        <div className="absolute right-2">
                          <FaAddressBook className="text-[#bbb] text-xl" />
                        </div>
                      </div>
                    </div>
                    <div class="mt-4">
                      <label class="text-gray-800 text-xs block mb-2">Password</label>
                      <div class="relative flex items-center">
                        <input name="password" type={`${isPasswordVisible ? 'text' : 'password'}`} class="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none" placeholder="Enter password"
                        value={password}
                        onChange={(e)=>{setPassword(e.target.value)}}
                        />
                        <a className="absolute right-2 cursor-pointer" onClick={togglePasswordVisible}>
                          {/* <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px]  cursor-pointer" viewBox="0 0 128 128">
                            <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                          </svg> */}
                          {isPasswordVisible ? <>
                            <IoEyeOffOutline className="text-[#bbb] text-xl" />
                          </> : <>
                            <IoEyeOutline className="text-[#bbb] text-xl" />
                          </>}
                        </a>
                      </div>
                    </div>

                    <div class="mt-12">
                      <button onClick={handleSubmit} type="submit" class="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                        Register
                      </button>
                    </div>
                  </form>
                </div>

                <div class="h-full rounded-xl">
                  <img src={designerImage} class="w-full h-full object-cover object-center rounded-xl" alt="login-image" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Register;
