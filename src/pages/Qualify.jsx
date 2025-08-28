// src/pages/Qualify.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Header';

const Qualify = () => {
  // --- State Management (React useState) ---
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    revenueRange: '',
    projectDetails: '',
    servicesInterested: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // --- ADDITIONAL STATE FOR BOOKING ---
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [slotFetchError, setSlotFetchError] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null); // For storing the selected slot
  
  const navigate = useNavigate();

  // --- Define Conversation Steps ---
  const steps = [
    {
      id: 'intro',
      title: "Hi there! I'm excited to learn about your project.",
      subtitle: "Let's start with a few quick questions.",
      component: () => (
        <div className="text-center py-6">
          <p className="text-lg">This will help us understand your needs.</p>
        </div>
      ),
      required: [],
    },
    {
      id: 'contact',
      title: "What's your name?",
      subtitle: "And how can we reach you?",
      component: () => (
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              id="name"
              type="text"
              placeholder="e.g., Alex Johnson"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              id="email"
              type="email"
              placeholder="e.g., alex@company.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
            <input
              id="phone"
              type="tel"
              placeholder="e.g., +1 (555) 123-4567"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
        </div>
      ),
      required: ['name', 'email', 'phone'],
    },
    {
      id: 'company',
      title: "Tell me about your company.",
      subtitle: "This helps us understand your business context.",
      component: () => (
        <div className="space-y-4">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input
              id="company"
              type="text"
              placeholder="e.g., InnovateX Inc."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
            <input
              id="website"
              type="url"
              placeholder="e.g., https://innovatex.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition"
              value={formData.website}
              onChange={(e) => setFormData({...formData, website: e.target.value})}
            />
          </div>
        </div>
      ),
      required: ['company'],
    },
    {
      id: 'revenue',
      title: "What is your company's monthly revenue range?",
      subtitle: "This helps us understand your business scale and tailor our services accordingly.",
      component: () => (
        <div>
          <label htmlFor="revenueRange" className="block text-sm font-medium text-gray-700 mb-1">Select Range *</label>
          <select
            id="revenueRange"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition appearance-none bg-white"
            value={formData.revenueRange}
            onChange={(e) => setFormData({...formData, revenueRange: e.target.value})}
          >
            <option value="" disabled>Select a range</option>
            <option value="$5000-$10000">$5,000 - $10,000</option>
            <option value="$15000-$25000">$15,000 - $25,000</option>
            <option value="$25000-$95000">$25,000 - $95,000</option>
            <option value="$100000-$200000">$100,000 - $200,000</option>
            <option value="$200000+">$200,000+</option>
          </select>
        </div>
      ),
      required: ['revenueRange'],
    },
    {
      id: 'project',
      title: "What can you tell me about your project?",
      subtitle: "Share your goals, challenges, or any specific outcomes you're hoping to achieve.",
      component: () => (
        <div>
          <label htmlFor="projectDetails" className="block text-sm font-medium text-gray-700 mb-1">Project Details</label>
          <textarea
            id="projectDetails"
            placeholder="Describe your project, goals, or challenges..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition resize-none"
            rows="4"
            value={formData.projectDetails}
            onChange={(e) => setFormData({...formData, projectDetails: e.target.value})}
          ></textarea>
        </div>
      ),
      required: [],
    },
    {
      id: 'services',
      title: "Which of our services are you most interested in?",
      subtitle: "Select one or multiple. We offer comprehensive solutions to elevate your brand presence.",
      component: () => {
        const servicesList = [
          'Brand Management & Consultation',
          'Interactive Design',
          'App/Web Development',
          'Product Packaging',
          'Print Solution',
          'New Media & Event Services',
          'Trainings'
        ];

        const toggleService = (service) => {
          const currentServices = [...formData.servicesInterested];
          const index = currentServices.indexOf(service);
          if (index >= 0) {
            currentServices.splice(index, 1);
          } else {
            currentServices.push(service);
          }
          setFormData({ ...formData, servicesInterested: currentServices });
        };

        return (
          <div className="space-y-3">
            {servicesList.map((service) => (
              <button
                type="button"
                onClick={() => toggleService(service)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition duration-200 ease-in-out flex items-center ${
                  formData.servicesInterested.includes(service)
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 flex-shrink-0 ${
                  formData.servicesInterested.includes(service)
                    ? 'border-white bg-white'
                    : 'border-gray-400'
                }`}>
                  {formData.servicesInterested.includes(service) && (
                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm">{service}</span>
              </button>
            ))}
          </div>
        );
      },
      required: [],
    },
    {
      id: 'booking',
      title: "When would you like to schedule your discovery call?",
      subtitle: "Select a convenient time slot below.",
      component: () => {
        // Mock slots for demonstration - replace with actual fetching logic
        const mockSlots = [
          { id: 1, date: '2024-08-05', time: '10:00', utcOffset: '+00:00' },
          { id: 2, date: '2024-08-05', time: '11:00', utcOffset: '+00:00' },
          { id: 3, date: '2024-08-06', time: '14:00', utcOffset: '+00:00' },
        ];

        const formatDate = (dateStr, timeStr) => {
          try {
            const dateTime = new Date(`${dateStr}T${timeStr}:00Z`);
            return dateTime.toLocaleString([], {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZoneName: 'short'
            });
          } catch (e) {
            return `${dateStr} ${timeStr}`;
          }
        };

        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Times</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockSlots.map((slot) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3 rounded-lg border text-left transition ${
                    selectedSlot && selectedSlot.id === slot.id
                      ? 'bg-red-500 text-white border-red-500'
                      : 'border-gray-300 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  {formatDate(slot.date, slot.time)}
                </button>
              ))}
            </div>
            
            {selectedSlot && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm font-medium">Selected Slot:</p>
                <p className="text-sm">{formatDate(selectedSlot.date, selectedSlot.time)}</p>
              </div>
            )}
          </div>
        );
      },
      required: [], // Optional selection
    },
    {
      id: 'review',
      title: "Here's a summary of the information you provided:",
      subtitle: "Please review and make any necessary changes before submitting.",
      component: () => (
        <div className="bg-gray-50 p-5 rounded-lg space-y-3 text-sm">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-500">Name:</span>
            <span>{formData.name || 'Not provided'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-500">Email:</span>
            <span>{formData.email || 'Not provided'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-500">Phone:</span>
            <span>{formData.phone || 'Not provided'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-500">Company:</span>
            <span>{formData.company || 'Not provided'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-500">Website:</span>
            <span>{formData.website || 'Not provided'}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium text-gray-500">Revenue Range:</span>
            <span>{formData.revenueRange || 'Not provided'}</span>
          </div>
          <div className="border-b pb-2">
            <div className="font-medium text-gray-500 mb-1">Project Details:</div>
            <div>{formData.projectDetails || 'Not provided'}</div>
          </div>
          <div>
            <div className="font-medium text-gray-500 mb-1">Services Interested:</div>
            <div>
              {formData.servicesInterested.length > 0 
                ? formData.servicesInterested.join(', ') 
                : 'None selected'}
            </div>
          </div>
          {selectedSlot && (
            <div>
              <div className="font-medium text-gray-500 mb-1">Selected Booking Slot:</div>
              <div>
                {(() => {
                  try {
                    const dateTime = new Date(`${selectedSlot.date}T${selectedSlot.time}:00Z`);
                    return dateTime.toLocaleString([], {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      timeZoneName: 'short'
                    });
                  } catch (e) {
                    return `${selectedSlot.date} ${selectedSlot.time}`;
                  }
                })()}
              </div>
            </div>
          )}
        </div>
      ),
      required: [],
    },
    {
      id: 'submit',
      title: "Thanks for sharing those details!",
      subtitle: "Are you ready to submit your information?",
      component: () => (
        <div className="text-center py-4">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          </div>
          <p className="text-gray-600">We'll be in touch soon to discuss how we can help bring your project to life.</p>
        </div>
      ),
      required: [],
    }
  ];

  // --- Navigation Logic ---
  const nextStep = () => {
    const currentStepData = steps[currentStep];
    
    // Basic validation for required fields in the current step
    if (currentStepData.required && currentStepData.required.length > 0) {
      let isValid = true;
      for (const field of currentStepData.required) {
        const fieldValue = formData[field];
        if (!fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === '')) {
          isValid = false;
          break;
        }
      }
      
      if (!isValid) {
        alert(`Please fill out the required field(s) on this step.`);
        return; // Stop if validation fails
      }
    }

    // Move to next step if validation passes
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // On the last step, trigger submission
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // --- Submission Logic ---
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      console.log("Attempting to insert lead into Supabase...");
      
      // Prepare data for Supabase
      const leadData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        website: formData.website || null,
        revenue_range: formData.revenueRange,
        project_details: formData.projectDetails || null,
        services_interested: JSON.stringify(formData.servicesInterested),
        // Add selected booking slot if available
        //selected_booking_slot: selectedSlot ? JSON.stringify(selectedSlot) : null
      };

      const { data, error } = await supabase
        .from('leads')
        .insert([leadData]);

      if (error) throw error;

      console.log('Lead saved to Supabase:', data);
      setSubmitMessage('Thank you! Your information has been submitted successfully. We will contact you shortly.');
      
      // Optional: Reset form or redirect
      // setFormData({ name: '', email: '', ... }); 
      // setCurrentStep(0);
      
      // Redirect to thank you page after a delay
      setTimeout(() => {
        navigate('/thank-you');
      }, 2000);

    } catch (error) {
      console.error('Error saving lead to Supabase:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      setSubmitMessage(`Error: ${error.message || 'Failed to submit form. Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Get Current Step Data ---
  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <section className="section-padding max-w-2xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Step {currentStep + 1}</span>
              <span>{steps.length} total</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-black h-1.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{currentStepData.title}</h1>
            {currentStepData.subtitle && (
              <p className="text-gray-600 mb-6">{currentStepData.subtitle}</p>
            )}
            
            <div className="mb-8">
              {currentStepData.component()}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`py-2.5 px-5 rounded-lg border text-sm font-medium transition ${
                currentStep === 0 
                  ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Back
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-6 rounded-lg transition duration-300 text-sm"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`bg-black hover:bg-gray-800 text-white font-medium py-2.5 px-6 rounded-lg transition duration-300 text-sm flex items-center ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Project'}
              </button>
            )}
          </div>

          {/* Submission Message */}
          {submitMessage && (
            <div className={`mt-6 p-4 rounded-lg text-center text-sm ${
              submitMessage.includes('Thank you') 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {submitMessage}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Qualify;