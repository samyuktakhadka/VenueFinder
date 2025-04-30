import React, { useContext, useState } from "react";
import { FaBars } from "react-icons/fa";
import { ToggleTheme } from "./ThemeToggle";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/jwtUtils";
const TopBar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const date = new Date();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = date.getDate();
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    logout(navigate);
  };
  return (
    <div className="font-medium md:px-10 px-5 py-3 flex justify-between items-center border-b-2 dark:border-white fixed top-0 left-0 right-0 lg:ml-64  z-[99] dark:bg-black bg-white ">
      <div className="flex flex-wrap gap-5 items-center">
        <div onClick={toggleSidebar} className="lg:hidden block">
          <FaBars className='text-2xl cursor-pointer dark:text-white' />
        </div>
        <h2 className="text-xl tracking-wider text-gray-600 dark:!text-white lg:block hidden">
          Welcome to Venue Management System
        </h2>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <div>
          <ToggleTheme />
        </div>
        <div className="flex items-center gap-2 relative">
          <div
            className={`absolute  top-[110%] right-0 bg-white text-sm text-gray-700 w-28 py-2 z-50 border border-gray-300 rounded-md transition-all duration-300 ${isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
              } `}
          >
            <h2 className="hover:bg-blue-100 hover:text-blue-600 px-3 py-1  cursor-pointer">
              Profile
            </h2>
            <h2 onClick={handleLogout} className="px-3 py-1 hover:bg-blue-100 hover:text-blue-600  cursor-pointer">
              Logout
            </h2>
          </div>
          {/*end of modal */}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
