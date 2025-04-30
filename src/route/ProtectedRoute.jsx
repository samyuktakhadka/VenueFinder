import React from 'react';
import { Route, Navigate, useLocation } from 'react-router-dom';
import { decodeToken, getToken } from '../utils/jwtUtils';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ element, role, ...rest }) => {
  const token = getToken();
  const decodedToken = decodeToken(token);
  const location = useLocation();

  if (!token || !decodedToken) {
    toast.error("Please login to continue");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && role !== decodedToken.Role) {
    toast.error("You don't have permission to access this page");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

export default ProtectedRoute;
