import React, { useCallback, useDebugValue, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { FaSquarePlus } from "react-icons/fa6";
import {
    Card,
    Typography,
} from "@material-tailwind/react";
import { getToken, logout } from "../../utils/jwtUtils";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../common/Loader";
import axios from "axios";
import toast from "react-hot-toast";
const Vendor = () => {
    const token = getToken();
    const navigate=useNavigate();
    const apiKey = import.meta.env["VITE_APP_BASE_URL"];
    const TABLE_HEAD = [
        {
            head: "SN",
        },
        {
            head: "Name",
        },
        {
            head: "Service Type",
        },
        {
            head: "contact",
        },
        {
            head: "Price Range",
        },
        {
            head: "Action",
        },
    ];

    const [loading, setLoading] = useState(true);
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [search, setSearch] = useState(null);
    const [query, setQuery] = useState(""); 
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchVendor();
    }, []);

    const fetchVendor = async () => {
        setLoading(true);
        await axios
            .get(`${apiKey}api/vendors?search=${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(function (response) {
                console.log(response.data);
                setVendors(response.data);
                setLoading(false);
            })
            .catch(function (error) {
                var errorMessage = error.response.data.error;
                if (errorMessage == "jwt expired") {
                    logout(navigate)
                }
                toast.error(errorMessage);
                setLoading(false);
            });
    }

    const handleDelete = async () => {
        setLoading(true);
        if (selectedVendor == null) {
            toast.error("Something went wrong");
            return;
        }
        await axios
            .delete(`${apiKey}api/vendors/${selectedVendor.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(function (response) {
                console.log(response);
                setShowDeleteModal(false);
                toast.success(response.data.message);
                fetchVendor();
            })
            .catch(function (error) {
                console.log(error);
                setTimeout(() => {
                    setLoading(false);
                    if (error.response) {
                        var errorMessage = error.response.data.error;
                        if(errorMessage=="jwt expired")
                        {
                            logout(navigate)
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

    const handleSearch= ()=>{
        fetchVendor();
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

            <Layout activePage="Vendor">
                {loading ? (
                    <>
                        <Loader />
                    </>
                ) : (
                    <>
                        <div className="">
                            <div>
                                <h2 className="text-sm inline-block border-b-2 border-gray-400">
                                Vendor
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
                                        <button onClick={handleSearch} className="bg-blue-600 text-sm text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all flex items-center gap-2">Search</button>
                                    </div>
                                </div>
                                <div>
                                    <Link to="/admin/vendors/create" className="bg-blue-600 text-sm text-white py-1.5 px-9 rounded-xl border border-blue-600 hover:bg-blue-700 duration-500 transition-all flex items-center gap-2">
                                        Create Vendor <FaSquarePlus className="text-xl" />
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
                                        {vendors.length > 0 ? (
                                            vendors.map((element, index) => {
                                                const isLast = index === vendors.length - 1;
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
                                                                {element.service_type}
                                                            </Typography>
                                                        </td>
                                                        <td className={classes}>
                                                            <Typography
                                                                variant="small"
                                                                className="font-normal text-gray-600 dark:text-white"
                                                            >
                                                                {element.contact_info}
                                                            </Typography>
                                                        </td>
                                                        <td className={classes}>
                                                            <Typography
                                                                variant="small"
                                                                className="font-normal text-gray-600 dark:text-white"
                                                            >
                                                                {element.price_range}
                                                            </Typography>
                                                        </td>
                                                        <td className={classes}>
                                                            <div className="flex items-center gap-2">
                                                                <Link to={`/admin/vendors/${element.id}`}>
                                                                    <CiEdit className="text-2xl cursor-pointer text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 dark:text-blue-200" />
                                                                </Link>
                                                                <button onClick={() => { setShowDeleteModal(true); setSelectedVendor(element) }}>
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

export default Vendor;
