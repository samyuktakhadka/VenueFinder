import { RxDashboard } from "react-icons/rx";
import { CiLogout } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
//import {logout} from "../../utils/jwtUtils";
import { CgProfile } from "react-icons/cg";
import { IoLogoBuffer } from "react-icons/io";
import { MdOutlineBedroomChild } from "react-icons/md";
import toast from "react-hot-toast";
import { TbBrandBooking } from "react-icons/tb";
import { CiDesktop } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import { HiOutlineUsers } from "react-icons/hi2";
import { LuUserCog2 } from "react-icons/lu";
import SidebarButton from "./SidebarButton";
import logo from "../images/logo2.png";
import Select from "react-tailwindcss-select";
import { useState } from "react";
import { logout } from "../utils/jwtUtils";

//import { useAuth } from "../hooks/useAuth";
const systems = [
  { value: "1", label: "Hotel Management System" },
  { value: "2", label: "Restaurant POS System" },
];
function Sidebar({ active,isSidebarOpen }) {
  const [selectedSystem, setSelectedSystem] = useState({ value: "1", label: "Hotel Management System" });
  const navigate = useNavigate();
  const handleRoleChange = value => {
    console.log("value:", value);
    setSelectedSystem(value);
    if(value.value==2)
      {
          navigate("/pos/dashboard");
      }
};
  //const { permissions } = useUser();
  //const {logout}= useAuth();
  const handleLogout = () => {
    logout(navigate);
    toast.success("logged out successfully !");
  };
  return (
    <>
      <aside
        id="default-sidebar"
        className={`fixed top-0 lg:left-0  ${isSidebarOpen?"left-0":"-left-full"} lg:w-64 w-[70%] h-screen bg-white dark:bg-black transition-[left] duration-500 ease-linear z-[999] `}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 pt-1 overflow-y-auto">
          <div className="p-2 flex items-center lg:justify-center gap-2 text-blue-600 dark:text-white">
            {/* <IoLogoBuffer className="text-5xl" /> */}
            <div className="w-24 h-24">
              <img src={logo} className="w-full h-full object-contain" alt="" />
            </div>
          </div>
          <ul className="space-y-2 font-medium mt-5">
            <li>
              <SidebarButton
                page="Dashboard"
                activePage={active}
                route="/admin/dashboard"
              >
                <RxDashboard className="text-lg" />
                <span className="ms-3">Dashboard</span>
              </SidebarButton>
            </li>
            <li>
              <SidebarButton
                page="Venue"
                activePage={active}
                route="/admin/venues"
              >
                <MdOutlineBedroomChild className="text-xl" />
                <span className="ms-3">Venue</span>
              </SidebarButton>
            </li>
            <li>
              <SidebarButton
                page="Vendor"
                activePage={active}
                route="/admin/vendors"
              >
                <MdOutlineBedroomChild className="text-xl" />
                <span className="ms-3">Vendor</span>
              </SidebarButton>
            </li>
            <li>
              <SidebarButton
                page="Payment"
                activePage={active}
                route="/admin/payment"
              >
                <TbBrandBooking className="text-xl" />
                <span className="ms-3">Payments</span>
              </SidebarButton>
            </li>
            <li>
              <SidebarButton
                page="Booking"
                activePage={active}
                route="/admin/booking"
              >
                <TbBrandBooking className="text-xl" />
                <span className="ms-3">Bookings</span>
              </SidebarButton>
            </li>
            <li>
              <SidebarButton
                page="User"
                activePage={active}
                route="/admin/user"
              >
                <HiOutlineUsers className="text-xl" />
                <span className="ms-3">Users</span>
              </SidebarButton>
            </li>
            <li>
              <a
                onClick={handleLogout}
                className="flex items-center p-2 rounded-lg  hover:bg-blue-100 group hover:text-blue-600 text-gray-500 cursor-pointer text-sm dark:text-gray-100 dark:hover:bg-blue-700 "
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

export default Sidebar;
