// src/pages/Qualify.jsx
import { createSignal } from 'solid-js';
import Header from '../components/Header';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed
// import { onMount } from 'solid-js';

const Qualify = () => {

  // --- State Management ---
  const [currentStep, setCurrentStep] = createSignal(0);
  // --- ADD THE MISSING SIGNALS HERE ---
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [submitMessage, setSubmitMessage] = createSignal('');
  // --- END OF ADDED SIGNALS ---
  // State for form data (including ALL required fields)
  const [formData, setFormData] = createSignal({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    revenueRange: '',
    projectDetails: '',
    servicesInterested: [],
    // --- ADD BOOKING PREFERENCE FIELD ---
    bookingPreference: ''
    // --- ---
  });

  // Handle next step with validation
  const nextStep = () => {
    // Validation for required fields in current step
    if (currentStep() === 1 && (!formData().name || !formData().email || !formData().phone)) {
      alert('Please fill in all required fields (Name, Email, Phone)');
      return;
    }
    if (currentStep() === 2 && (!formData().company)) {
      alert('Please fill in your Company Name');
      return;
    }
    if (currentStep() === 3 && (!formData().revenueRange)) {
      alert('Please select your Revenue Range');
      return;
    }
    // --- UPDATE STEP COUNT ---
    if (currentStep() < 8) { // Now 9 steps total (0-8)
      setCurrentStep(currentStep() + 1);
    } else {
      handleSubmit(); // Submit on final step
    }
    // --- ---
  };

  // Handle previous step
  const prevStep = () => {
    if (currentStep() > 0) {
      setCurrentStep(currentStep() - 1);
    }
  };

  // Handle form submission to Supabase
  const handleSubmit = async () => {
    // --- USE THE SETTERS FROM THE NEWLY DECLARED SIGNALS ---
    setIsSubmitting(true);
    setSubmitMessage('');
    // --- ---
    try {
      console.log("Attempting to insert lead into Supabase...");
      // Prepare data for Supabase
      // Make sure the object keys match your Supabase table column names
      const leadData = {
        name: formData().name,
        email: formData().email,
        phone: formData().phone,
        company: formData().company,
        website: formData().website || null, // Handle optional fields
        revenue_range: formData().revenueRange, // Match DB column name
        project_details: formData().projectDetails || null, // Match DB column name
        // Convert array to JSON string for storage in a text column
        // If using JSONB column in Supabase, you might pass the array directly
        services_interested: JSON.stringify(formData().servicesInterested), // Match DB column name
        // --- ADD BOOKING PREFERENCE TO SUBMISSION DATA ---
        booking_preference: formData().bookingPreference || null // Match DB column name
        // --- ---
      };

      // Insert data into the 'leads' table
      const { data, error } = await supabase
        .from('leads') // Make sure this matches your actual table name
        .insert([leadData]);

      if (error) {
        throw error; // Handle Supabase errors
      }

      console.log('Lead saved to Supabase:', data);
      // --- UPDATED SUCCESS MESSAGE AND REDIRECT ---
      setSubmitMessage('Thank you! Redirecting to schedule your call...');
    
      // 2. Wait a moment for user to see the message
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      // 3. Redirect to Calendly
      // IMPORTANT: Replace 'your-calendly-username' and 'your-event-type' 
      // with your actual Calendly details obtained from your Calendly dashboard
      const calendlyUrl = 'https://calendly.com/odeinanyanwu/discovery-call'; // Removed extra spaces
      
      // Optional: Pre-fill Calendly with user info for a smoother experience
      const prefillParams = new URLSearchParams({
        name: formData().name,
        email: formData().email,
        // Add 'phone' or other fields if your Calendly event supports them
      }).toString();
      
      const fullRedirectUrl = `${calendlyUrl}?${prefillParams}`;
      
      // Redirect user to Calendly
      window.location.href = fullRedirectUrl;
      // --- ---
      
      // Optional: Reset form after successful submission
      // setFormData({
      //   name: '',
      //   email: '',
      //   phone: '',
      //   company: '',
      //   website: '',
      //   revenueRange: '',
      //   projectDetails: '',
      //   servicesInterested: [],
      //   bookingPreference: ''
      // });
      // You might also want to redirect or show a final "thank you" state

    } catch (error) {
      console.error('Error saving lead to Supabase:', error);
      console.error('Error details:', error.message, error.details, error.hint); // More detailed error logging
      setSubmitMessage(`Error: ${error.message || 'Failed to submit form. Please try again.'}`);
    } finally {
      // --- USE THE SETTER FROM THE NEWLY DECLARED SIGNAL ---
      setIsSubmitting(false);
      // --- ---
    }
  };

  // Toggle service selection
  const toggleService = (service) => {
    const currentServices = [...formData().servicesInterested];
    const index = currentServices.indexOf(service);
    if (index >= 0) {
      currentServices.splice(index, 1);
    } else {
      currentServices.push(service);
    }
    setFormData({...formData(), servicesInterested: currentServices});
  };

  return (
    <div class="min-h-screen bg-white text-black">
      <Header />
      <main class="py-16 max-w-2xl mx-auto px-4">
        <div class="bg-gray-50 rounded-2xl p-8 shadow-sm">
          {/* Progress bar */}
          <div class="mb-8">
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              {/* --- UPDATE PROGRESS BAR MAX --- */}
              <div 
                class="bg-red-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${((currentStep() + 1) / 9) * 100}%` }} // Now 9 steps
              ></div>
            </div>
            <div class="flex justify-between text-sm text-gray-500 mt-2">
              {/* --- UPDATE STEP COUNT DISPLAY --- */}
              <span>Step {currentStep() + 1} of 9</span>
            </div>
          </div>

          {/* Step 1: Introduction */}
          {currentStep() === 0 && (
            <div class="transition-opacity duration-300">
              <h1 class="text-3xl font-bold mb-4">Hi there! Let's get started.</h1>
              <p class="text-gray-600 mb-8">We're excited to learn about your project. This will take just a few minutes.</p>
              <div class="bg-white p-6 rounded-xl shadow-sm">
                <h2 class="text-xl font-semibold mb-4">How it works</h2>
                <ul class="space-y-3 text-gray-600">
                  <li class="flex items-start">
                    <span class="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">1</span>
                    <span>We'll ask for some basic information about you and your company</span>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">2</span>
                    <span>Tell us about your project goals and challenges</span>
                  </li>
                  <li class="flex items-start">
                    <span class="bg-red-100 text-red-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">3</span>
                    <span>Select the services you're interested in</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {currentStep() === 1 && (
            <div class="transition-opacity duration-300">
              <h1 class="text-3xl font-bold mb-2">What's your name?</h1>
              <p class="text-gray-600 mb-6">And how can we reach you?</p>
              <div class="space-y-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g., Alex Johnson"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                    value={formData().name}
                    onInput={(e) => setFormData({...formData(), name: e.target.value})}
                  />
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g., alex@company.com"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                    value={formData().email}
                    onInput={(e) => setFormData({...formData(), email: e.target.value})}
                  />
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="e.g., +1 (555) 123-4567"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                    value={formData().phone}
                    onInput={(e) => setFormData({...formData(), phone: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Company Information */}
          {currentStep() === 2 && (
            <div class="transition-opacity duration-300">
              <h1 class="text-3xl font-bold mb-2">Tell us about your company.</h1>
              <p class="text-gray-600 mb-6">This helps us understand your business context.</p>
              <div class="space-y-4">
                <div>
                  <label for="company" class="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input
                    id="company"
                    type="text"
                    placeholder="e.g., InnovateX Inc."
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                    value={formData().company}
                    onInput={(e) => setFormData({...formData(), company: e.target.value})}
                  />
                </div>
                <div>
                  <label for="website" class="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                  <input
                    id="website"
                    type="url"
                    placeholder="e.g., https://innovatex.com"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
                    value={formData().website}
                    onInput={(e) => setFormData({...formData(), website: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Revenue Range */}
          {currentStep() === 3 && (
            <div class="transition-opacity duration-300">
              <h1 class="text-3xl font-bold mb-2">What is your company's monthly revenue range?</h1>
              <p class="text-gray-600 mb-6">This helps us understand your business scale and tailor our services accordingly.</p>
              <div>
                <label for="revenueRange" class="block text-sm font-medium text-gray-700 mb-1">Select Range *</label>
                <select
                  id="revenueRange"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition appearance-none bg-white"
                  value={formData().revenueRange}
                  onInput={(e) => setFormData({...formData(), revenueRange: e.target.value})}
                >
                  <option value="" disabled selected>Select a range</option>
                  <option value="$5000-$10000">$5,000 - $10,000</option>
                  <option value="$15000-$25000">$15,000 - $25,000</option>
                  <option value="$25000-$95000">$25,000 - $95,000</option>
                  <option value="$100000-$200000">$100,000 - $200,000</option>
                  <option value="$200000+">$200,000+</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 5: Project Details */}
          {currentStep() === 4 && (
            <div class="transition-opacity duration-300">
              <h1 class="text-3xl font-bold mb-2">What can you tell us about your project?</h1>
              <p class="text-gray-600 mb-6">Share your goals, challenges, or any specific outcomes you're hoping to achieve.</p>
              <div>
                <label for="projectDetails" class="block text-sm font-medium text-gray-700 mb-1">Project Details</label>
                <textarea
                  id="projectDetails"
                  placeholder="Describe your project, goals, or challenges..."
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition resize-none"
                  rows="5"
                  value={formData().projectDetails}
                  onInput={(e) => setFormData({...formData(), projectDetails: e.target.value})}
                ></textarea>
              </div>
            </div>
          )}

          {/* Step 6: Services Selection */}
          {currentStep() === 5 && (
            <div class="transition-opacity duration-300">
              <h1 class="text-3xl font-bold mb-2">Which of our services are you most interested in?</h1>
              <p class="text-gray-600 mb-6">Select one or multiple. We offer comprehensive solutions to elevate your brand presence.</p>
              <div class="space-y-3">
                {[
                  'Brand Management & Consultation',
                  'Interactive Design',
                  'App/Web Development',
                  'Product Packaging',
                  'Print Solution',
                  'New Media & Event Services',
                  'Trainings'
                ].map((service) => (
                  <button
                    type="button"
                    onClick={() => toggleService(service)}
                    class={`w-full text-left px-4 py-3 rounded-lg border transition duration-200 ease-in-out flex items-center ${
                      formData().servicesInterested.includes(service)
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-red-500'
                    }`}
                  >
                    <div class={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 flex-shrink-0 ${
                      formData().servicesInterested.includes(service)
                        ? 'border-white bg-white'
                        : 'border-gray-400'
                    }`}>
                      {formData().servicesInterested.includes(service) && (
                        <svg class="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span class="text-sm">{service}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Booking Preference (NEW STEP) */}
          {currentStep() === 6 && (
            <div class="transition-opacity duration-300">
              <h1 class="text-3xl font-bold mb-2">When would you like to schedule your discovery call?</h1>
              <p class="text-gray-600 mb-6">Let us know your availability so we can coordinate a convenient time.</p>
                <div class="relative w-full" style="padding-bottom:calc(600px + 1em);"> {/* Responsive container */}
                  <iframe
                    src="https://cal.com/anyanwujedi/discovery-call"
                    // Example: src="https://cal.com/odeinanyanwu/discovery-call"
                    style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;"
                    frameborder="0"
                    allowfullscreen
                    title="Schedule a meeting with us"
                  ></iframe>
                </div>
                {/* --- --- */}
              
              {/* Optional: Add a note below the widget */}
              <p class="text-gray-500 text-sm mt-4 text-center">
                Having trouble? <a href="mailto:youremail@example.com" class="text-red-500 hover:underline">Contact us</a>.
              </p>
            </div>
          )}

          {/* Step 8: Review Information */}
          {currentStep() === 7 && (
            <div class="transition-opacity duration-300">
              <h1 class="text-3xl font-bold mb-2">Here's a summary of the information you provided:</h1>
              <p class="text-gray-600 mb-6">Please review and make any necessary changes before submitting.</p>
              <div class="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <div class="flex justify-between border-b pb-3">
                  <span class="font-medium text-gray-500">Name:</span>
                  <span>{formData().name || 'Not provided'}</span>
                </div>
                <div class="flex justify-between border-b pb-3">
                  <span class="font-medium text-gray-500">Email:</span>
                  <span>{formData().email || 'Not provided'}</span>
                </div>
                <div class="flex justify-between border-b pb-3">
                  <span class="font-medium text-gray-500">Phone:</span>
                  <span>{formData().phone || 'Not provided'}</span>
                </div>
                <div class="flex justify-between border-b pb-3">
                  <span class="font-medium text-gray-500">Company:</span>
                  <span>{formData().company || 'Not provided'}</span>
                </div>
                <div class="flex justify-between border-b pb-3">
                  <span class="font-medium text-gray-500">Website:</span>
                  <span>{formData().website || 'Not provided'}</span>
                </div>
                <div class="flex justify-between border-b pb-3">
                  <span class="font-medium text-gray-500">Revenue Range:</span>
                  <span>{formData().revenueRange || 'Not provided'}</span>
                </div>
                <div class="border-b pb-3">
                  <div class="font-medium text-gray-500 mb-1">Project Details:</div>
                  <div>{formData().projectDetails || 'Not provided'}</div>
                </div>
                <div class="border-b pb-3">
                  <div class="font-medium text-gray-500 mb-1">Services Interested:</div>
                  <div>
                    {formData().servicesInterested.length > 0 
                      ? formData().servicesInterested.join(', ') 
                      : 'None selected'}
                  </div>
                </div>
                {/* --- ADD BOOKING PREFERENCE TO REVIEW --- */}
                <div>
                  <div class="font-medium text-gray-500 mb-1">Booking Preference:</div>
                  <div>{formData().bookingPreference || 'Not provided'}</div>
                </div>
                {/* --- --- */}
              </div>
            </div>
          )}

          {/* Step 9: Submit Confirmation */}
          {currentStep() === 8 && (
            <div class="transition-opacity duration-300 text-center">
              <h1 class="text-3xl font-bold mb-4">Thanks for sharing those details!</h1>
              <p class="text-gray-600 mb-8">Are you ready to submit your information?</p>
              <div class="bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto">
                <div class="flex justify-center mb-6">
                  <div class="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
                <p class="text-gray-600">We'll be in touch soon to discuss how we can help bring your project to life.</p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep() === 0}
              class={`py-2.5 px-5 rounded-lg border text-sm font-medium transition ${
                currentStep() === 0 
                  ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              Back
            </button>
            {/* --- UPDATE BUTTON LOGIC FOR NEW STEP COUNT --- */}
            {currentStep() < 8 ? ( // Now 9 steps (0-8), so < 8 for Continue button
              <button
                onClick={nextStep}
                class="bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-6 rounded-lg transition duration-300 text-sm"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting()} // Disable button during submission
                class={`bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-6 rounded-lg transition duration-300 text-sm flex items-center ${
                  isSubmitting() ? 'opacity-75 cursor-not-allowed' : '' // Visual feedback
                }`}
              >
                {/* Show spinner and text during submission */}
                {isSubmitting() ? (
                  <>
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Project'}
              </button>
            )}
            {/* --- --- */}
          </div>

          {/* Submission Message */}
          {/* Conditionally render the message */}
          {submitMessage() && (
            <div class={`mt-4 p-3 rounded-lg text-center text-sm ${
              submitMessage().includes('Thank you') 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {submitMessage()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Qualify;