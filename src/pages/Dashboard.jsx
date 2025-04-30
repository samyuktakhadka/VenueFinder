import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Loader from "../common/Loader";
import { Link } from "react-router-dom";
import { FaSquarePlus } from "react-icons/fa6";
import { SlOptionsVertical } from "react-icons/sl";
import Chart from "react-apexcharts";
import axios from "axios";
import { getToken } from "../utils/jwtUtils";
const roomData = [
  {
    name: "Single Sharing",
    availableRooms: 2,
    totalRooms: 30,
    Rate: 568,
    Deals: 2,
  },
  {
    name: "Double Sharing",
    availableRooms: 2,
    totalRooms: 35,
    Rate: 1068,
    Deals: 2,
  },
  {
    name: "Triple Sharing",
    availableRooms: 2,
    totalRooms: 35,
    Rate: 1568,
  },
  {
    name: "VIP Suit",
    availableRooms: 4,
    totalRooms: 10,
    Rate: 2568,
  },
];

function generateFakeRevenueData() {
  const data = [];
  for (let i = 0; i < 12; i++) {
    // Generate a random revenue amount between 1000 and 10000
    const randomRevenue = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
    data.push(randomRevenue);
  }
  return data;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const[totalRevenue,setTotalRevenue]=useState(0);
  const[totalUsers,setTotalUsers]=useState(0);
  const[totalVendors,setTotalVendors]=useState(0);
  const[totalVenues,setTotalVenues]=useState(0);
const token=getToken();
  const formatDate = () => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options).replace(",", ",");
  };
  const [revenueChartConfig, setRevenueChartConfig] = useState({
    series: [
      {
        name: "Revenue",
        data: generateFakeRevenueData(), // Initially empty, will be updated with API data
      },
    ],
    options: {
      chart: {
        type: "line",
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
      },
      stroke: {
        lineCap: "round",
        curve: "smooth",
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  });


  useEffect(() => {
    fetchDashboardCount();
  }, []);

  const fetchDashboardCount = async () => {
    setLoading(true);
    await axios
        .get(`${apiKey}api/paypal/dashboard-count`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(function (response) {
            console.log(response.data);
            const revenueCounts=response.data.revenueCounts;
            setTotalRevenue(response.data.totalRevenue);
            setTotalUsers(response.data.totalUsers);
            setTotalVendors(response.data.totalVendors);
            setTotalVenues(response.data.totalVenues);
            setRevenueChartConfig((prevConfig) => ({
              ...prevConfig,
              series: [
                {
                  ...prevConfig.series[0],
                  data: revenueCounts,
                },
              ],
            }));
            setLoading(false);
        })
        .catch(function (error) {
            console.log(error);
            var errorMessage = error.response.data.error;
                if (errorMessage == "jwt expired") {
                    logout(navigate)
                }
                toast.error(errorMessage);
            setLoading(false);
        });
}

  return (
    <>
      <Layout activePage="Dashboard">
        {loading ? (
          <>
            <Loader />
          </>
        ) : (
          <>
            <div className="text-gray-700 dark:!text-white">
              <div className="flex items-center flex-wrap gap-4 py-2">
                <div className="flex-grow text-center">
                  <h2 className="text-sm dark:text-white">{formatDate()}</h2>
                </div>
              </div>

              <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-md flex flex-col gap-4">
                {/* overview */}
                <div className="p-4 pb-3 bg-white dark:bg-black rounded-md">
                  <h2 className="text-lg ">Overview</h2>
                  <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 mt-2 ml-1">
                    <div className="flex items-end gap-2 ">
                      <div className="pb-0.5">
                        <h2 className="text-xs text-gray-500">Total</h2>
                        <h2 className="text-sm mt-0.5">Revenue</h2>
                      </div>
                      <div className="self-end">
                        <span className="text-blue-600 text-2xl font-semibold ">
                         $ {totalRevenue}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-end gap-2 ">
                      <div className="pb-0.5">
                        <h2 className="text-xs text-gray-500">Total</h2>
                        <h2 className="text-sm mt-0.5">Users</h2>
                      </div>
                      <div>
                        <span className="text-blue-600 text-2xl font-semibold ">
                          {totalUsers}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-end gap-2 ">
                      <div className="pb-0.5">
                        <h2 className="text-xs text-gray-500">Total</h2>
                        <h2 className="text-sm mt-0.5">Vendors</h2>
                      </div>
                      <div>
                        <span className="text-blue-600 text-2xl font-semibold ">
                          {totalVendors}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-end gap-2 ">
                      <div className="pb-0.5">
                        <h2 className="text-xs text-gray-500">Total</h2>
                        <h2 className="text-sm mt-0.5">Venues</h2>
                      </div>
                      <div>
                        <span className="text-blue-600 text-2xl font-semibold ">
                          {totalVenues}
                        </span>
                      </div>
                    </div>
                    
                  </div>
                </div>

                {/* statistics */}
                <div className="">
                  
                  <div className="p-4 bg-white dark:bg-gray-300 rounded-md">
                    <h2 className="text-lg dark:text-black">Revenue Statistics</h2>
                    <div>
                      <Chart {...revenueChartConfig} />
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default Dashboard;
