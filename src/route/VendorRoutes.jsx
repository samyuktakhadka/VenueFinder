import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import BookingManagement from "../pages/Vendor/BookingManagement";
import CreateVenue from "../pages/Vendor/CreateVenue";
import EditVenue from "../pages/Vendor/EditVenue";
import PaymentManagement from "../pages/Vendor/PaymentManagement";
import VendorDashboard from "../pages/Vendor/VendorDashboard";
import VenueManagement from "../pages/Vendor/VenueManagement";
import ProtectedRoute from "./ProtectedRoute";

const VendorRoutes = () => {
  const token = localStorage.getItem("token") ?? "";

  return (
    <>
      <Routes>
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute
              element={<VendorDashboard />}
              token={token}
              Role="vendor"
            />
          }
        />
        <Route
          path="/vendor/venues"
          element={
            <ProtectedRoute
              element={<VenueManagement />}
              token={token}
              Role="vendor"
            />
          }
        />
        <Route
          path="/vendor/venues/create"
          element={
            <ProtectedRoute
              element={<CreateVenue />}
              token={token}
              Role="vendor"
            />
          }
        />
        <Route
          path="/vendor/venues/:id"
          element={
            <ProtectedRoute
              element={<EditVenue />}
              token={token}
              Role="vendor"
            />
          }
        />
        <Route
          path="/vendor/payments"
          element={
            <ProtectedRoute
              element={<PaymentManagement />}
              token={token}
              Role="vendor"
            />
          }
        />
        <Route
          path="/vendor/bookings"
          element={
            <ProtectedRoute
              element={<BookingManagement />}
              token={token}
              Role="vendor"
            />
          }
        />
        <Route
          path="/vendor"
          element={
            <ProtectedRoute
              element={<Navigate to="/vendor/dashboard" />}
              token={token}
              Role="vendor"
            />
          }
        />
        {/* Add more vendor routes here as they are created */}
      </Routes>
    </>
  );
};

export default VendorRoutes;
