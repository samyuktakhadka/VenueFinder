import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiSearch } from "react-icons/ci";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../common/Loader";
import VendorLayout from "../../components/VendorLayout";
import { getToken } from "../../utils/jwtUtils";

const VenueManagement = () => {
  const navigate = useNavigate();
  const token = getToken();
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const [loading, setLoading] = useState(true);
  const [venues, setVenues] = useState([]);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiKey}api/venues/vendor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVenues(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      if (error.response?.data?.error === "jwt expired") {
        // Handle token expiration
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch venues");
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    fetchVenues();
  };

  const handleDelete = async () => {
    if (!selectedVenue) {
      toast.error("No venue selected for deletion");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete(
        `${apiKey}api/venues/${selectedVenue.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setShowDeleteModal(false);
      fetchVenues();
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to delete venue");
    }
  };

  const openDeleteModal = (venue) => {
    setSelectedVenue(venue);
    setShowDeleteModal(true);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/150";
    // Replace backslashes with forward slashes for URL compatibility
    const normalizedPath = imagePath.replace(/\\/g, "/");
    return `${apiKey}${normalizedPath}`;
  };

  return (
    <VendorLayout activePage="Venues">
      {loading ? (
        <Loader />
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">My Venues</h2>
            <Link
              to="/vendor/venues/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <FaPlus /> Add New Venue
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CiSearch className="text-gray-500" />
                </div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Search venues..."
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>

            {venues.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No venues found
                </p>
                <Link
                  to="/vendor/venues/create"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Create your first venue
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Venue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Capacity
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {venues.map((venue) => (
                      <tr key={venue.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={
                                  venue.images && venue.images.length > 0
                                    ? getImageUrl(venue.images[0].image_url)
                                    : "https://via.placeholder.com/150"
                                }
                                alt={venue.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {venue.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {venue.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            Rs. {venue.price}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {venue.capacity}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() =>
                                navigate(`/vendor/venues/${venue.id}`)
                              }
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => openDeleteModal(venue)}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete the venue "{selectedVenue?.name}"?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </VendorLayout>
  );
};

export default VenueManagement;
