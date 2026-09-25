import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'

// const API_URL = "http://127.0.0.1:8000";
const API_URL = "https://lcd-dressing-jim-oven.trycloudflare.com"

// Same as before, but this is now what shows while /content hasn't
// loaded yet, or if the request fails — site never looks broken.
const DEFAULT_HERO = {
  heading: "Experience Fine Dining",
  subtext:
    "Indulge in our exquisite culinary creations crafted with passion and the finest ingredients.",
  background_image:
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
  buttons: [
    { text: "Book A Rooms", link: "/roombooking" },
    { text: "Book Your Table", link: "/reservation" },
  ],
};

const Hero = () => {

  const [hero, setHero] = useState(DEFAULT_HERO);
  const [animKey, setAnimKey] = useState(0);

  // ==============================
  // GET HOME CONTENT FROM BACKEND
  // (admin-edited heading/subtext/image/buttons)
  // ==============================
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_URL}/content`);
        if (!response.ok) return;

        const result = await response.json();
        if (result.hero) {
          setHero(result.hero);
        }
      } catch (err) {
        console.error("Site content fetch error:", err);
        // silently keep DEFAULT_HERO — page still works
      }
    };

    fetchContent();
  }, []);

  const words = hero.heading.split(" ");

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#home') {
        setAnimKey(prev => prev + 1);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div id='home' className='relative h-screen bg-cover 
    bg-center w-full
    ' style={{ backgroundImage: `url('${hero.background_image}')` }}>

      <div className='absolute inset-0 bg-black opacity-80'>
        <div className='container mx-auto px-6 h-full flex items-center z-10 relative'>
          <div className='text-white max-w-2xl ' key={animKey}>

            <h2 className='font-bold mb-4 text-5xl tracking-tight flex flex-wrap gap-x-3'>
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                >
                  {word}
                </motion.span>
              ))}
            </h2>

            <motion.p
              className='font-semibold text-2xl mb-8'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {hero.subtext}
            </motion.p>

            <div className='flex flex-wrap gap-4'>
              {hero.buttons.map((btn, i) => (
                <motion.a
                  key={i}
                  className='inline-block bg-red-700 rounded-full px-8 py-3 cursor-pointer hover:bg-red-900 transition duration-300 transform active:scale-95'
                  href={btn.link}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.1 + i * 0.1 }}
                >
                  {btn.text}
                </motion.a>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero;


