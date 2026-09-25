import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap';
import { FaXmark } from "react-icons/fa6";
import { Link, NavLink } from "react-router-dom"
import { FaBars } from "react-icons/fa"
import { FaCircleUser } from "react-icons/fa6"
import { useAuth } from "../context/AuthContext"


const Navbar = () => {

    const [showMenu, setshowMenu] = useState()
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const { user, logout } = useAuth()

    // Scroll-based navbar look — false = top of page
    // (transparent), true = scrolled down (solid +
    // blurred + shadow)
    const [isScrolled, setIsScrolled] = useState(false)

    // Refs for GSAP
    const navRef = useRef(null)
    const mobileMenuRef = useRef(null)
    const mobileLinkRefs = useRef([])
    mobileLinkRefs.current = []

    const addMobileLinkRef = (el) => {
        if (el && !mobileLinkRefs.current.includes(el)) {
            mobileLinkRefs.current.push(el)
        }
    }

    const handleLogout = () => {
        logout()
        setShowProfileMenu(false)
    }


    // ==============================
    // GSAP START — navbar entrance
    // Page load hote hi navbar upar se
    // halka sa slide + fade karke aata hai
    // ==============================

    useEffect(() => {

        const ctx = gsap.context(() => {

            gsap.fromTo(
                navRef.current,
                { y: -40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
            );

        }, navRef);

        return () => ctx.revert();

    }, []);

    // ==============================
    // GSAP END — navbar entrance
    // ==============================


    // ==============================
    // Scroll listener
    // Sirf tab state update karte hain jab
    // "scrolled" boolean flip hoti hai —
    // isse GSAP animation baar baar trigger
    // nahi hoti, sirf jab zaroorat ho.
    // ==============================

    useEffect(() => {

        const handleScroll = () => {
            const scrolled = window.scrollY > 20;

            setIsScrolled((prev) =>
                prev === scrolled ? prev : scrolled
            );
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Page kisi scroll position par already
        // load ho (jaise refresh on scrolled page)
        handleScroll();

        return () =>
            window.removeEventListener('scroll', handleScroll);

    }, []);


    // ==============================
    // GSAP START — navbar color/shadow
    // transition on scroll
    // Upar: transparent, koi shadow nahi.
    // Scroll ke baad: white blurred
    // background + soft shadow — smooth
    // tween ke saath, abrupt jump nahi.
    // ==============================

    useEffect(() => {

        const ctx = gsap.context(() => {

            gsap.to(navRef.current, {
                backgroundColor: isScrolled
                    ? 'rgba(255, 255, 255, 0.85)'
                    : 'rgba(255, 255, 255, 0)',
                boxShadow: isScrolled
                    ? '0 4px 24px rgba(15, 23, 42, 0.08)'
                    : '0 0 0 rgba(15, 23, 42, 0)',
                duration: 0.4,
                ease: 'power2.out',
            });

            // backdrop blur GSAP se smoothly tween
            // nahi hoti (browser support ke wajah
            // se), isliye seedha set karte hain —
            // baaki sab (bg/shadow) tween hi rahega
            if (navRef.current) {
                navRef.current.style.backdropFilter = isScrolled
                    ? 'blur(14px)'
                    : 'blur(0px)';
                navRef.current.style.webkitBackdropFilter = isScrolled
                    ? 'blur(14px)'
                    : 'blur(0px)';
            }

        }, navRef);

        return () => ctx.revert();

    }, [isScrolled]);

    // ==============================
    // GSAP END — navbar color/shadow
    // transition on scroll
    // ==============================


    // ==============================
    // GSAP START — mobile menu entrance
    // Jab hamburger se mobile menu khulta
    // hai, links ek-ek karke (stagger)
    // fade + slide karke aate hain.
    // ==============================

    useEffect(() => {

        if (!showMenu || mobileLinkRefs.current.length === 0) return;

        const ctx = gsap.context(() => {

            gsap.fromTo(
                mobileLinkRefs.current,
                { opacity: 0, y: 16 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power3.out',
                    stagger: 0.08,
                }
            );

        }, mobileMenuRef);

        return () => ctx.revert();

    }, [showMenu]);

    // ==============================
    // GSAP END — mobile menu entrance
    // ==============================


    return (
        <div
            ref={navRef}
            className='sticky top-0 z-50'
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0)',
                boxShadow: '0 0 0 rgba(15, 23, 42, 0)',
            }}
        >
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
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `font-semibold hover:scale-110 duration-300 active:scale-95 ${
                                    isActive ? 'text-red-600' : 'hover:text-red-600'
                                }`
                            }
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/about"
                            className={({ isActive }) =>
                                `font-semibold hover:scale-110 duration-300 active:scale-95 ${
                                    isActive ? 'text-red-600' : 'hover:text-red-600'
                                }`
                            }
                        >
                            About
                        </NavLink>

                        <NavLink
                            to="/menu"
                            className={({ isActive }) =>
                                `font-semibold hover:scale-110 duration-300 active:scale-95 ${
                                    isActive ? 'text-red-600' : 'hover:text-red-600'
                                }`
                            }
                        >
                            Menu
                        </NavLink>

                        <NavLink
                            to="/roombooking"
                            className={({ isActive }) =>
                                `font-semibold hover:scale-110 duration-300 active:scale-95 ${
                                    isActive ? 'text-red-600' : 'hover:text-red-600'
                                }`
                            }
                        >
                            Room-Booking
                        </NavLink>

                        <NavLink
                            to="/reservation"
                            className={({ isActive }) =>
                                `font-semibold hover:scale-110 duration-300 active:scale-95 ${
                                    isActive ? 'text-red-600' : 'hover:text-red-600'
                                }`
                            }
                        >
                            Table-Reservation
                        </NavLink>

                        <NavLink
                            to="/contact"
                            className={({ isActive }) =>
                                `font-semibold hover:scale-110 duration-300 active:scale-95 ${
                                    isActive ? 'text-red-600' : 'hover:text-red-600'
                                }`
                            }
                        >
                            Contact
                        </NavLink>

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
                    <div
                        ref={mobileMenuRef}
                        className='md:hidden flex flex-col items-center space-y-6 py-20 h-screen bg-white'
                    >
                        <NavLink
                            ref={addMobileLinkRef}
                            onClick={() => setshowMenu(!showMenu)}
                            to="/"
                            end
                            className={({ isActive }) =>
                                `font-semibold hover:scale-110 duration-300 active:scale-95 ${
                                    isActive ? 'text-red-600' : 'hover:text-red-600'
                                }`
                            }
                        >
                            Home
                        </NavLink>

                        <NavLink
                            ref={addMobileLinkRef}
                            onClick={() => setshowMenu(!showMenu)}
                            to="/about"
                            className={({ isActive }) =>
                                `font-semibold hover:scale-110 duration-300 active:scale-95 ${
                                    isActive ? 'text-red-600' : 'hover:text-red-600'
                                }`
                            }
                        >
                            About
                        </NavLink>

                        <NavLink
                            ref={addMobileLinkRef}
                            onClick={() => setshowMenu(!showMenu)}
                            to="/menu"
                            className={({ isActive }) =>
                                `font-semibold hover:scale-110 duration-300 active:scale-95 ${
                                    isActive ? 'text-red-600' : 'hover:text-red-600'
                                }`
                            }
                        >
                            Menu
                        </NavLink>

                        <NavLink
                            ref={addMobileLinkRef}
                            onClick={() => setshowMenu(!showMenu)}
                            to="/roombooking"
                            className={({ isActive }) =>
                                `font-semibold hover:scale-110 duration-300 transition-all active:scale-95 ${
                                    isActive ? 'text-red-600' : 'hover:text-red-600'
                                }`
                            }
                        >
                            Room-Booking
                        </NavLink>

                        <NavLink
                            ref={addMobileLinkRef}
                            onClick={() => setshowMenu(!showMenu)}
                            to="/reservation"
                            className={({ isActive }) =>
                                `font-semibold hover:scale-110 duration-300 active:scale-95 ${
                                    isActive ? 'text-red-600' : 'hover:text-red-600'
                                }`
                            }
                        >
                            Table-Reservation
                        </NavLink>

                        <NavLink
                            ref={addMobileLinkRef}
                            onClick={() => setshowMenu(!showMenu)}
                            to="/contact"
                            className={({ isActive }) =>
                                `font-semibold hover:scale-110 duration-300 transition-all active:scale-95 ${
                                    isActive ? 'text-red-600' : 'hover:text-red-600'
                                }`
                            }
                        >
                            Contact
                        </NavLink>



                    </div>

                )
            }
        </div>
    )
}

export default Navbar;


