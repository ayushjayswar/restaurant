import React, { useState } from 'react'
import { FaXmark } from "react-icons/fa6";
import { Link } from "react-router-dom"
import { FaBars } from "react-icons/fa"


const Navbar = () => {

    const [showMenu, setshowMenu] = useState()

    return (
        <div className='shadow-md sticky top-0 z-50 backdrop-blur-3xl'>
            <div className='contianer mx-auto px-6 sm:px-8 md:px-12 lg:px-24'>

                <div className='flex justify-between items-center py-2'>
                    {/* logo */}
                    <div className='flex items-center text-2xl font-bold'>
                        <img className='w-12 h-12' src="./logo2.png" alt="logo" />
                        <h1 className='text-red-600'>
                            For&<span className='text-[#1e3a8a]'>Flame</span>
                        </h1>
                    </div>
                    {/* nav link */}
                    <nav className=' hidden md:flex  item-center space-x-6 text-blue-950'>
                        <Link className='font-semibold  hover:text-red-600 hover:scale-110 duration-300 active:scale-95' to="/">
                            Home</Link>

                        <Link className='font-semibold  hover:text-red-600 hover:scale-110 duration-300 active:scale-95' to="/about">
                            About</Link>

                        <Link className='font-semibold  hover:text-red-600 hover:scale-110 duration-300 active:scale-95' to="/menu">
                            Menu</Link>

                        <Link className='font-semibold  hover:text-red-600 hover:scale-110 duration-300 active:scale-95' to="/roombooking">
                            Room-Booking</Link>

                        <Link className='font-semibold  hover:text-red-600 hover:scale-110 duration-300 active:scale-95' to="/reservation">
                            Table-Reservation</Link>

                        <Link className='font-semibold  hover:text-red-600 hover:scale-110 duration-300 active:scale-95' to="/contact">
                            Contact</Link>

                        {/* Login / Signup - desktop nav ke andar */}
                        <div className='flex items-center gap-3 pl-4 ml-2 border-l border-blue-950/20'>
                            <Link
                                className='bg-red-600 text-white px-4 py-1.5 rounded-full font-semibold hover:bg-red-700 hover:scale-105 duration-300 active:scale-95'
                                to="/login"
                            >
                                Login
                            </Link>

                            <Link
                                className='bg-red-600 text-white px-4 py-1.5 rounded-full font-semibold hover:bg-red-700 hover:scale-105 duration-300 active:scale-95'
                                to="/signup"
                            >
                                Sign up
                            </Link>
                        </div>

                    </nav>

                    {/* mobile: Login/Signup + hamburger - hamesha direct dikhega, dropdown ke andar nahi */}
                    <div className='md:hidden flex items-center gap-2'>
                        <Link
                            to="/login"
                            className='border-2 border-red-600 text-red-600 text-sm px-3 py-1 rounded-full font-semibold hover:bg-red-600 hover:text-white duration-300'
                        >
                            Login
                        </Link>

                        <Link
                            to="/signup"
                            className='bg-red-600 text-white text-sm px-3 py-1.5 rounded-full font-semibold hover:bg-red-700 duration-300'
                        >
                            Sign up
                        </Link>

                        {
                            showMenu ?
                                <FaXmark onClick={() => setshowMenu(!showMenu)} className='text-xl cursor-pointer ' /> :
                                <FaBars onClick={() => setshowMenu(!showMenu)} className='text-xl cursor-pointer ' />
                        }
                    </div>

                </div>

            </div>
            {
                showMenu && (
                    <div className='md:hidden flex flex-col items-center space-y-6 py-20 h-screen'>
                        <Link onClick={() => setshowMenu(!showMenu)} className='font-semibold  hover:text-red-600 hover:scale-110 duration-300 active:scale-95' to="/">
                            Home</Link>

                        <Link onClick={() => setshowMenu(!showMenu)} className='font-semibold  hover:text-red-600 hover:scale-110 duration-300 active:scale-95' to="/about">
                            About</Link>

                        <Link onClick={() => setshowMenu(!showMenu)} className='font-semibold  hover:text-red-600 hover:scale-110 duration-300 active:scale-95' to="/menu">
                            Menu</Link>

                         <Link onClick={() => setshowMenu(!showMenu)} className='font-semibold  hover:text-red-600 hover:scale-110 duration-300 transition-all active:scale-95' to="/roombooking">
                            Room-Booking</Link>

                        <Link onClick={() => setshowMenu(!showMenu)} className='font-semibold  hover:text-red-600 hover:scale-110 duration-300 active:scale-95' to="/reservation">
                            Table-Reservation</Link>


                        <Link onClick={() => setshowMenu(!showMenu)} className='font-semibold  hover:text-red-600 hover:scale-110 duration-300 transition-all active:scale-95' to="/contact">
                            Contact</Link> 

                       


                    </div>

                )
            }
        </div>
    )
}

export default Navbar