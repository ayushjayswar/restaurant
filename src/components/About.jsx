import React, { useEffect, useRef } from 'react'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaUtensils, FaWineGlassAlt } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const About = () => {

    // Refs — section scope + each part of the layout as its own target
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const eyebrowRef = useRef(null);
    const imageWrapRef = useRef(null);
    const imageRef = useRef(null);
    const textRef = useRef(null);
    const particlesRef = useRef(null);
    const badgeRefs = useRef([]);
    badgeRefs.current = [];

    // Refs for the word-by-word heading reveal
    const wordRefs = useRef([]);
    wordRefs.current = [];

    // Refs for the paragraph blur/slide reveal
    const paraRefs = useRef([]);
    paraRefs.current = [];

    const addBadgeRef = (el) => {
        if (el && !badgeRefs.current.includes(el)) {
            badgeRefs.current.push(el);
        }
    };

    const addWordRef = (el) => {
        if (el && !wordRefs.current.includes(el)) {
            wordRefs.current.push(el);
        }
    };

    const addParaRef = (el) => {
        if (el && !paraRefs.current.includes(el)) {
            paraRefs.current.push(el);
        }
    };

    const headingWords = "A Culinary Journey".split(" ");

    const paragraph1 = "Founded in 2010, Fork & Flame brings together world-class chefs and sommeliers to create an unforgettable dining experience. Our philosophy is simple: exceptional food, impeccable service, and a warm atmosphere.";

    const paragraph2 = "We source our ingredients from local farmers and producers, ensuring the freshest seasonal dishes that celebrate the region's bounty while supporting our community.";

    // ==============================
    // GSAP START
    // Entrance plays when the section scrolls into view (not just on
    // mount), so it actually fires even if About sits below the fold.
    // Reversible on scroll-back-up, like the RoomBooking panels.
    // ==============================
    useEffect(() => {
        const reduceMotion =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const ctx = gsap.context(() => {

            if (reduceMotion) {
                gsap.set(
                    [eyebrowRef.current, headingRef.current, imageRef.current, wordRefs.current, paraRefs.current, badgeRefs.current],
                    { opacity: 1, x: 0, y: 0, yPercent: 0, clipPath: 'inset(0 0% 0 0)', filter: 'blur(0px)' }
                );
                return;
            }

            // Image starts fully masked (like a curtain) and image itself
            // is scaled up slightly so the reveal has room to settle.
            gsap.set(imageRef.current, { scale: 1.15 });
            gsap.set(imageWrapRef.current, { clipPath: 'inset(0 100% 0 0)' });
            gsap.set(wordRefs.current, { yPercent: 120 });
            gsap.set(paraRefs.current, { opacity: 0, y: 18, filter: 'blur(6px)' });
            gsap.set(badgeRefs.current, { opacity: 0, y: 14, scale: 0.9 });
            gsap.set([eyebrowRef.current, headingRef.current], { opacity: 0, y: -16 });

            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },
            });

            tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 })
                .to(headingRef.current, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
                .to(imageWrapRef.current, {
                    clipPath: 'inset(0 0% 0 0)',
                    duration: 1.1,
                    ease: 'power4.inOut',
                }, '-=0.2')
                .to(imageRef.current, {
                    scale: 1,
                    duration: 1.3,
                    ease: 'power3.out',
                }, '<')
                // Heading words — each rises up from behind its own mask
                .to(
                    wordRefs.current,
                    { yPercent: 0, duration: 0.7, stagger: 0.12, ease: 'power4.out' },
                    '-=0.8'
                )
                // Paragraphs — soft blur + slide reveal, one after another
                .to(
                    paraRefs.current,
                    {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        duration: 0.6,
                        stagger: 0.2,
                        ease: 'power2.out',
                    },
                    '-=0.35'
                )
                .to(
                    badgeRefs.current,
                    { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.15, ease: 'back.out(1.7)' },
                    '-=0.2'
                );

            // Slow parallax drift on the image while the section is in view
            gsap.to(imageRef.current, {
                yPercent: 8,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            // A handful of drifting embers in the background, same feel
            // as the RoomBooking hero
            const field = particlesRef.current;
            if (field) {
                const count = 12;
                for (let i = 0; i < count; i++) {
                    const dot = document.createElement('span');
                    dot.style.position = 'absolute';
                    dot.style.bottom = '0';
                    dot.style.borderRadius = '50%';
                    dot.style.background = 'radial-gradient(circle, #FF7A45, transparent 70%)';
                    const size = gsap.utils.random(2, 5);
                    dot.style.width = `${size}px`;
                    dot.style.height = `${size}px`;
                    dot.style.left = `${gsap.utils.random(0, 100)}%`;
                    field.appendChild(dot);

                    gsap.set(dot, { y: gsap.utils.random(10, 90) + '%', opacity: 0 });
                    gsap.to(dot, {
                        opacity: gsap.utils.random(0.25, 0.6),
                        duration: gsap.utils.random(6, 12),
                        delay: gsap.utils.random(0, 6),
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                    });
                    gsap.to(dot, {
                        x: gsap.utils.random(-25, 25),
                        duration: gsap.utils.random(4, 8),
                        repeat: -1,
                        yoyo: true,
                        ease: 'sine.inOut',
                    });
                }
            }

        }, sectionRef);

        return () => ctx.revert(); // GSAP end — kill tweens + ScrollTriggers on unmount
    }, []);
    // ==============================
    // GSAP END
    // ==============================

    // Small hover-tilt feedback on the badges
    const handleBadgeEnter = (el) => {
        if (!el) return;
        gsap.to(el, { y: -4, scale: 1.04, duration: 0.25, ease: 'power2.out' });
    };
    const handleBadgeLeave = (el) => {
        if (!el) return;
        gsap.to(el, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
    };

    return (
        <section
            id='about'
            ref={sectionRef}
            className='relative bg-[#17110D] text-[#F4EFE6] font-[Inter,system-ui,sans-serif] py-6 overflow-hidden'
        >
            <div ref={particlesRef} className='absolute inset-0 overflow-hidden pointer-events-none' />

            <div className='relative z-10 mx-auto px-6 container'>

                {/* Heading section */}
                <div className='text-center mb-14'>
                    <div ref={eyebrowRef} className='text-[#B08D57] text-sm tracking-wide mb-4'>
                        Fork &amp; Flame · Our Story
                    </div>
                    <h1
                        ref={headingRef}
                        className='font-[Fraunces,serif] font-medium text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]'
                    >
                        Our Story
                    </h1>
                </div>

                <div className='flex flex-col md:flex-row items-center gap-14'>

                    {/* left side — image section */}
                    <div className='md:w-1/2'>
                        <div
                            ref={imageWrapRef}
                            className='relative rounded-xl overflow-hidden after:content-[""] after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/40 after:to-transparent after:pointer-events-none'
                        >
                            <img
                                ref={imageRef}
                                className='w-full h-full object-cover'
                                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
                                alt=""
                            />
                        </div>
                    </div>

                    {/* right side — text section */}
                    <div ref={textRef} className='md:w-1/2'>

                        {/* Heading — each word masked in its own overflow-hidden box so it rises up cleanly, no jump */}
                        <h3 className='flex flex-wrap gap-x-3 font-[Fraunces,serif] font-medium text-[clamp(1.8rem,3.6vw,2.6rem)] py-2'>
                            {headingWords.map((word, i) => (
                                <span key={i} className='inline-block overflow-hidden pb-1'>
                                    <span ref={addWordRef} className='inline-block text-[#F4EFE6]'>
                                        {word}
                                    </span>
                                </span>
                            ))}
                        </h3>

                        <p ref={addParaRef} className='text-[#F4EFE6]/75 leading-relaxed py-5'>{paragraph1}</p>

                        <p ref={addParaRef} className='text-[#F4EFE6]/75 leading-relaxed pb-5'>{paragraph2}</p>

                        {/* button section div */}
                        <div className='flex space-x-6 items-center'>
                            <div
                                ref={addBadgeRef}
                                onMouseEnter={(e) => handleBadgeEnter(e.currentTarget)}
                                onMouseLeave={(e) => handleBadgeLeave(e.currentTarget)}
                                className='flex items-center gap-3 md:justify-start'
                            >
                                <div className='w-12 h-12 rounded-full bg-[#C1440E] flex items-center justify-center'>
                                    <FaUtensils className='text-[#F4EFE6] text-xl' />
                                </div>

                                <div>
                                    <span className='text-[#F4EFE6] font-semibold'>Fine Dining</span>
                                </div>
                            </div>

                            <div
                                ref={addBadgeRef}
                                onMouseEnter={(e) => handleBadgeEnter(e.currentTarget)}
                                onMouseLeave={(e) => handleBadgeLeave(e.currentTarget)}
                                className='flex items-center gap-3'
                            >
                                <div className='w-12 h-12 rounded-full bg-[#C1440E] flex items-center justify-center md:flex'>
                                    <FaWineGlassAlt className='text-[#F4EFE6] text-xl' />
                                </div>

                                <div>
                                    <span className='text-[#F4EFE6] font-semibold'>Wine Pairing</span>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>
    )
}

export default About