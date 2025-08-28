import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/home/Hero';
import Services from '../components/home/Services';
import Process from '../components/home/Process';
import Cta from '../components/home/Cta';
const Home = () => {
  return (
    <div className="min-h-screen bg-white text-black">
        <Header />
      <Hero />
      <Services/>
      <Process/>
      <Cta/>
      {/* <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-gray-900 text-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Branding. <span className="text-accent text-red-600">Design.</span> Experience
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Helping ambitious founders build brands that captivate audiences and drive growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/qualify">
                <button className="bg-accent hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition duration-300">
                  Book Your Free Call
                </button>
              </Link>
              <button className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-medium py-3 px-6 rounded-lg transition">
                See Our Work
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Free Strategy Session</h3>
              <p className="mb-6 text-gray-200">
                30-minute consultation to discuss your brand goals
              </p>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;