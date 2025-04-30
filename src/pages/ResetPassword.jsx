import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../common/Loader";
import bg from "../images/1.png";
import designerImage from "../images/Designer.png";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        toast.error("Invalid or missing reset token");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.post(`${apiKey}api/user/verify-reset-token`, { token });
        console.log("Token verification response:", response.data);
        
        if (response.data.valid) {
          setIsTokenValid(true);
        } else {
          toast.error(response.data.message || "Invalid or expired reset token");
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (error) {
        console.error("Token verification error:", error);
        toast.error(error.response?.data?.message || "Invalid or expired reset token");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, navigate, apiKey]);

  const togglePasswordVisible = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisible = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.trim() === "" || formData.confirmPassword.trim() === "") {
      toast.error("Please fill all fields!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiKey}api/user/reset-password`, {
        token,
        password: formData.password
      });

      if (response.status === 200) {
        toast.success("Password reset successfully! Please login with your new password.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      if (error.response) {
        const errorMessage = error.response.data.message || error.response.data.error;
        toast.error(errorMessage);
        if (error.response.status === 400) {
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Reset Link</h2>
          <p className="text-gray-600">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
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
                <h3 className="text-gray-800 text-3xl font-extrabold">Reset Password</h3>
                <p className="text-sm mt-4 text-gray-800">
                  Please enter your new password below.
                </p>
              </div>

              <div>
                <label className="text-gray-800 text-xs block mb-2">New Password</label>
                <div className="relative flex items-center">
                  <input 
                    name="password" 
                    type={isPasswordVisible ? 'text' : 'password'} 
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none" 
                    placeholder="Enter new password" 
                    required
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
              </div>

              <div className="mt-8">
                <label className="text-gray-800 text-xs block mb-2">Confirm New Password</label>
                <div className="relative flex items-center">
                  <input 
                    name="confirmPassword" 
                    type={isConfirmPasswordVisible ? 'text' : 'password'} 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full text-gray-800 text-sm border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none" 
                    placeholder="Confirm new password" 
                    required
                  />
                  <button 
                    type="button"
                    onClick={toggleConfirmPasswordVisible}
                    className="absolute right-2 cursor-pointer"
                  >
                    {isConfirmPasswordVisible ? (
                      <IoEyeOffOutline className="text-[#bbb] text-xl" />
                    ) : (
                      <IoEyeOutline className="text-[#bbb] text-xl" />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-12">
                <button 
                  type="submit" 
                  className="w-full shadow-xl py-2.5 px-4 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>

          <div className="md:h-full rounded-xl md:block hidden">
            <img src={designerImage} className="w-full h-full object-cover object-center rounded-xl" alt="reset-password-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 