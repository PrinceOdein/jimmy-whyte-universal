// src/components/home/Hero.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const buttonsRef = useRef();
  const visualRef = useRef();

  useEffect(() => {
    // Animate hero elements on mount
    if (heroRef.current) {
      // Initial state
      gsap.set([titleRef.current, subtitleRef.current, buttonsRef.current, visualRef.current], { 
        opacity: 0, 
        y: 30 
      });

      // Staggered animation
      gsap.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
      });
      
      gsap.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.2
      });
      
      gsap.to(buttonsRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.4
      });
      
      gsap.to(visualRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.6
      });
    }
  }, []);

  return (
    <section ref={heroRef} className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 opacity-90"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-500 to-transparent opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/3 bg-gradient-to-t from-red-500 to-transparent opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white opacity-0"
            >
              Branding. <span className="text-red-500">Design.</span> Experience
            </h1>
            <p 
              ref={subtitleRef}
              className="text-xl mb-8 text-gray-300 opacity-0"
            >
              We help ambitious founders build brands that captivate audiences and drive growth.
            </p>
            <div 
              ref={buttonsRef}
              className="flex flex-col sm:flex-row gap-4 opacity-0"
            >
              <Link to="/qualify">
                <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition duration-300 transform hover:-translate-y-1">
                  Start Your Project
                </button>
              </Link>
              <a href="#services">
                <button className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-medium py-3 px-6 rounded-lg transition">
                  See Our Work
                </button>
              </a>
            </div>
          </div>
          <div 
            ref={visualRef}
            className="md:w-1/2 flex justify-center opacity-0"
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-red-500 rounded-full opacity-20 absolute -top-6 -left-6"></div>
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gray-800 rounded-2xl shadow-2xl overflow-hidden relative z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                    <p className="text-white font-medium">Creative Agency</p>
                    <p className="text-gray-400 text-sm mt-1">Hooked on value</p>
                  </div>
                </div>
              </div>
              <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-full opacity-10 absolute -bottom-6 -right-6"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;