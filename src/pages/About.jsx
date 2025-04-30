import React, { useEffect, useState } from 'react'
import venue from "../images/VF.png";
import img5 from "../images/5.jpg"

import Loader from '../common/Loader';
import Footer from './Footer';
import Nav from './Nav';
const About = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
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


                    {/* about section */}
                    <section className='md:px-20 px-10 py-10 mt-20'>
                        <h2 className='text-center text-3xl md:text-4xl font-bold text-[#236a9d] underline mb-12'>About Us</h2>
                        <div className='grid md:grid-cols-2 gap-10 items-center'>
                            <div class="text-center md:text-left space-y-4">
                                {/* <h2 class="text-3xl md:text-4xl font-bold text-[#236a9d]">Are you searching for the perfect venue for your event?  
                                </h2> */}
                                <p class="text-justify text-[#236a9d] font-semibold">
                                    Welcome to Venue Mangement, your trusted partner in seamless venue management and event planning. Our mission is to simplify the process of finding and managing the perfect venue for any occasion, whether it’s a wedding, corporate event, party, or conference.
                                </p>
                                <p class="text-justify text-[#236a9d] font-semibold">
                                    With a deep understanding of the challenges involved in venue selection and event coordination, we bring together technology and personalized service to deliver a hassle-free experience. From finding the ideal space to managing bookings, availability, and vendor services, we’re here to ensure every detail is taken care of.
                                </p>
                                <p class="text-justify text-[#236a9d] font-semibold">
                                    At Venue Mangement, we believe in creating unforgettable experiences for our clients. Our platform is designed with your needs in mind—offering intuitive tools, real-time availability, and expert support to make event planning effortless and enjoyable.

                                </p>
                                {/* <a href="#" class="inline-block mt-4 px-6 py-3 text-white font-semibold button-gradient rounded-full shadow-md  transition hover:bg-right">
                                    Learn More
                                </a> */}
                            </div>
                            <div className='h-[500px] flex justify-center'>
                                <img src={img5} className='h-full rounded-xl object-cover object-center' alt="" />
                            </div>
                        </div>
                    </section>
                    {/*end of about section */}



                    <div class="bg-white py-14">
                        <div class="grid lg:grid-cols-2 items-center gap-8 mx-4 md:mx-6 lg:mx-14 xl:mx-20 2xl:w-11/12 2xl:mx-auto">
                            <div class="lg:order-1 order-2 wow animated fadeInLeft">
                                <span class="text-indigo-400">WHY TRUST US?</span>
                                <h1
                                    class="xl:text-4xl md:text-3xl text-2xl  text-indigo-900 xl:leading-snug lg:leading-snug md:leading-snug sm:leading-snug leading-snug mt-4">
                                   Simplify Your Venue Management
                                </h1>
                                <p class="mt-4">
                                We understand the complexities of managing venues and booking events, which is why we provide a cutting-edge, AI-powered system to streamline your operations and enhance customer experiences. Our platform ensures seamless booking, real-time availability, and personalized assistance—all designed to make venue management stress-free and efficient.
                                </p>
                                <div class="mt-8 grid md:grid-cols-2 gap-8">
                                    <div
                                        class="slide font-semibold text-left pl-4 hover:bg-[#236a9d] duration-700 delay-50 transition-all ease-in-out bg-white hover:text-white py-4 rounded-md border-l-2 border-[#236a9d]">
                                        24/7 AI Assistance
                                    </div>
                                    <div
                                        class="slide font-semibold text-left pl-4 hover:bg-[#236a9d] duration-700 delay-50 transition-all ease-in-out bg-white hover:text-white py-4 rounded-md border-l-2 border-[#236a9d]">
                                        Effortless Booking
                                    </div>

                                    <div
                                        class="slide font-semibold text-left pl-4 hover:bg-[#236a9d] duration-700 delay-50 transition-all ease-in-out bg-white hover:text-white py-4 rounded-md border-l-2 border-[#236a9d]">
                                        Real-Time Availability
                                    </div>


                                    <div
                                        class="slide font-semibold text-left pl-4 hover:bg-[#236a9d] duration-700 delay-50 transition-all ease-in-out bg-white hover:text-white py-4 rounded-md border-l-2 border-[#236a9d]">
                                        Enhanced Customer Support
                                    </div>

                                    <div
                                        class="slide font-semibold text-left pl-4 hover:bg-[#236a9d] duration-700 delay-50 transition-all ease-in-out bg-white hover:text-white py-4 rounded-md border-l-2 border-[#236a9d]">
                                        Integrated Vendor Services
                                    </div>


                                    <div
                                        class="slide font-semibold text-left pl-4 hover:bg-[#236a9d] duration-700 delay-50 transition-all ease-in-out bg-white hover:text-white py-4 rounded-md border-l-2 border-[#236a9d]">
                                        Streamlined Management
                                    </div>

                                </div>
                            </div>

                            <div class="lg:order-2 order-1 wow animated fadeInRight">
                                <img class="2xl:w-full xl:w-[80rem] w-full" src={venue} alt="" />
                            </div>
                        </div>
                    </div>






                    <Footer />

                </>
            )}

        </>
    )
}

export default About