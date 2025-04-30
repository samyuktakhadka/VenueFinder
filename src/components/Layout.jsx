import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
const Layout = ({ children, activePage }) => {
  const [isSidebarOpen,setIsSidebarOpen]=useState(false);
  const toggleSidebar=()=>{
    setIsSidebarOpen(!isSidebarOpen);
  }
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
  return (
    <>
      <Sidebar active={activePage} isSidebarOpen={isSidebarOpen} />
      <div className=''>
        <div onClick={toggleSidebar} className={`fixed left-0 top-0 w-full h-full z-[998] bg-gray-600 bg-opacity-50 transition-all duration-300 ease-linear  ${isSidebarOpen?"opacity-100 pointer-events-auto":"opacity-0  pointer-events-none"} `}>
        </div>
        <TopBar toggleSidebar={toggleSidebar} title="Welcome to Hotel Management System" />
        <div className="lg:ml-64">
          <div className={`py-5  lg:px-10 px-5 pt-20 relative min-h-screen dark:bg-black dark:!text-white `}> 
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
