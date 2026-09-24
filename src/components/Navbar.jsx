import React, { useState } from 'react'
import { FaXmark } from "react-icons/fa6";
import { Link } from "react-router-dom"
import { FaBars } from "react-icons/fa"
import { FaCircleUser } from "react-icons/fa6"
import { useAuth } from "../context/AuthContext"


const Navbar = () => {

    const [showMenu, setshowMenu] = useState()
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout()
        setShowProfileMenu(false)
    }

    return (
        <div className='shadow-md sticky top-0 z-50 backdrop-blur-3xl'>
            <div className='contianer mx-auto px-3 sm:px-6 md:px-8 lg:px-10 xl:px-16'>

                <div className='flex justify-between items-center py-2 gap-2'>
                    {/* logo */}
                    <div className='flex items-center gap-1 text-lg sm:text-2xl font-bold shrink-0'>
                        <img className='w-8 h-8 sm:w-12 sm:h-12' src="./logo2.png" alt="logo" />
                        <h1 className='text-red-600 whitespace-nowrap'>
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

                        {/* Login / Signup - agar user login nahi hai, warna profile icon */}
                        <div className='relative flex items-center gap-3 pl-4 ml-2 border-l border-blue-950/20'>
                            {user ? (
                                <div className='relative'>
                                    <button
                                        onClick={() => setShowProfileMenu((s) => !s)}
                                        className='flex items-center justify-center hover:scale-110 duration-300'
                                    >
                                        <FaCircleUser className='text-3xl text-red-600' />
                                    </button>

                                    {showProfileMenu && (
                                        <div className='absolute right-0 top-12 w-56 bg-white shadow-xl rounded-xl border border-gray-100 py-3 px-4 z-50'>
                                            <p className='font-semibold text-blue-950 truncate'>{user.name}</p>
                                            <p className='text-sm text-gray-500 truncate'>{user.email}</p>
                                            <button
                                                onClick={handleLogout}
                                                className='mt-3 w-full text-sm font-semibold text-red-600 border border-red-600 rounded-full py-1.5 hover:bg-red-600 hover:text-white duration-300'
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <Link
                                        className='border-2 border-red-600 text-red-600 px-4 py-1 rounded-full font-semibold hover:bg-red-600 hover:text-white duration-300 active:scale-95'
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
                                </>
                            )}
                        </div>

                    </nav>

                    {/* mobile: Login/Signup ya profile icon + hamburger - hamesha direct dikhega */}
                    <div className='md:hidden flex items-center gap-1.5 relative shrink-0'>
                        {user ? (
                            <div className='relative'>
                                <button onClick={() => setShowProfileMenu((s) => !s)}>
                                    <FaCircleUser className='text-2xl text-red-600' />
                                </button>

                                {showProfileMenu && (
                                    <div className='absolute right-0 top-9 w-52 bg-white shadow-xl rounded-xl border border-gray-100 py-3 px-4 z-50'>
                                        <p className='font-semibold text-blue-950 text-sm truncate'>{user.name}</p>
                                        <p className='text-xs text-gray-500 truncate'>{user.email}</p>
                                        <button
                                            onClick={handleLogout}
                                            className='mt-2 w-full text-xs font-semibold text-red-600 border border-red-600 rounded-full py-1 hover:bg-red-600 hover:text-white duration-300'
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className='border-2 border-red-600 text-red-600 text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap hover:bg-red-600 hover:text-white duration-300'
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/signup"
                                    className='bg-red-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap hover:bg-red-700 duration-300'
                                >
                                    Sign up
                                </Link>
                            </>
                        )}

                        {
                            showMenu ?
                                <FaXmark onClick={() => setshowMenu(!showMenu)} className='text-lg cursor-pointer ml-1' /> :
                                <FaBars onClick={() => setshowMenu(!showMenu)} className='text-lg cursor-pointer ml-1' />
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