import React, { useRef, useEffect } from 'react'
import { FaFacebook, FaInstagram, FaLocationArrow, FaTwitter, FaWhatsapp } from 'react-icons/fa'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Footer = () => {

    const footerRef = useRef(null)
    const col1Ref = useRef(null)
    const col2Ref = useRef(null)
    const col3Ref = useRef(null)
    const col4Ref = useRef(null)
    const iconsRef = useRef(null)
    const copyRef = useRef(null)

    /* ======================================================
       ================  GSAP ANIMATION SECTION  ============
       (Sirf animation logic yahan hai, JSX ke saath mix nahi hai)
       ====================================================== */
    useEffect(() => {

        const ctx = gsap.context(() => {

            // Timeline jab footer scroll me visible ho
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                }
            })

            // Columns ek ek karke fade + slide up
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

            // Social icons pop-in effect
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

            // Copyright line halka fade
            tl.from(
                copyRef.current,
                {
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power1.out',
                },
                '-=0.2'
            )

            // Social icons par hover animation (scale + rotate)
            if (iconsRef.current) {
                const icons = iconsRef.current.querySelectorAll('.social-icon')
                icons.forEach((icon) => {
                    const enter = () =>
                        gsap.to(icon, { scale: 1.15, rotate: 8, duration: 0.3, ease: 'power2.out' })
                    const leave = () =>
                        gsap.to(icon, { scale: 1, rotate: 0, duration: 0.3, ease: 'power2.out' })

                    icon.addEventListener('mouseenter', enter)
                    icon.addEventListener('mouseleave', leave)

                    // cleanup ke liye listener store
                    icon._enter = enter
                    icon._leave = leave
                })
            }

        }, footerRef)

        // Cleanup — animations aur listeners hatane ke liye
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
    }, [])
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
                            Experience the finest culinary journey in the heart of the city.
                        </p>
                    </div>

                    {/* second */}
                    <div ref={col2Ref} className='w-56 '>
                        <h1 className='text-xl  text-white font-semibold mb-4'>Quick Link</h1>

                        <ul className='grid font-semibold text-xl text-white'>

                            <li>
                                <a href="/home">Home</a>
                            </li>

                            <li>
                                <a href="/about">About</a>
                            </li>

                            <li>
                                <a href="/menu">Menu</a>
                            </li>

                             <li>
                                <a href="/room-booking">Room</a>
                            </li>

                            <li>
                                <a href="/reservation">Reservation</a>
                            </li>

                        </ul>
                    </div>

                    {/* third */}

                    <div ref={col3Ref} className='w-56'>
                        <h1 className='font-semibold text-xl
                        mb-4  text-white '>Contact Info</h1>
                        <p className='font-semibold  text-white'>
                           Ujjain Nagri
                            info@forkandflame.com
                        </p>
                    </div>

                    {/* fourth */}

                    <div ref={col4Ref} className=' items-center gap-4 mb-6'>
                        <h1 className=' text-xl  text-white font-semibold mb-4 '>Follow Us</h1>

                        <div ref={iconsRef} className='flex items-center gap-4 mb-6 '>

                            <div className='social-icon w-12 h-12 text-white bg-red-600 rounded-full flex items-center justify-center cursor-pointer'>
                                <FaFacebook />
                            </div>

                            <div className='social-icon w-12 h-12 text-white bg-red-600 rounded-full flex items-center justify-center cursor-pointer'>
                                <FaTwitter />
                            </div>

                            <div className='social-icon w-12 h-12 text-white bg-red-600 rounded-full flex items-center justify-center cursor-pointer'>
                                <a href="https://www.instagram.com/rashmika_mandanna/?hl=en"><FaInstagram /></a>
                            </div>

                            <div className='social-icon w-12 h-12 text-white bg-red-600 rounded-full flex items-center justify-center cursor-pointer'>
                                <FaWhatsapp />
                            </div>


                        </div>

                        

                    </div>

                   

                </div>


            </div>
            <p ref={copyRef} className='text-center text-white '>© 2025 Fork&Flame. All rights reserved.</p>
        </div>
    )
}

export default Footer