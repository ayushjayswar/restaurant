import React, { useRef, useEffect, useState } from 'react'
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// const API_URL = "http://127.0.0.1:8000";
const API_URL = "https://lcd-dressing-jim-oven.trycloudflare.com"

const SOCIAL_ICONS = {
    facebook: FaFacebook,
    twitter: FaTwitter,
    instagram: FaInstagram,
    whatsapp: FaWhatsapp,
};

// Shown while /content hasn't loaded yet, or if the request fails.
const DEFAULT_FOOTER = {
    tagline: "Experience the finest culinary journey in the heart of the city.",
    address: "Ujjain Nagri",
    email: "info@forkandflame.com",
    socials: [
        { platform: "facebook", url: "#" },
        { platform: "twitter", url: "#" },
        { platform: "instagram", url: "https://www.instagram.com/rashmika_mandanna/?hl=en" },
        { platform: "whatsapp", url: "#" },
    ],
    links: [
        { label: "Home", url: "/home" },
        { label: "About", url: "/about" },
        { label: "Menu", url: "/menu" },
        { label: "Room", url: "/roombooking" },
        { label: "Reservation", url: "/reservation" },
        { label: "Contact", url: "/contact" },
    ],
};

const Footer = () => {

    const [footer, setFooter] = useState(DEFAULT_FOOTER);
    const [loaded, setLoaded] = useState(false);

    const footerRef = useRef(null)
    const col1Ref = useRef(null)
    const col2Ref = useRef(null)
    const col3Ref = useRef(null)
    const col4Ref = useRef(null)
    const iconsRef = useRef(null)
    const copyRef = useRef(null)

    // ==============================
    // GET FOOTER CONTENT FROM BACKEND
    // (admin-edited tagline, address, email, socials, links)
    // ==============================
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`${API_URL}/content`);
                if (!response.ok) return;

                const result = await response.json();
                if (result.footer) {
                    setFooter(result.footer);
                }
            } catch (err) {
                console.error("Site content fetch error:", err);
            } finally {
                setLoaded(true);
            }
        };

        fetchContent();
    }, []);

    /* ======================================================
       ================  GSAP ANIMATION SECTION  ============
       ====================================================== */
    useEffect(() => {

        if (!loaded) return;

        const ctx = gsap.context(() => {

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                }
            })

            tl.from(
                [col1Ref.current, col2Ref.current, col3Ref.current, col4Ref.current],
                {
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    stagger: 0.15,
                }
            )

            tl.from(
                iconsRef.current ? iconsRef.current.children : [],
                {
                    scale: 0,
                    opacity: 0,
                    duration: 0.5,
                    ease: 'back.out(2)',
                    stagger: 0.1,
                },
                '-=0.4'
            )

            tl.from(
                copyRef.current,
                {
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power1.out',
                },
                '-=0.2'
            )

            if (iconsRef.current) {
                const icons = iconsRef.current.querySelectorAll('.social-icon')
                icons.forEach((icon) => {
                    const enter = () =>
                        gsap.to(icon, { scale: 1.15, rotate: 8, duration: 0.3, ease: 'power2.out' })
                    const leave = () =>
                        gsap.to(icon, { scale: 1, rotate: 0, duration: 0.3, ease: 'power2.out' })

                    icon.addEventListener('mouseenter', enter)
                    icon.addEventListener('mouseleave', leave)

                    icon._enter = enter
                    icon._leave = leave
                })
            }

        }, footerRef)

        return () => {
            if (iconsRef.current) {
                const icons = iconsRef.current.querySelectorAll('.social-icon')
                icons.forEach((icon) => {
                    if (icon._enter) icon.removeEventListener('mouseenter', icon._enter)
                    if (icon._leave) icon.removeEventListener('mouseleave', icon._leave)
                })
            }
            ctx.revert()
        }
    }, [loaded])
    /* ================  GSAP SECTION END  ================== */


    return (
        <div ref={footerRef} className='py-2 bg-black '>
            <div className='container ma-auto px-6'>
                <div className='flex  justify-between gap-10 md:flex-row flex-col'>

                    {/* first */}
                    <div ref={col1Ref} className='w-56'>
                        <h1 className='font-semibold text-xl mb-4 text-white'>Fork&
                            <span className='text-red-700'>Flame</span>
                        </h1>
                        <p className='font-semibold  text-white '>
                            {footer.tagline}
                        </p>
                    </div>

                    {/* second */}
                    <div ref={col2Ref} className='w-56 '>
                        <h1 className='text-xl  text-white font-semibold mb-4'>Quick Link</h1>

                        <ul className='font-semibold text-xl text-white'>
                            {footer.links.map((link, i) => (
                                <li key={i}>
                                    <a href={link.url}>{link.label}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* third */}

                    <div ref={col3Ref} className='w-56'>
                        <h1 className='font-semibold text-xl
                        mb-4  text-white '>Contact Info</h1>
                        <p className='font-semibold  text-white'>
                           {footer.address}
                            <br />
                            {footer.email}
                        </p>
                    </div>

                    {/* fourth */}

                    <div ref={col4Ref} className=' items-center gap-4 mb-6'>
                        <h1 className=' text-xl  text-white font-semibold mb-4 '>Follow Us</h1>

                        <div ref={iconsRef} className='flex items-center gap-4 mb-6 '>

                            {footer.socials.map((social, i) => {
                                const Icon = SOCIAL_ICONS[social.platform] || FaFacebook;

                                return (
                                    <a
                                        key={i}
                                        href={social.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className='social-icon w-12 h-12 text-white bg-red-600 rounded-full flex items-center justify-center cursor-pointer'
                                    >
                                        <Icon />
                                    </a>
                                );
                            })}

                        </div>



                    </div>



                </div>


            </div>
            <p ref={copyRef} className='text-center text-white '>© 2025 Fork&Flame. All rights reserved.</p>
        </div>
    )
}

export default Footer