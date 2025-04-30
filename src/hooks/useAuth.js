import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { login as loginService, logout as logoutService } from '../services/authService';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { setAccessToken, setPermissions } = useUser(); // Context state setters
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state

  // Login function
  const login = async (credentials) => {
    setLoading(true); // Start loading when login begins
    try {
      const data = await loginService(credentials); // Use service to handle API call
      const { token, permissions } = data.responseData;

      setAccessToken(token);
      setPermissions(permissions || []);
      toast.success(data.statusMessage);
      setTimeout(() => {
        setLoading(false); // Stop loading after success
        navigate('/dashboard'); // Redirect after successful login
      }, 1000);
    } catch (error) {
      setLoading(false); // Stop loading if there's an error
      console.error(error);
      if (error.response) {
        const errorMessage = error.response.data.statusMessage || 'An error occurred';
        toast.error(errorMessage);
      } else {
        toast.error(`Error: ${error.message}`);
      }
    }
  };

  // Logout function
  const logout = () => {
    logoutService(); // Use service to handle logout
    setAccessToken(null);
    setPermissions([]);
    navigate('/login');
  };

  return {
    login,
    logout,
    loading, // Return loading state so it can be used in the Login component
  };
};
