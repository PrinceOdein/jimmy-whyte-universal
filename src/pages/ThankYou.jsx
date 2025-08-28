import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">Brand<span className="text-accent">Studio</span></h1>
          </div>
          <Link to="/">
            <button className="btn-accent text-sm">
              Back to Home
            </button>
          </Link>
        </div>
      </header>
      
      <section className="section-padding max-w-2xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-gray-600 mb-8">
            Your information has been submitted successfully. We will contact you shortly.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">What Happens Next?</h2>
            <ul className="space-y-3 text-left text-gray-600">
              <li className="flex items-start">
                <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">1</span>
                <span>Our team will review your details and send a confirmation email shortly.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">2</span>
                <span>We will contact you via email to schedule your discovery call at a time that suits you best.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">3</span>
                <span>During our call, we'll dive deep into your project goals and explore how we can bring your vision to life.</span>
              </li>
            </ul>
          </div>
          
          <Link to="/">
            <button className="btn-primary">
              Back to Home
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ThankYou;