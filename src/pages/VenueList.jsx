import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdLocationPin, MdSearch } from "react-icons/md";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link } from "react-router-dom";
import Loader from "../common/Loader";
import Footer from "./Footer";
import Nav from "./Nav";

const VenueList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [venues, setVenues] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVenues, setFilteredVenues] = useState([]);
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const [error, setError] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchVenue();
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

  useEffect(() => {
    // Filter venues based on search query
    const filtered = venues.filter(
      (venue) =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredVenues(filtered);
  }, [searchQuery, venues]);

  const fetchVenue = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${apiKey}api/publicVenues`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("API Response:", response.data);
      setVenues(response.data);
      setFilteredVenues(response.data);
    } catch (error) {
      console.error("Error fetching venues:", error);
      if (error.response?.data?.error === "jwt expired") {
        logout(navigate);
      } else {
        toast.error(error.response?.data?.error || "Failed to fetch venues");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x300?text=No+Image";
    // Replace backslashes with forward slashes for URL compatibility
    const normalizedPath = imagePath.replace(/\\/g, "/");
    return `${apiKey}${normalizedPath}`;
  };

  return (
    <>
      {isLoading && <Loader />}
      {error && <div className="text-red-500 text-center mt-5">{error}</div>}
      {!isLoading && !error && (
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

          {/* about section */}
          <section className="md:px-20 px-10 py-10 mt-20 min-h-[60vh]">
            <h2 className="text-center text-3xl md:text-4xl font-bold text-[#236a9d] underline mb-12">
              Venues
            </h2>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-12">
              <div className="relative">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search venues by name or location..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#236a9d] focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVenues.length > 0 ? (
                filteredVenues.map((venue, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:scale-[1.02]"
                  >
                    <div className="h-64 overflow-hidden">
                      {venue.images && venue.images.length > 0 ? (
                        <Carousel
                          showArrows={true}
                          showStatus={false}
                          showThumbs={false}
                          infiniteLoop={true}
                          autoPlay={true}
                          interval={5000}
                          stopOnHover={true}
                          className="venue-carousel"
                        >
                          {venue.images.map((image, imgIndex) => (
                            <div key={imgIndex} className="h-64">
                              <img
                                src={getImageUrl(image.image_url)}
                                alt={`${venue.name} - Image ${imgIndex + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </Carousel>
                      ) : (
                        <img
                          src="https://via.placeholder.com/400x300?text=No+Image"
                          alt={venue.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                          {venue.name}
                        </h3>
                        <span className="bg-cyan-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                          Rs. {venue.price}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-3">
                        <MdLocationPin className="text-xl mr-1" />
                        <span className="text-sm line-clamp-1">
                          {venue.location}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {venue.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Capacity: {venue.capacity} people
                        </span>
                        <Link
                          to={`/venues/${venue.id}`}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500 text-lg">
                    No venues found matching your search.
                  </p>
                </div>
              )}
            </div>
          </section>
          {/*end of about section */}

          <Footer />
        </>
      )}
    </>
  );
};

export default VenueList;
