import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Loader from "../../common/Loader";
import VendorLayout from "../../components/VendorLayout";
import { getToken } from "../../utils/jwtUtils";

function generateFakeRevenueData() {
  const data = [];
  for (let i = 0; i < 12; i++) {
    const randomRevenue = Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
    data.push(randomRevenue);
  }
  return data;
}

const VendorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const apiKey = import.meta.env["VITE_APP_BASE_URL"];
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalVenues, setTotalVenues] = useState(0);
  const [totalPendingBookings, setTotalPendingBookings] = useState(0);
  const token = getToken();

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
        data: generateFakeRevenueData(),
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
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiKey}api/vendor/dashboard-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const {
        revenueCounts,
        totalRevenue,
        totalBookings,
        totalVenues,
        totalPendingBookings,
      } = response.data;

      setTotalRevenue(totalRevenue);
      setTotalBookings(totalBookings);
      setTotalVenues(totalVenues);
      setTotalPendingBookings(totalPendingBookings);

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
    } catch (error) {
      console.error(error);
      setLoading(false);
      if (error.response?.data?.error === "jwt expired") {
        // Handle token expiration
      }
    }
  };

  return (
    <>
      <VendorLayout activePage="Dashboard">
        {loading ? (
          <Loader />
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
                  <h2 className="text-lg">Overview</h2>
                  <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 mt-2 ml-1">
                    <div className="flex items-end gap-2">
                      <div className="pb-0.5">
                        <h2 className="text-xs text-gray-500">Total</h2>
                        <h2 className="text-sm mt-0.5">Revenue</h2>
                      </div>
                      <div className="self-end">
                        <span className="text-blue-600 text-2xl font-semibold">
                          $ {totalRevenue}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="pb-0.5">
                        <h2 className="text-xs text-gray-500">Total</h2>
                        <h2 className="text-sm mt-0.5">Bookings</h2>
                      </div>
                      <div>
                        <span className="text-blue-600 text-2xl font-semibold">
                          {totalBookings}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="pb-0.5">
                        <h2 className="text-xs text-gray-500">Total</h2>
                        <h2 className="text-sm mt-0.5">Venues</h2>
                      </div>
                      <div>
                        <span className="text-blue-600 text-2xl font-semibold">
                          {totalVenues}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="pb-0.5">
                        <h2 className="text-xs text-gray-500">Pending</h2>
                        <h2 className="text-sm mt-0.5">Bookings</h2>
                      </div>
                      <div>
                        <span className="text-blue-600 text-2xl font-semibold">
                          {totalPendingBookings}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* statistics */}
                <div className="">
                  <div className="p-4 bg-white dark:bg-gray-300 rounded-md">
                    <h2 className="text-lg dark:text-black">
                      Revenue Statistics
                    </h2>
                    <div>
                      <Chart {...revenueChartConfig} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </VendorLayout>
    </>
  );
};

export default VendorDashboard;
