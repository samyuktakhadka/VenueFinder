import React, { useEffect, useState } from 'react'
import bg from "../images/3.jpg"
import img4 from "../images/4.jpg"
import Loader from '../common/Loader';
import { BsCalendar2EventFill } from "react-icons/bs";
import { LuPartyPopper } from "react-icons/lu";
import Footer from './Footer';
import Nav from './Nav';
const Home = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
    useEffect(() => {
        const img = new Image();
        img.src = bg;
        img.onload = () => {
            setIsLoading(false);
        };
    }, []);
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
            {isLoading && (
                <Loader />
            )}

            {!isLoading && (
                <>

                    {/* overlay */}
                    <div onClick={toggleSidebar} className={`fixed left-0 top-0 w-full h-full z-[998] bg-gray-600 bg-opacity-50 transition-all duration-300 ease-linear  ${isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0  pointer-events-none"} `}>
                    </div>
                    {/*end of overlay */}

                        <Nav toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                    
                    {/* hero section */}
                    <section
                        className="relative h-[100vh] overflow-y-auto "
                        style={{
                            backgroundImage: `url(${bg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'top',
                            backgroundAttachment: 'fixed',
                        }}
                    >
                        {/* Dark overlay to reduce brightness */}
                        <div className="absolute inset-0 bg-black opacity-70"></div>

                        <div className="relative w-full h-full max-h-[100vh] overflow-y-auto flex items-center justify-center">
                            {/* Section content goes here */}
                            <div className="p-8 relative z-10 text-white">
                                <h1 className="md:text-4xl text-lg mb-4 font-bold !font-sans  text-center">EMPOWERING VENUE <br /> MANAGEMENT</h1>
                                <div className='grid md:grid-cols-2 gap-5 mt-10 mx-10'>
                                    <div className='text-center hover:bg-blue-800 p-5 rounded-xl transition-all duration-500 ease-linear hover:scale-105 cursor-default'>
                                        <div className='flex justify-center'>
                                            <LuPartyPopper  className='text-5xl' />
                                        </div>
                                        <h2 className='md:text-xl text-md font-semibold mt-2'>Find Your Event Sapce <br /></h2>
                                        <div className=''>
                                            <p className='text-xs'>Simplify Your Venue <br /> Bookings Experience</p>
                                        </div>

                                    </div>
                                    <div className='text-center hover:bg-blue-800 p-5 rounded-xl transition-all duration-500 ease-linear hover:scale-105 cursor-default'>
                                        <div className='flex justify-center'>
                                            <BsCalendar2EventFill  className='text-5xl' />
                                        </div>
                                        <h2 className='md:text-xl text-md font-semibold mt-2'>Event Services</h2>
                                        <div className=''>
                                            <p className='text-xs'>Book Different <br />Event Services</p>
                                        </div>

                                    </div>
                                </div>
                                {/* Repeat content for testing scrolling */}
                            </div>
                        </div>
                    </section>
                    {/*end of hero section */}

                    {/* about section */}
                    <section className='md:px-20 px-10 py-10'>
                        <div className='grid md:grid-cols-2 gap-10 items-center'>
                            <div className="text-center md:text-left space-y-4">
                                <h2 className="text-3xl md:text-4xl font-bold text-[#236a9d]">Are you searching for the perfect venue for your event?  
                                </h2>
                                <p className="text-gray-600 text-justify text-lg leading-relaxed">
                                Our Venue Management Services are designed to make your event planning seamless and stress-free. From helping you find the ideal venue to managing bookings, availability, and complementary services, we ensure every detail is handled with precision. With our expertise, you can focus on creating unforgettable memories while we take care of the logistics. Let us help you host an event that exceeds your expectations!
                                </p>
                            </div>
                            <div className='h-[500px] flex justify-center'>
                                <img src={img4} className='h-full rounded-xl object-cover object-center' alt="" />
                            </div>
                        </div>
                    </section>
                    {/*end of about section */}
                    {/* {{-- contact us section --}} */}
                    
                    {/* {{--end of contact us section --}} */}



                    <Footer />

                </>
            )}

        </>
    )
}

export default Home