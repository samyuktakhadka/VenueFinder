import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../common/Loader";
import bg from "../images/1.png"
import designerImage from "../images/Designer.png"
import { handleRedirect, getToken, logout } from "../utils/jwtUtils";
import { IoEyeOutline, IoEyeOffOutline, IoClose } from "react-icons/io5";

const Login = () => {
  const navigate = useNavigate();
  const token = getToken();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];

  useEffect(() => {
    if (token) {
      handleRedirect(navigate);
    }
  }, []);

  const togglePasswordVisible = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      toast.error("Please fill all the textfields!");
      return;
    }

    const formData = {
      email,
      password,
    };
    setLoading(true);
    try {
      const response = await axios.post(`${apiKey}api/User/login`, formData);
      if (response.status === 200 && response.data.token) {
        // Store token and user data
        localStorage.setItem("token", response.data.token);
        toast.success(response.data.message);
        handleRedirect(navigate);
      } else {
        toast.error("Invalid response from server");
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || error.response.data.error;
        if (errorMessage === "jwt expired") {
          logout(navigate);
        } else {
          toast.error(errorMessage);
        }
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (resetEmail.trim() === "") {
      toast.error("Please enter your email address!");
      return;
    }

    setResetLoading(true);
    try {
      const response = await axios.post(`${apiKey}api/user/forgot-password`, {
        email: resetEmail
      });
      
      if (response.status === 200) {
        toast.success("Password reset instructions have been sent to your email.");
        setShowForgotPassword(false);
        setResetEmail("");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      if (error.response) {
        const errorMessage = error.response.data.message || error.response.data.error;
        toast.error(errorMessage);
      } else {
        toast.error("Failed to process password reset request. Please try again.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="font-[sans-serif]" style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            backgroundAttachment: 'fixed',
          }}>
            <div className="min-h-screen flex flex-col items-center justify-center backdrop-blur-sm px-5">
              <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-8 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md bg-white">
                <div className="md:max-w-md w-full px-4 py-4">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-12">
                      <h3 className="text-gray-800 text-3xl font-extrabold">Sign in</h3>
                      <p className="text-sm mt-4 text-gray-800">
                        Don't have an account <Link to="/register" className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">Register here</Link>
                      </p>
                    </div>

                    <div>
                      <label className="text-gray-800 text-xs block mb-2">Email</label>
                      <div className="relative flex items-center">
                        <input 
                          name="email" 
                          type="text" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)} 
                          className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none" 
                          placeholder="Enter email" 
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-2" viewBox="0 0 682.667 682.667">
                          <defs>
                            <clipPath id="a" clipPathUnits="userSpaceOnUse">
                              <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                            </clipPath>
                          </defs>
                          <g clipPath="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                            <path fill="none" strokeMiterlimit="10" strokeWidth="40" d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z" data-original="#000000"></path>
                            <path d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z" data-original="#000000"></path>
                          </g>
                        </svg>
                      </div>
                    </div>

                    <div className="mt-8">
                      <label className="text-gray-800 text-xs block mb-2">Password</label>
                      <div className="relative flex items-center">
                        <input 
                          name="password" 
                          type={isPasswordVisible ? 'text' : 'password'} 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)} 
                          className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none" 
                          placeholder="Enter password" 
                        />
                        <button 
                          type="button"
                          onClick={togglePasswordVisible}
                          className="absolute right-2 cursor-pointer"
                        >
                          {isPasswordVisible ? (
                            <IoEyeOffOutline className="text-[#bbb] text-xl" />
                          ) : (
                            <IoEyeOutline className="text-[#bbb] text-xl" />
                          )}
                        </button>
                      </div>
                      <div className="text-right mt-2">
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    </div>

                    <div className="mt-12">
                      <button 
                        type="submit" 
                        className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                </div>

                <div className="md:h-full rounded-xl md:block hidden">
                  <img src={designerImage} className="w-full h-full object-cover object-center rounded-xl" alt="login-image" />
                </div>
              </div>
            </div>
          </div>

          {/* Forgot Password Modal */}
          {showForgotPassword && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Reset Password</h3>
                  <button
                    onClick={() => setShowForgotPassword(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <IoClose className="text-2xl" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
                <form onSubmit={handleForgotPassword}>
                  <div className="mb-4">
                    <label className="text-gray-800 text-xs block mb-2">Email</label>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                  >
                    {resetLoading ? "Sending..." : "Send Reset Instructions"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Login;
