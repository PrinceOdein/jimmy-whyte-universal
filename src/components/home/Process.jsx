// src/components/home/Process.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Process = () => {
  const sectionRef = useRef();
  const titleRef = useRef();
  const stepsRef = useRef([]);

  useEffect(() => {
    // Animate process section on scroll into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate title
          gsap.fromTo(titleRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
          );
          
          // Animate steps with stagger
          gsap.fromTo(stepsRef.current,
            { opacity: 0, y: 30 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.8, 
              ease: "power2.out",
              stagger: 0.3
            }
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

  const steps = [
    {
      number: 1,
      title: "Discovery & Strategy",
      description: "We dive deep into your brand to understand your goals, challenges, and opportunities.",
      points: [
        "Brand audit and competitive analysis",
        "Stakeholder interviews",
        "Strategic roadmap development"
      ]
    },
    {
      number: 2,
      title: "Design & Development",
      description: "We create stunning visuals and seamless experiences that bring your brand to life.",
      points: [
        "Visual identity system creation",
        "Interactive prototype development",
        "User testing and refinement"
      ]
    },
    {
      number: 3,
      title: "Launch & Grow",
      description: "We ensure your brand makes a powerful impact and continues to evolve.",
      points: [
        "Brand launch strategy and execution",
        "Performance tracking and analytics",
        "Ongoing brand evolution and support"
      ]
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 
            ref={titleRef}
            className="text-3xl md:text-4xl font-bold mb-4 opacity-0"
          >
            Our Process
          </h2>
          <p className="text-gray-600 opacity-0">
            A proven approach to building exceptional brand experiences.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div 
              ref={el => stepsRef.current[index] = el}
              key={step.number}
              className={`flex flex-col md:flex-row items-center mb-16 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'} opacity-0`}
            >
              <div className="md:w-1/3 mb-8 md:mb-0 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl font-bold">
                  {step.number}
                </div>
              </div>
              <div className={`md:w-2/3 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600 mb-4">
                  {step.description}
                </p>
                <ul className="space-y-2">
                  {step.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;