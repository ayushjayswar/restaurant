import React, { useEffect, useRef } from 'react'
import gsap from 'gsap';
import { FaUtensils, FaWineGlassAlt } from "react-icons/fa";

const About = () => {

    // Refs — section scope + each part of the layout as its own target
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const imageRef = useRef(null);
    const textRef = useRef(null);
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
    // GSAP entrance animation
    // Start: gsap.context() on mount
    // End: ctx.revert() on unmount
    // ==============================
    useEffect(() => {
        const ctx = gsap.context(() => {

            const tl = gsap.timeline({
                defaults: { ease: 'power3.out' },
            });

            tl.fromTo(
                headingRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5 }
            )
                .fromTo(
                    imageRef.current,
                    { opacity: 0, x: -40 },
                    { opacity: 1, x: 0, duration: 0.6 },
                    '-=0.2'
                )
                // Heading words — each rises up from behind its own mask
                .fromTo(
                    wordRefs.current,
                    { yPercent: 120 },
                    { yPercent: 0, duration: 0.7, stagger: 0.12, ease: 'power4.out' },
                    '-=0.35'
                )
                // Paragraphs — soft blur + slide reveal, one after another
                .fromTo(
                    paraRefs.current,
                    { opacity: 0, y: 18, filter: 'blur(6px)' },
                    {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        duration: 0.6,
                        stagger: 0.2,
                        ease: 'power2.out',
                    },
                    '-=0.3'
                )
                .fromTo(
                    badgeRefs.current,
                    { opacity: 0, y: 14 },
                    { opacity: 1, y: 0, duration: 0.4, stagger: 0.15 },
                    '-=0.2'
                );

        }, sectionRef);

        return () => ctx.revert(); // GSAP end — revert all tweens on unmount
    }, []);

    return (
        <section id='about' ref={sectionRef} className='py-10 bg-white'>
            <div className='mx-auto px-6'>

                {/* Heading section */}
                <div ref={headingRef} className='text-center mb-8'>
                    <h1 className='text-3xl sm:text-4xl mb-2 font-bold text-black underline underline-offset-15 decoration-red-600'>Our Story</h1>
                </div>

                <div className='flex flex-col md:flex-row items-center gap-10'>

                    {/* left side — image section */}
                    <div ref={imageRef} className='md:w-1/2'>
                        <img className='w-full h-full object-cover rounded-xl' src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" alt="" />
                    </div>

                    {/* right side — text section */}
                    <div ref={textRef} className='md:w-1/2'>

                        {/* Heading — each word masked in its own overflow-hidden box so it rises up cleanly, no jump */}
                        <h3 className='flex flex-wrap gap-x-3 text-5xl font-serif font-bold py-2'>
                            {headingWords.map((word, i) => (
                                <span key={i} className='inline-block overflow-hidden pb-1'>
                                    <span ref={addWordRef} className='inline-block'>
                                        {word}
                                    </span>
                                </span>
                            ))}
                        </h3>

                        <p ref={addParaRef} className='text-1xl text-gray-700 py-5'>{paragraph1}</p>

                        <p ref={addParaRef} className='text-1xl text-gray-700 pb-5'>{paragraph2}</p>

                        {/* button section div */}
                        <div className='flex space-x-4 items-center'>
                            <div ref={addBadgeRef} className='flex items-center gap-2 md:justify-start'>
                                <div className='w-12 h-12 rounded-full bg-red-600 flex items-center justify-center'>
                                    <FaUtensils className='text-white text-xl' />
                                </div>

                                <div>
                                    <span className='text-gray-800 font-semibold'>Fine Dining</span>
                                </div>
                            </div>

                            <div ref={addBadgeRef} className='flex items-center gap-2'>
                                <div className='w-12 h-12 rounded-full bg-red-600 flex items-center justify-center md:flex'>
                                    <FaWineGlassAlt className='text-white text-xl' />
                                </div>

                                <div>
                                    <span className='text-gray-800 font-semibold'>Wine Parinig</span>
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