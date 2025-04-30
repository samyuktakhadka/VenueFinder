import toast from "react-hot-toast";
import { CiLogout } from "react-icons/ci";
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { MdOutlineBedroomChild } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { TbBrandBooking } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo2.png";
import { logout } from "../utils/jwtUtils";
import SidebarButton from "./SidebarButton";

function VendorSidebar({ active, isSidebarOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
    toast.success("Logged out successfully!");
  };

  return (
    <>
      <aside
        id="default-sidebar"
        className={`fixed top-0 lg:left-0 ${
          isSidebarOpen ? "left-0" : "-left-full"
        } lg:w-64 w-[70%] h-screen bg-white dark:bg-black transition-[left] duration-500 ease-linear z-[999]`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 pt-1 overflow-y-auto">
          <div className="p-2 flex items-center lg:justify-center gap-2 text-blue-600 dark:text-white">
            <div className="w-24 h-24">
              <img src={logo} className="w-full h-full object-contain" alt="" />
            </div>
          </div>
          <ul className="space-y-2 font-medium mt-5">
            <li>
              <SidebarButton
                page="Dashboard"
                activePage={active}
                route="/vendor/dashboard"
              >
                <RxDashboard className="text-lg" />
                <span className="ms-3">Dashboard</span>
              </SidebarButton>
            </li>
            <li>
              <SidebarButton
                page="Venues"
                activePage={active}
                route="/vendor/venues"
              >
                <MdOutlineBedroomChild className="text-xl" />
                <span className="ms-3">My Venues</span>
              </SidebarButton>
            </li>
            <li>
              <SidebarButton
                page="Bookings"
                activePage={active}
                route="/vendor/bookings"
              >
                <TbBrandBooking className="text-xl" />
                <span className="ms-3">Bookings</span>
              </SidebarButton>
            </li>
            <li>
              <SidebarButton
                page="Payments"
                activePage={active}
                route="/vendor/payments"
              >
                <HiOutlineCurrencyDollar className="text-xl" />
                <span className="ms-3">Payments</span>
              </SidebarButton>
            </li>
            <li>
              <a
                onClick={handleLogout}
                className="flex items-center p-2 rounded-lg hover:bg-blue-100 group hover:text-blue-600 text-gray-500 cursor-pointer text-sm dark:text-gray-100 dark:hover:bg-blue-700"
              >
                <CiLogout className="text-xl" />
                <span className="ms-3">Log out</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

export default VendorSidebar;
