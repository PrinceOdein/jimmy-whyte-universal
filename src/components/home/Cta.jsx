// src/components/home/Cta.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

const Cta = () => {
  const sectionRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const buttonRef = useRef();

  useEffect(() => {
    // Animate CTA section on scroll into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate elements
          gsap.fromTo([titleRef.current, subtitleRef.current],
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out", stagger: 0.1 }
          );
          
          gsap.fromTo(buttonRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.2 }
          );
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gradient-to-r from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 
          ref={titleRef}
          className="text-3xl md:text-4xl font-bold mb-4 opacity-0"
        >
          Ready to Transform Your Brand?
        </h2>
        <p 
          ref={subtitleRef}
          className="text-xl mb-8 max-w-2xl mx-auto text-gray-300 opacity-0"
        >
          Book your free 30-minute strategy session today and discover how we can help you build a brand that scales.
        </p>
        <Link to="/qualify">
          <button 
            ref={buttonRef}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded-lg transition duration-300 transform hover:-translate-y-1 opacity-0"
          >
            Book Your Free Session
          </button>
        </Link>
        <p className="mt-4 text-gray-400 opacity-0">
          Only 3 spots available this month
        </p>
      </div>
    </section>
  );
};

export default Cta;