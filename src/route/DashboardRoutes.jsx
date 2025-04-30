import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Booking from "../pages/Booking/Booking";
import Dashboard from "../pages/Dashboard";
import Payment from "../pages/Payment/Payment";
import User from "../pages/User/User";
import CreateVenue from "../pages/Venue/CreateVenue";
import EditVenue from "../pages/Venue/EditVenue";
import Venue from "../pages/Venue/Venue";
import CreateVendor from "../pages/vendor/CreateVendor";
import EditVendor from "../pages/vendor/EditVendor";
import Vendor from "../pages/vendor/Vendor";
import ProtectedRoute from "./ProtectedRoute";
const DashboardRoutes = () => {
  const token = localStorage.getItem("token") ?? "";
  return (
    <>
      <Routes>
        <Route
          path="/admin/venues"
          element={
            <ProtectedRoute
              element={
                <>
                  <Venue />
                </>
              }
              token={token}
              Role="admin"
            />
          }
        />
        <Route
          path="/admin/user"
          element={
            <ProtectedRoute
              element={
                <>
                  <User />
                </>
              }
              token={token}
              Role="admin"
            />
          }
        />
        <Route
          path="/admin/booking"
          element={
            <ProtectedRoute
              element={
                <>
                  <Booking />
                </>
              }
              token={token}
              Role="admin"
            />
          }
        />
        <Route
          path="/admin/payment"
          element={
            <ProtectedRoute
              element={
                <>
                  <Payment />
                </>
              }
              token={token}
              Role="admin"
            />
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              element={
                <>
                  <Dashboard />
                </>
              }
              token={token}
              Role="admin"
            />
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              element={
                <>
                  <Navigate to="/admin/dashboard" />
                </>
              }
              token={token}
              Role="admin"
            />
          }
        />
        <Route
          path="/admin/venue/create"
          element={
            <ProtectedRoute
              element={
                <>
                  <CreateVenue />
                </>
              }
              token={token}
              Role="admin"
            />
          }
        />
        <Route
          path="/admin/venue/:id"
          element={
            <ProtectedRoute
              element={
                <>
                  <EditVenue />
                </>
              }
              token={token}
              Role="admin"
            />
          }
        />

        <Route
          path="/admin/vendors"
          element={
            <ProtectedRoute
              element={
                <>
                  <Vendor />
                </>
              }
              token={token}
              Role="admin"
            />
          }
        />

        <Route
          path="/admin/vendors/create"
          element={
            <ProtectedRoute
              element={
                <>
                  <CreateVendor />
                </>
              }
              token={token}
              Role="admin"
            />
          }
        />

        <Route
          path="/admin/vendors/:id"
          element={
            <ProtectedRoute
              element={
                <>
                  <EditVendor />
                </>
              }
              token={token}
              Role="admin"
            />
          }
        />
      </Routes>
    </>
  );
};

export default DashboardRoutes;
