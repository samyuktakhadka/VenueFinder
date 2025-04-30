import React, { useDebugValue, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { MdDeleteOutline } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import {
  Card,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../common/Loader";
import axios from "axios";
import { getToken, logout } from "../../utils/jwtUtils";
import toast from "react-hot-toast";
const Booking = () => {
  const [displayMode, setDisplayMode] = useState("venue");
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [bookings, setBookings] = useState([]);
  const token = getToken();
  const [bookingId, setBookingId] = useState(null);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const statusClasses = {
    Pending: "bg-orange-100 text-orange-600",
    Confirmed: "bg-green-100 text-green-600",
    Canceled: "bg-red-100 text-red-600",
  };
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBookings();

  }, []);


  const fetchBookings = async () => {
    setLoading(true);
    await axios
      .get(`${apiKey}api/booking?search=${query}&displayMode=${displayMode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        console.log(response.data);
        setBookings(response.data);
        setLoading(false);
      })
      .catch(function (error) {
        var errorMessage = error.response.data.error;
        if (errorMessage == "jwt expired") {
          logout(navigate)
          toast.error("token expired!");
        }
        setLoading(false);
      });
  }

  const handleDisplayModeChange = (mode) => {
    setDisplayMode(mode);
  }

  useEffect(() => {
    fetchBookings();  // Call the API when either `displayMode` or `query` changes
  }, [displayMode]);

  const handleDelete = async () => {
    setLoading(true);
    if (bookingId == null) {
      toast.error("Something went wrong");
      return;
    }
    var endpoint;
    if (displayMode == "venue") {
      endpoint = `${apiKey}api/booking/${bookingId}`;
    }
    else if (displayMode == "vendor") {
      endpoint = `${apiKey}api/booking/vendor-booking/${bookingId}`;
    }
    else {
      toast.error("Something went wrong");
      return;
    }
    await axios
      .delete(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        console.log(response);
        setShowDeleteModal(false);
        toast.success(response.data.message);
        fetchBookings();
      })
      .catch(function (error) {
        console.log(error);
        setTimeout(() => {
          setLoading(false);
          if (error.response) {
            var errorMessage = error.response.data.error;
            if (errorMessage == "jwt expired") {
              logout(navigate)
              toast.error("token expired!");
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
  }

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query); // Update the search state
    setQuery(query); // Trigger the API call asynchronously
  };

  const handleSearch = () => {
    fetchBookings();
  }

  const handleDeleteButtonClick = (id) => {
    setShowDeleteModal(true);
    setBookingId(id);

  }

  return (
    <>
      {showDeleteModal ? (<>
        <div class="fixed inset-0 flex items-center justify-center z-50 backdrop-blur confirm-dialog ">
          <div class="relative px-4 min-h-screen md:flex md:items-center md:justify-center">
            <div class=" opacity-25 w-full h-full absolute z-10 inset-0"></div>
            <div class="bg-white rounded-lg md:max-w-md md:mx-auto p-4 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 md:relative shadow-lg">
              <div class="md:flex items-center">
                <div class="rounded-full border border-gray-300 flex items-center justify-center w-16 h-16 flex-shrink-0 mx-auto">
                  <i class="bx bx-error text-3xl">
                    &#9888;
                  </i>
                </div>
                <div class="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                  <p class="font-bold">Warning!</p>
                  <p class="text-sm text-gray-700 mt-1">You will lose all of your data by deleting this. This action cannot be undone.
                  </p>
                </div>
              </div>
              <div class="text-center md:text-right mt-4 md:flex md:justify-end">
                <button onClick={handleDelete} id="confirm-delete-btn" class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-red-200 text-red-700 rounded-lg font-semibold text-sm md:ml-2 md:order-2">
                  Delete
                </button>
                <button onClick={() => { setShowDeleteModal(false) }} id="confirm-cancel-btn" class="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4 md:mt-0 md:order-1">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </>) : (<></>)}

      <Layout activePage="Booking">
        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <div className="">
              <div>
                <h2 className="text-sm inline-block border-b-2 border-gray-400">
                  Booking
                </h2>
              </div>
              <div>
                <div className="text-xs flex flex-wrap gap-4 mt-5">
                  <div
                    onClick={() => handleDisplayModeChange("venue")}
                    className={`py-1.5 px-4 rounded-2xl cursor-pointer transition-all duration-300 ease-linear ${displayMode === "venue"
                      ? "bg-blue-100 text-blue-700 border border-blue-600"
                      : "bg-white text-gray-700 border border-gray-500"
                      }`}
                  >
                    <p>Venue</p>
                  </div>
                  <div
                    onClick={() => handleDisplayModeChange("vendor")}
                    className={`py-1.5 px-4 rounded-2xl cursor-pointer transition-all duration-300 ease-linear ${displayMode === "vendor"
                      ? "bg-blue-100 text-blue-700 border border-blue-600"
                      : "bg-white text-gray-700 border border-gray-500"
                      }`}
                  >
                    <p>Vendor</p>
                  </div>
                </div>
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
                    <button onClick={handleSearch} className="bg-blue-600 text-sm text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all flex items-center gap-2">Search</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <Card className="h-full w-full border rounded-none dark:bg-black dark:text-white overflow-x-auto">
                {/* <CardHeader
                  floated={true}
                  shadow={false}
                  className="mb-2 rounded-none p-2"
              >
                  <div className="w-full md:w-96">
                      <Input
                          label="Search Invoice"
                          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                      />
                  </div>
              </CardHeader> */}
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      <th className="border-b border-gray-300 p-4">
                        <div className="flex items-center gap-1">
                          <Typography
                            color="blue-gray"
                            variant="small"
                            className="!font-bold"
                          >
                            SN
                          </Typography>
                        </div>
                      </th>
                      <th className="border-b border-gray-300 p-4">
                        <div className="flex items-center gap-1">
                          <Typography
                            color="blue-gray"
                            variant="small"
                            className="!font-bold"
                          >
                            Customer Name
                          </Typography>
                        </div>
                      </th>
                      <th className="border-b border-gray-300 p-4">
                        <div className="flex items-center gap-1">
                          <Typography
                            color="blue-gray"
                            variant="small"
                            className="!font-bold"
                          >
                            {displayMode == "venue" ? "Venue Name" : "Vendor Name"}

                          </Typography>
                        </div>
                      </th>
                      <th className="border-b border-gray-300 p-4">
                        <div className="flex items-center gap-1">
                          <Typography
                            color="blue-gray"
                            variant="small"
                            className="!font-bold"
                          >
                            Customer Contact
                          </Typography>
                        </div>
                      </th>
                      <th className="border-b border-gray-300 p-4">
                        <div className="flex items-center gap-1">
                          <Typography
                            color="blue-gray"
                            variant="small"
                            className="!font-bold"
                          >
                            {displayMode == "venue" ? "Venue Price" : "Vendor Price"}
                          </Typography>
                        </div>
                      </th>
                      <th className="border-b border-gray-300 p-4">
                        <div className="flex items-center gap-1">
                          <Typography
                            color="blue-gray"
                            variant="small"
                            className="!font-bold"
                          >
                            Payment Statuts
                          </Typography>
                        </div>
                      </th>
                      <th className="border-b border-gray-300 p-4">
                        <div className="flex items-center gap-1">
                          <Typography
                            color="blue-gray"
                            variant="small"
                            className="!font-bold"
                          >
                            Booking Date
                          </Typography>
                        </div>
                      </th>
                      <th className="border-b border-gray-300 p-4">
                        <div className="flex items-center gap-1">
                          <Typography
                            color="blue-gray"
                            variant="small"
                            className="!font-bold"
                          >
                            Action
                          </Typography>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length > 0 ? (
                      bookings.map((element, index) => {
                        const isLast = index === bookings.length - 1;
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
                                {element.venue_name ?? element.vendor_name}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal text-gray-600 dark:text-white"
                              >
                                {element.contact}
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
                                {element.payment_status}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                className="font-normal text-gray-600 dark:text-white"
                              >
                                {new Date(element.booking_date).toLocaleDateString('en-GB', {
                                  weekday: 'short',   // Abbreviated weekday, e.g., "Wed"
                                  day: '2-digit',     // Day of the month, e.g., "25"
                                  month: 'short',     // Abbreviated month, e.g., "Dec"
                                  year: 'numeric',    // Full year, e.g., "2024"
                                })}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <div className="flex items-center gap-2">
                                <button onClick={() => { handleDeleteButtonClick(element.id) }}>
                                  <MdDeleteOutline className="text-2xl cursor-pointer hover:text-red-800 text-red-600 dark:hover:text-red-400 dark:text-red-200" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      }
                      )) : (
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
          </>
        )}
      </Layout>
    </>
  );
};

export default Booking;
