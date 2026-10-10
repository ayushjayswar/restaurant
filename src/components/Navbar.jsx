import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap';
import { FaXmark } from "react-icons/fa6";
import { Link, NavLink, useLocation } from "react-router-dom"
import { FaBars } from "react-icons/fa"
import { FaCircleUser } from "react-icons/fa6"
import { useAuth } from "../context/AuthContext"

const LINKS = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About' },
    { to: '/menu', label: 'Menu' },
    { to: '/roombooking', label: 'Room-Booking' },
    { to: '/reservation', label: 'Table-Reservation' },
    { to: '/contact', label: 'Contact' },
]

const navLinkClass = ({ isActive }) =>
    `text-sm font-medium pb-1 border-b-2 duration-300 whitespace-nowrap ${
        isActive
            ? 'text-[#F4EFE6] border-[#FF7A45]'
            : 'text-[#F4EFE6]/80 border-transparent hover:text-[#F4EFE6]'
    }`

const mobileLinkClass = ({ isActive }) =>
    `text-lg font-medium duration-300 ${
        isActive ? 'text-[#FF7A45]' : 'text-[#F4EFE6]'
    }`

const Navbar = () => {

    const [showMenu, setshowMenu] = useState(false)
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const { user, logout } = useAuth()
    const { pathname } = useLocation()

    // Sirf Home page par navbar hero ke upar transparent rehta hai.
    // Baaki pages par aur scroll karne ke baad dark solid ho jaata hai.
    const isHome = pathname === '/'
    const [isScrolled, setIsScrolled] = useState(false)
    const isSolid = !isHome || isScrolled || showMenu

    // Refs for GSAP
    const navRef = useRef(null)
    const mobileMenuRef = useRef(null)
    const mobileLinkRefs = useRef([])
    const firstRun = useRef(true)
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

    // Page badalne par mobile menu band
    useEffect(() => {
        setshowMenu(false)
        setShowProfileMenu(false)
    }, [pathname])


    // ==============================
    // GSAP START — navbar entrance
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


    // Scroll listener: sirf tab state badalti hai jab boolean flip ho
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 20;
            setIsScrolled((prev) => (prev === scrolled ? prev : scrolled));
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    // ==============================
    // GSAP START — navbar background
    // Transparent <-> dark solid, smooth tween
    // ==============================
    useEffect(() => {
        if (!navRef.current) return;

        gsap.to(navRef.current, {
            backgroundColor: isSolid
                ? 'rgba(23, 17, 13, 0.92)'
                : 'rgba(23, 17, 13, 0)',
            boxShadow: isSolid
                ? '0 4px 24px rgba(0, 0, 0, 0.35)'
                : '0 0 0 rgba(0, 0, 0, 0)',
            duration: firstRun.current ? 0 : 0.4,
            ease: 'power2.out',
            overwrite: 'auto',
        });
        firstRun.current = false;

        navRef.current.style.backdropFilter = isSolid ? 'blur(14px)' : 'blur(0px)';
        navRef.current.style.webkitBackdropFilter = isSolid ? 'blur(14px)' : 'blur(0px)';
    }, [isSolid]);
    // ==============================
    // GSAP END — navbar background
    // ==============================


    // ==============================
    // GSAP START — mobile menu entrance
    // ==============================
    useEffect(() => {
        if (!showMenu || mobileLinkRefs.current.length === 0) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                mobileLinkRefs.current,
                { opacity: 0, y: 16 },
                { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', stagger: 0.08 }
            );
        }, mobileMenuRef);

        return () => ctx.revert();
    }, [showMenu]);
    // ==============================
    // GSAP END — mobile menu entrance
    // ==============================


    const authButtons = (small) => (
        <>
            <Link
                to="/signup"
                className={`border border-[#FF7A45] text-[#FF7A45] rounded-full font-medium whitespace-nowrap hover:bg-[#FF7A45] hover:text-[#17110D] duration-300 active:scale-95 ${
                    small ? 'text-xs px-3 py-1' : 'text-sm px-4 py-1.5'
                }`}
            >
                Sign up
            </Link>
            <Link
                to="/login"
                className={`bg-[#FF7A45] text-[#17110D] rounded-full font-medium whitespace-nowrap hover:bg-[#ff9368] duration-300 active:scale-95 ${
                    small ? 'text-xs px-3 py-1' : 'text-sm px-4 py-1.5'
                }`}
            >
                Login
            </Link>
        </>
    )

    const profileMenu = (small) => (
        <div className='relative'>
            <button
                onClick={() => setShowProfileMenu((s) => !s)}
                className='flex items-center justify-center hover:scale-110 duration-300'
                aria-label='Account menu'
            >
                <FaCircleUser className={`${small ? 'text-2xl' : 'text-3xl'} text-[#FF7A45]`} />
            </button>

            {showProfileMenu && (
                <div className={`absolute right-0 ${small ? 'top-9 w-52' : 'top-12 w-56'} bg-white shadow-xl rounded-xl border border-gray-100 py-3 px-4 z-50`}>
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
    )


    return (
        <>
        {/* Home ke alawa pages par navbar fixed hai, isliye content ko neeche rakhne ke liye jagah */}
        {!isHome && <div className='h-12 sm:h-16' aria-hidden='true' />}
        <div ref={navRef} className='fixed top-0 inset-x-0 z-50'>
            <div className='mx-auto px-3 sm:px-6 lg:px-10 xl:px-16'>

                <div className='flex justify-between items-center py-2 gap-2'>

                    {/* logo */}
                    <Link to="/" className='flex items-center gap-1 text-lg sm:text-2xl font-bold shrink-0'>
                        <img
                            className='w-8 h-8 sm:w-12 sm:h-12 brightness-0 invert'
                            src="./logo2.png"
                            alt="logo"
                        />
                        <h1 className='whitespace-nowrap text-[#ff4d4d]'>
                            For&amp;<span className='text-[#F4EFE6]'>Flame</span>
                        </h1>
                    </Link>

                    {/* desktop links */}
                    <nav className='hidden lg:flex items-center gap-6'>
                        {LINKS.map((l) => (
                            <NavLink key={l.to} to={l.to} end={l.end} className={navLinkClass}>
                                {l.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* desktop: auth buttons ya profile */}
                    <div className='hidden lg:flex items-center gap-2'>
                        {user ? profileMenu(false) : authButtons(false)}
                    </div>

                    {/* mobile: auth ya profile + hamburger */}
                    <div className='lg:hidden flex items-center gap-1.5 relative shrink-0'>
                        {user ? profileMenu(true) : authButtons(true)}

                        {showMenu ? (
                            <FaXmark
                                onClick={() => setshowMenu(false)}
                                className='text-xl cursor-pointer ml-1 text-[#F4EFE6]'
                            />
                        ) : (
                            <FaBars
                                onClick={() => setshowMenu(true)}
                                className='text-xl cursor-pointer ml-1 text-[#F4EFE6]'
                            />
                        )}
                    </div>

                </div>
            </div>

            {showMenu && (
                <div
                    ref={mobileMenuRef}
                    className='lg:hidden flex flex-col items-center space-y-6 py-12 h-[calc(100svh-3rem)] overflow-y-auto bg-[#17110D]'
                >
                    {LINKS.map((l) => (
                        <NavLink
                            key={l.to}
                            ref={addMobileLinkRef}
                            to={l.to}
                            end={l.end}
                            onClick={() => setshowMenu(false)}
                            className={mobileLinkClass}
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
        </>
    )
}

export default Navbar;