import React from 'react'
import ProtectedRoute from './ProtectedRoute'
import { Route, Routes } from 'react-router-dom'
import Venue from '../pages/Venue/Venue';
import VenueList from '../pages/VenueList';
import VenueDetail from '../pages/VenueDetail';
import ServiceList from '../pages/ServiceList';
import ServiceDetail from '../pages/ServiceDetail';
import VendorSuccess from '../pages/VendorSuccess';
import VenueSuccess from '../pages/VenueSuccess';
import MyBooking from '../pages/MyBooking';
import MyProfile from '../pages/MyProfile';
const UserRoute = () => {
    const token = localStorage.getItem("token") ?? "";
    return (
        <>
            <Routes>

                <Route
                    path="/venues"
                    element={
                        <VenueList />
                    }
                />
                <Route
                    path="/vendor-payment-success"
                    element={
                        <VendorSuccess />
                    }
                />
                <Route
                    path="/venue-payment-success"
                    element={
                        <VenueSuccess />
                    }
                />
                <Route
                    path="/services"
                    element={
                        <ServiceList />
                    }
                />
                <Route
                    path="/venues/:id"
                    element={
                        <ProtectedRoute
                            element={
                                <>
                                    <VenueDetail />
                                </>
                            }
                            token={token}
                            role=""
                        />
                    }
                />

                <Route
                    path="/services/:id"
                    element={
                        <ProtectedRoute
                            element={
                                <>
                                    <ServiceDetail />
                                </>
                            }
                            token={token}
                            role=""
                        />
                    }
                />

                <Route
                    path="/mybookings"
                    element={
                        <ProtectedRoute
                            element={
                                <>
                                    <MyBooking />
                                </>
                            }
                            token={token}
                            role=""
                        />
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute
                            element={
                                <>
                                    <MyProfile />
                                </>
                            }
                            token={token}
                            role=""
                        />
                    }
                />
            </Routes>
        </>
    )
}

export default UserRoute