import { Calendar } from "@demark-pro/react-booking-calendar";
import "@demark-pro/react-booking-calendar/dist/react-booking-calendar.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdLocationPin } from "react-icons/md";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../common/Loader";
import { getToken, logout } from "../utils/jwtUtils";
import Footer from "./Footer";
import Nav from "./Nav";

const VenueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = getToken();
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [venue, setVenue] = useState([]);
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const [reservedDates, setReservedDates] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [venueImages, setVenueImages] = useState([]);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchVenue();
    fetchReservedDates();
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden"; // Disable background scrolling
    } else {
      document.body.style.overflow = ""; // Re-enable background scrolling
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const fetchVenue = async () => {
    setIsLoading(true);
    await axios
      .get(`${apiKey}api/publicVenues/${id}`, {})
      .then(function (response) {
        console.log(response);
        console.log(response.data);
        setVenue(response.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        var errorMessage = error.response.data.error;
        if (errorMessage == "jwt expired") {
          logout(navigate);
        }
        setIsLoading(false);
      });
  };

  const fetchReservedDates = async () => {
    setIsLoading(true);
    await axios
      .get(`${apiKey}api/Venues/getReservedDates/${id}`, {})
      .then(function (response) {
        console.log(response);
        setReservedDates(response.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        var errorMessage = error.response.data.error;
        if (errorMessage == "jwt expired") {
          logout(navigate);
        }
        setIsLoading(false);
      });
  };

  const formatDateForMySQL = (date) => {
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
    }
    return null;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedDates || selectedDates.length === 0) {
      toast.error("No date selected. Please select a date.");
      return;
    }
    const firstDate = selectedDates[0];
    const formattedDate = formatDateForMySQL(firstDate);
    const bookingData = {
      venue_id: id,
      booking_date: formattedDate,
    };
    setIsLoading(true);
    var api;
    if (isChecked) {
      api = `${apiKey}api/paypal/create-venue-payment`;
    } else {
      api = `${apiKey}api/booking/create`;
    }
    await axios
      .post(api, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        if (isChecked) {
          var redirect = response.data.approvalUrl;
          window.location.href = redirect;
        } else {
          if (response.status === 201) {
            toast.success(response.data.message);
            navigate("/venues");
          }
        }
        setIsLoading(false);
      })
      .catch(function (error) {
        var errorMessage = error.response.data.error;
        if (errorMessage == "jwt expired") {
          toast.error("Token Expired!");
          logout(navigate);
        }
        setIsLoading(false);
      });
  };

  const handleEmailClick = (email) => {
    const mailtoLink = `mailto:${email}?subject=Inquiry about ${venue.name}&body=Hello,%0D%0A%0D%0AI am interested in your venue "${venue.name}" and would like to get more information.%0D%0A%0D%0ABest regards`;
    window.location.href = mailtoLink;
  };

  const getVenueImages = async (venueId) => {
    try {
      const response = await axios.get(`${apiKey}api/publicVenues/${venueId}/images`);
      setVenueImages(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching venue images:", error);
      return [];
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/800x400?text=No+Image";
    // Replace backslashes with forward slashes for URL compatibility
    const normalizedPath = imagePath.replace(/\\/g, "/");
    return `${apiKey}${normalizedPath}`;
  };

  useEffect(() => {
    if (venue.id) {
      getVenueImages(venue.id);
    }
  }, [venue.id]);

  return (
    <>
      {isLoading && <Loader />}

      {!isLoading && (
        <>
          {/* overlay */}
          <div
            onClick={toggleSidebar}
            className={`fixed left-0 top-0 w-full h-full z-[998] bg-gray-600 bg-opacity-50 transition-all duration-300 ease-linear  ${
              isSidebarOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0  pointer-events-none"
            } `}
          ></div>
          {/*end of overlay */}
          <Nav toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <section className="mt-16">
            <div className="w-full h-[40vh] lg:h-[60vh] relative">
              {venueImages && venueImages.length > 0 ? (
                <Carousel
                  showArrows={true}
                  showStatus={false}
                  showThumbs={true}
                  infiniteLoop={true}
                  autoPlay={true}
                  interval={5000}
                  stopOnHover={true}
                  className="venue-detail-carousel"
                  thumbWidth={80}
                  selectedItem={0}
                  renderThumbs={() =>
                    venueImages.map((image, index) => (
                      <div key={index} className="h-16 w-20">
                        <img
                          src={getImageUrl(image.image_url)}
                          alt={`${venue.name} - Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  }
                >
                  {venueImages.map((image, index) => (
                    <div key={index} className="h-full w-full">
                      <img
                        src={getImageUrl(image.image_url)}
                        alt={`${venue.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                        style={{ maxHeight: "60vh", width: "100%" }}
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <div className="w-full h-full">
                  <img
                    className="w-full h-full object-cover object-center brightness-50"
                    style={{ maxHeight: "60vh", width: "100%" }}
                    src={
                      venue.imageUrl
                        ? getImageUrl(venue.imageUrl)
                        : "https://via.placeholder.com/800x400?text=No+Image"
                    }
                    alt={venue.name}
                  />
                </div>
              )}
              <div className="absolute z-[1] top-0 w-full left-0 h-full flex items-center justify-center">
                <div className="text-white text-center w-1/2">
                  <h2 className="lg:text-6xl md:text-4xl text-2xl font-extrabold wow animate__animated animate__lightSpeedInLeft">
                    {venue.name}
                  </h2>
                </div>
              </div>
            </div>
            <div className="lg:pl-20 px-5 py-10 bg-blue-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="mt-20">
                  <div className="flex gap-4 mb-4">
                    <div className="rounded-full bg-cyan-600 py-1 px-3 border border-transparent text-sm text-white transition-all shadow-sm text-center">
                      Rs. {venue.price}
                    </div>
                    <p className="text-slate-600 leading-normal text-sm font-semibold flex gap-2 line-clamp-1">
                      <MdLocationPin className="text-xl" />
                      {venue.location}
                    </p>
                  </div>
                  <div className="mt-5 mb-10">
                    <div className="">
                      <h2 className="text-2xl text-orange-500 font-semibold mb-4">
                        {venue.name}
                      </h2>

                      <div className="text-justify my-5">
                        <p className="text-gray-700">{venue.description}</p>
                      </div>

                      <div className="mt-5 text-base font-semibold space-y-4">
                        <h2 className="flex items-center">
                          <span className="text-gray-700 mr-2">Capacity:</span>
                          <span className="text-gray-900">
                            {venue.capacity} people
                          </span>
                        </h2>
                        <div>
                          <h2 className="font-semibold text-gray-700 mb-2">
                            Amenities:
                          </h2>
                          <ul className="list-disc list-inside text-gray-700 mt-1">
                            {venue.amenities?.split(",").map((item, index) => (
                              <li key={index} className="ml-2">
                                {item.trim()}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <h2 className="flex items-center">
                          <span className="text-gray-700 mr-2">
                            Contact Email:
                          </span>
                          <button
                            onClick={() => handleEmailClick(venue.email)}
                            className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-2"
                          >
                            {venue.email}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Book This Venue
                  </h3>
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">
                        Price per day:
                      </span>
                      <span className="text-lg font-bold text-cyan-600">
                        Rs. {venue.price}
                      </span>
                    </div>
                  </div>
                  <Calendar
                    selected={selectedDates}
                    reserved={reservedDates}
                    onChange={setSelectedDates}
                  />
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center">
                      <input
                        onChange={handleCheckboxChange}
                        id="link-checkbox"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="link-checkbox"
                        className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Pay In Advance (Secure payment via PayPal)
                      </label>
                    </div>
                    <button
                      onClick={handleBooking}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {isChecked ? "Proceed to Payment" : "Book Now"}
                    </button>
                    <p className="text-xs text-gray-500 text-center">
                      {isChecked
                        ? "You will be redirected to PayPal for secure payment"
                        : "Booking will be confirmed after venue owner approval"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </>
      )}
    </>
  );
};

export default VenueDetail;
