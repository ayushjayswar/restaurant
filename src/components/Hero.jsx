import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'

const Hero = () => {

  const heading = "Experience Fine Dining";
  const words = heading.split(" ");

  const [animKey, setAnimKey] = useState(0);

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
    ' style={{backgroundImage:"url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')"}}>

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
                      Indulge in our exquisite culinary creations crafted with passion and the finest ingredients.
                    </motion.p>

                    <div className='flex flex-wrap gap-4'>
                      <motion.a
                        className='inline-block bg-red-700 rounded-full px-8 py-3 cursor-pointer hover:bg-red-900 transition duration-300 transform active:scale-95'
                        href='/roombooking'
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.1 }}
                      >
                        Book A Rooms
                      </motion.a>

                      <motion.a
                        className='inline-block bg-red-700 rounded-full px-8 py-3 cursor-pointer hover:bg-red-900 transition duration-300 transform active:scale-95'
                        href='/reservation'
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.1 }}
                      >
                        Book Your Table
                      </motion.a>
                    </div>

                  </div>
                </div>
         </div>
    </div>
  )
}

export default Hero