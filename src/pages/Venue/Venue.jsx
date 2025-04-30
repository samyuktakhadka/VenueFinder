import { Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiEdit, CiSearch } from "react-icons/ci";
import { FaSquarePlus } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../common/Loader";
import Layout from "../../components/Layout";
import { getToken, logout } from "../../utils/jwtUtils";
const Venue = () => {
  const token = getToken();
  const navigate = useNavigate();
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const TABLE_HEAD = [
    {
      head: "SN",
    },
    {
      head: "Name",
    },
    {
      head: "Location",
    },
    {
      head: "Price",
    },
    {
      head: "Capacity",
    },
    {
      head: "Amenities",
    },
    {
      head: "Image",
    },
    {
      head: "Action",
    },
  ];

  const [loading, setLoading] = useState(true);
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [search, setSearch] = useState(null);
  const [query, setQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/150";
    // Replace backslashes with forward slashes for URL compatibility
    const normalizedPath = imagePath.replace(/\\/g, "/");
    return `${apiKey}${normalizedPath}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchVenue();
  }, []);

  const fetchVenue = async () => {
    setLoading(true);
    await axios
      .get(`${apiKey}api/publicVenues?search=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        console.log(response.data);
        setVenues(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setTimeout(() => {
          setLoading(false);
          if (error.response) {
            var errorMessage = error.response.data.error;
            if (errorMessage === "jwt expired") {
              logout(navigate);
              toast.error("Session expired! Please login again.");
            } else {
              toast.error(errorMessage);
            }
          } else if (error.message) {
            toast.error("Error: " + error.message);
          } else {
            toast.error("An unexpected error occurred");
          }
        }, 1000);
      });
  };

  const handleDelete = async () => {
    setLoading(true);
    if (selectedVenue == null) {
      toast.error("Something went wrong");
      return;
    }
    await axios
      .delete(`${apiKey}api/venues/${selectedVenue.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        console.log(response);
        setShowDeleteModal(false);
        toast.success(response.data.message);
        fetchVenue();
      })
      .catch(function (error) {
        console.log(error);
        setTimeout(() => {
          setLoading(false);
          if (error.response) {
            var errorMessage = error.response.data.error;
            if (errorMessage == "jwt expired") {
              logout(navigate);
            }
            setShowDeleteModal(false);
            toast.error(errorMessage);
          } else if (error.message) {
            console.log("Error", error.message);
            toast.error("Error", error.message);
          } else {
            toast.error(error);
            console.log("Error", error);
          }
        }, 1000);
      });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query); // Update the search state
    setQuery(query); // Trigger the API call asynchronously
  };

  const handleSearch = () => {
    fetchVenue();
  };

  return (
    <>
      {showDeleteModal ? (
        <>
          <div class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur confirm-dialog ">
            <div class="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
              <div class=" opacity-25 w-full h-full absolute z-10 inset-0"></div>
              <div class="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative shadow-lg">
                <div class="md:flex items-center">
                  <div class="rounded-full border border-gray-300 flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto">
                    <i class="bx bx-error text-3xl">&#9888;</i>
                  </div>
                  <div class="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                    <p class="font-bold">Warning!</p>
                    <p class="text-sm text-gray-700 mt-1">
                      You will lose all of your data by deleting this. This
                      action cannot be undone.
                    </p>
                  </div>
                </div>
                <div class="text-center md:text-right mt-4 md:flex md:justify-end">
                  <button
                    onClick={handleDelete}
                    id="confirm-delete-btn"
                    class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                    }}
                    id="confirm-cancel-btn"
                    class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 md:mt-0 md:order-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      <Layout activePage="Venue">
        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <div className="">
              <div>
                <h2 className="text-sm inline-block border-b-2 border-gray-400">
                  Venue
                </h2>
              </div>
              <div className="mt-5 flex flex-wrap gap-5 justify-between items-center ">
                <div className="flex flex-wrap items-center gap-4">
                  <div class="relative w-56">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <CiSearch className="text-gray-800" />
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      class="bg-white border border-gray-300 placeholder:text-xs text-xs text-gray-900 rounded-3xl  block w-full ps-10 px-2.5 py-2  outline-none"
                      placeholder="Search..."
                      value={search}
                      onChange={handleSearchChange}
                      required
                    />
                  </div>
                  <div>
                    <button
                      onClick={handleSearch}
                      className="bg-blue-600 text-sm text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all flex items-center gap-2"
                    >
                      Search
                    </button>
                  </div>
                </div>
                <div>
                  <Link
                    to="/admin/venue/create"
                    className="bg-blue-600 text-sm text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all flex items-center gap-2"
                  >
                    Create Venue <FaSquarePlus className="text-xl" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <Card className="h-full w-full border rounded-none dark:bg-black dark:text-white overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {TABLE_HEAD.map(({ head }) => (
                        <th key={head} className="border-b border-gray-300 p-4">
                          <div className="flex items-center gap-1">
                            <Typography
                              color="blue-gray"
                              variant="small"
                              className="!font-bold"
                            >
                              {head}
                            </Typography>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {venues.length > 0 ? (
                      venues.map((element, index) => {
                        const isLast = index === venues.length - 1;
                        const classes = isLast
                          ? "p-3"
                          : "p-3 border-b border-gray-300";
                        return (
                          <tr key={index}>
                            <td className={classes}>
                              <div className="flex items-center ml-2 gap-1">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-bold"
                                >
                                  {index + 1}
                                </Typography>
                              </div>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal text-gray-600 dark:text-white"
                              >
                                {element.name}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal text-gray-600 dark:text-white"
                              >
                                {element.location}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal text-gray-600 dark:text-white"
                              >
                                {element.price}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal text-gray-600 dark:text-white"
                              >
                                {element.capacity}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal text-gray-600 dark:text-white"
                              >
                                {element.amenities}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={
                                      element.images &&
                                      element.images.length > 0
                                        ? getImageUrl(
                                            element.images[0].image_url
                                          )
                                        : "https://via.placeholder.com/150"
                                    }
                                    alt={element.name}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className={classes}>
                              <div className="flex items-center gap-2">
                                <Link to={`/admin/venue/${element.id}`}>
                                  <CiEdit className="text-2xl cursor-pointer text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 dark:text-blue-200" />
                                </Link>
                                <button
                                  onClick={() => {
                                    setShowDeleteModal(true);
                                    setSelectedVenue(element);
                                  }}
                                >
                                  <MdDeleteOutline className="text-2xl cursor-pointer hover:text-red-800 text-red-600 dark:hover:text-red-400 dark:text-red-200" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-4">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Card>
            </div>
            <div className="mt-4">
              {/* <Pagination
                                totalRecords={200}
                                currentPage={1}
                                pageSize={5}
                                totalPages={10}
                            /> */}
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default Venue;
