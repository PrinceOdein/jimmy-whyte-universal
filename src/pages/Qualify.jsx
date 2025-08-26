// src/pages/Qualify.jsx
import { createSignal, createEffect } from 'solid-js';
import Header from '../components/Header';
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed

const Qualify = () => {
  // --- State Management ---
  const [currentStep, setCurrentStep] = createSignal(0);
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [submitMessage, setSubmitMessage] = createSignal('');
  const [direction, setDirection] = createSignal('forward'); // For animation direction

  // --- ADDITIONAL STATE FOR BOOKING ---
  const [isFetchingSlots, setIsFetchingSlots] = createSignal(false);
  const [availableTimeSlots, setAvailableTimeSlots] = createSignal([]); // Array of slot objects from API
  const [slotFetchError, setSlotFetchError] = createSignal(null);
  // --- ---

  // Store all form data including booking intent
  const [formData, setFormData] = createSignal({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    revenueRange: '',
    projectDetails: '',
    servicesInterested: [],
    // --- ADD BOOKING RELATED FIELD ---
    selectedTimeSlot: null, // To store the selected slot object
    // --- ---
  });

  // --- FETCHING LOGIC FOR CAL.COM SLOTS ---
  /**
   * Fetches available time slots from the Cal.com API via the backend proxy.
   * @param {string} eventTypeSlug - The slug of the Cal.com event type to fetch slots for.
   */
  const fetchAvailableSlots = async (eventTypeSlug = 'discovery-call') => { // Default to your event type
    setIsFetchingSlots(true);
    setSlotFetchError(null);
    setAvailableTimeSlots([]); // Clear previous slots

    try {
      // --- IMPORTANT: REPLACE WITH YOUR DEPLOYED BACKEND FUNCTION URL ---
      // This should point to your serverless function like `/api/calcom-slots` or `https://your-vercel-project.vercel.app/api/calcom-slots`
      const PROXY_ENDPOINT_URL = '/api/calcom-slots'; // Adjust this path
      // --- ---

      const url = new URL(PROXY_ENDPOINT_URL, window.location.origin);
      url.searchParams.append('eventTypeSlug', eventTypeSlug);
      // Add other parameters like timezone if needed by your backend/API

      console.log("Fetching slots from proxy endpoint:", url.toString());

      const response = await fetch(url.toString());

      if (!response.ok) {
        let errorMessage = 'Failed to fetch time slots.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Fetched availability data:", data);

      // --- IMPORTANT: ADAPT THIS PROCESSING LOGIC ---
      // You MUST adjust this part based on the actual structure
      // of the response returned by your backend proxy function.
      // The structure depends on how your backend formats the data received from Cal.com.
      // Example: If your backend returns `data.slots` as an array:
      let processedSlots = [];
      if (data && Array.isArray(data.slots)) {
        processedSlots = data.slots;
      } else if (Array.isArray(data)) {
        // Example: If your backend returns the array directly
        processedSlots = data;
      }
      // Ensure slots have unique identifiers if not already present
      const slotsWithIds = processedSlots.map((slot, index) => ({
        ...slot,
        id: slot.id || slot.uid || `slot-${index}` // Adjust ID property name if needed
      }));

      console.log("Processed slots for display:", slotsWithIds);
      setAvailableTimeSlots(slotsWithIds);

    } catch (error) {
      console.error("Error fetching Cal.com slots:", error);
      setSlotFetchError(error.message || 'An unexpected error occurred while fetching time slots.');
      setAvailableTimeSlots([]);
    } finally {
      setIsFetchingSlots(false);
    }
  };

  // Effect to fetch slots when entering the booking step (assumed to be step index 6)
  createEffect(() => {
    if (currentStep() === 6) { // Adjust index if booking step changes
      if (availableTimeSlots().length === 0 && !isFetchingSlots()) {
        fetchAvailableSlots('discovery-call'); // Use your actual event type slug
      }
    }
  });
  // --- END OF FETCHING LOGIC ---

  // --- Navigation Logic ---
  const nextStep = () => {
    // Basic validation for required fields in the current step
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
    // Add validation for booking step if selecting a slot is mandatory
    // if (currentStep() === 6 && !formData().selectedTimeSlot) {
    //   alert('Please select a time slot for your discovery call.');
    //   return;
    // }

    if (currentStep() < 7) { // Assuming 8 steps total (0-7)
      setDirection('forward');
      setCurrentStep(currentStep() + 1);
    } else {
      handleSubmit(); // Submit on final step
    }
  };

  const prevStep = () => {
    if (currentStep() > 0) {
      setDirection('backward');
      setCurrentStep(currentStep() - 1);
    }
  };

  // --- Service Selection Logic ---
  const toggleService = (service) => {
    setFormData(prev => {
      const currentServices = [...prev.servicesInterested];
      const index = currentServices.indexOf(service);
      if (index >= 0) {
        currentServices.splice(index, 1);
      } else {
        currentServices.push(service);
      }
      return { ...prev, servicesInterested: currentServices };
    });
  };

  // --- Submission Logic ---
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      console.log("Attempting to insert lead into Supabase...");

      const leadData = {
        name: formData().name,
        email: formData().email,
        phone: formData().phone,
        company: formData().company,
        website: formData().website || null,
        revenue_range: formData().revenueRange,
        project_details: formData().projectDetails || null,
        services_interested: JSON.stringify(formData().servicesInterested),
        // --- SAVE BOOKING INTENT ---
        selected_booking_slot: formData().selectedTimeSlot ? JSON.stringify(formData().selectedTimeSlot) : null,
        // --- ---
      };

      const { data, error } = await supabase
        .from('leads') // Make sure this matches your actual table name
        .insert([leadData]);

      if (error) {
        throw error;
      }

      console.log('Lead (with booking intent) saved to Supabase:', data);
      setSubmitMessage('Thank you! Your information and preferred time slot have been submitted successfully.\n\nWe will contact you shortly to confirm your call.');

      // Optional: Reset form or redirect after successful submission
      // setFormData({ name: '', email: '', ... }); // Reset fields if needed

    } catch (error) {
      console.error('Error saving lead to Supabase:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      setSubmitMessage(`Error: ${error.message || 'Failed to submit form. Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Animation Effect (Basic Example) ---
  let stepContainerRef;
  createEffect(() => {
    if (stepContainerRef) {
      stepContainerRef.style.opacity = 0;
      setTimeout(() => {
        if (stepContainerRef) {
          stepContainerRef.style.opacity = 1;
        }
      }, 50); // Small delay to trigger transition
    }
  }, [currentStep]); // Re-run effect when currentStep changes

  return (
    <div class="min-h-screen bg-white text-black">
      <Header />
      <section class="section-padding max-w-2xl mx-auto px-4">
        <div class="bg-gray-50 rounded-2xl p-6 md:p-8 shadow-sm">
          {/* Progress Bar */}
          <div class="mb-8">
            <div class="flex justify-between text-xs text-gray-500 mb-2">
              <span>Step {currentStep() + 1}</span>
              <span>8 total</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5">
              <div
                class="bg-red-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep() + 1) / 8) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content with Fade Effect */}
          <div
            ref={stepContainerRef}
            class="transition-opacity duration-300 ease-in-out"
          >
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
                      onInput={(e) => setFormData({ ...formData(), name: e.target.value })}
                      autoFocus
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
                      onInput={(e) => setFormData({ ...formData(), email: e.target.value })}
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
                      onInput={(e) => setFormData({ ...formData(), phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Company Information */}
            {currentStep() === 2 && (
              <div class="transition-opacity duration-300">
                <h1 class="text-3xl font-bold mb-2">Tell me about your company.</h1>
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
                      onInput={(e) => setFormData({ ...formData(), company: e.target.value })}
                      autoFocus
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
                      onInput={(e) => setFormData({ ...formData(), website: e.target.value })}
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
                    onInput={(e) => setFormData({ ...formData(), revenueRange: e.target.value })}
                    autoFocus
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
                    onInput={(e) => setFormData({ ...formData(), projectDetails: e.target.value })}
                    autoFocus
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
                          : 'border-gray-300 hover:bg-red-500 hover:text-white'
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

            {/* Step 7: Review Information */}
            {currentStep() === 6 && (
              <div class="transition-opacity duration-300">
                <h1 class="text-3xl font-bold mb-2">Here's a summary of the information you provided:</h1>
                <p class="text-gray-600 mb-6">Please review and make any necessary changes.</p>

                <div class="bg-white p-5 rounded-lg space-y-3 text-sm">
                  <div class="flex justify-between border-b pb-2">
                    <span class="font-medium text-gray-500">Name:</span>
                    <span>{formData().name || 'Not provided'}</span>
                  </div>
                  <div class="flex justify-between border-b pb-2">
                    <span class="font-medium text-gray-500">Email:</span>
                    <span>{formData().email || 'Not provided'}</span>
                  </div>
                  <div class="flex justify-between border-b pb-2">
                    <span class="font-medium text-gray-500">Phone:</span>
                    <span>{formData().phone || 'Not provided'}</span>
                  </div>
                  <div class="flex justify-between border-b pb-2">
                    <span class="font-medium text-gray-500">Company:</span>
                    <span>{formData().company || 'Not provided'}</span>
                  </div>
                  <div class="flex justify-between border-b pb-2">
                    <span class="font-medium text-gray-500">Website:</span>
                    <span>{formData().website || 'Not provided'}</span>
                  </div>
                  <div class="flex justify-between border-b pb-2">
                    <span class="font-medium text-gray-500">Revenue Range:</span>
                    <span>{formData().revenueRange || 'Not provided'}</span>
                  </div>
                  <div class="border-b pb-2">
                    <div class="font-medium text-gray-500 mb-1">Project Details:</div>
                    <div>{formData().projectDetails || 'Not provided'}</div>
                  </div>
                  <div>
                    <div class="font-medium text-gray-500 mb-1">Services Interested:</div>
                    <div>
                      {formData().servicesInterested.length > 0
                        ? formData().servicesInterested.join(', ')
                        : 'None selected'}
                    </div>
                  </div>
                  {/* --- DISPLAY SELECTED BOOKING SLOT SUMMARY --- */}
                  {formData().selectedTimeSlot && (
                    <div class="mt-4 pt-2 border-t border-gray-200">
                      <div class="font-medium text-gray-500 mb-1">Selected Booking Slot:</div>
                      <div>
                        {(() => {
                          try {
                            const slot = formData().selectedTimeSlot;
                            // Adjust date/time formatting based on the actual slot object structure
                            const dateTimeStr = `${slot.date}T${slot.time}:00Z`; // Assume UTC if no offset
                            const dateTime = new Date(dateTimeStr);
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
                            console.error("Error formatting selected slot:", e);
                            return "Selected slot details unavailable";
                          }
                        })()}
                      </div>
                    </div>
                  )}
                  {/* --- --- */}
                </div>
              </div>
            )}

            {/* Step 8: Custom Booking Selection */}
            {currentStep() === 7 && (
              <div class="transition-opacity duration-300">
                <h1 class="text-3xl font-bold mb-2">When would you like to schedule your discovery call?</h1>
                <p class="text-gray-600 mb-6">Select a convenient time slot below.</p>

                {/* Loading State */}
                {isFetchingSlots() && (
                  <div class="flex flex-col items-center justify-center py-10">
                    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-4"></div>
                    <p class="text-gray-600">Loading available times...</p>
                  </div>
                )}

                {/* Error State */}
                {!isFetchingSlots() && slotFetchError() && (
                  <div class="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    <p class="font-medium">Error Loading Slots:</p>
                    <p class="mb-2">{slotFetchError()}</p>
                    <button
                      onClick={() => fetchAvailableSlots('discovery-call')} // Retry with correct slug
                      class="mt-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded transition"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Slots Display (if fetched successfully and have slots) */}
                {!isFetchingSlots() && !slotFetchError() && availableTimeSlots().length > 0 && (
                  <div class="mb-6">
                    <h2 class="text-xl font-semibold mb-4">Available Times</h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {availableTimeSlots().map((slot) => {
                        // --- FORMAT SLOT DATE/TIME NICELY ---
                        // Adjust formatting based on the actual structure of your slot object
                        let displayDate = 'Invalid Date';
                        let displayTime = 'Invalid Time';
                        try {
                          // Example assuming slot has 'date' (YYYY-MM-DD) and 'time' (HH:MM) strings
                          const slotDateTime = new Date(`${slot.date}T${slot.time}:00Z`); // Assume UTC if no offset
                          displayDate = slotDateTime.toLocaleDateString([], {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          });
                          displayTime = slotDateTime.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZoneName: 'short' // Shows timezone abbreviation
                          });
                        } catch (e) {
                          console.error("Error formatting slot datetime:", e, slot);
                          displayDate = slot.date || 'Unknown Date';
                          displayTime = slot.time || 'Unknown Time';
                        }
                        // --- ---

                        return (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData(), selectedTimeSlot: slot });
                              console.log("Selected slot:", slot);
                            }}
                            class={`p-3 rounded-lg border text-left text-sm transition-all duration-200 ease-in-out ${
                              formData().selectedTimeSlot?.id === slot.id // Check using the unique ID
                                ? 'bg-red-500 text-white border-red-500 shadow-md transform scale-[1.02]'
                                : 'border-gray-300 hover:border-red-500 hover:bg-red-50 hover:shadow-sm'
                            }`}
                          >
                            <div class="font-medium">{displayDate}</div>
                            <div class="text-xs opacity-90">{displayTime}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* No Slots Available Message */}
                {!isFetchingSlots() && !slotFetchError() && availableTimeSlots().length === 0 && !isFetchingSlots() && (
                  <div class="text-center py-8 text-gray-500">
                    <p class="mb-2">No available time slots found.</p>
                    <p class="text-sm">Please try again later or contact us directly.</p>
                  </div>
                )}

                {/* Optional: Add a note below the slots */}
                <p class="text-gray-500 text-sm mt-4 text-center">
                  Can't find a suitable time? <a href="mailto:youremail@example.com" class="text-red-500 hover:underline">Contact us</a>.
                </p>
              </div>
            )}

          </div>

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

            {currentStep() < 7 ? ( // Assuming 8 steps (0-7)
              <button
                onClick={nextStep}
                class="bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-6 rounded-lg transition duration-300 text-sm"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting()}
                class={`bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-6 rounded-lg transition duration-300 text-sm flex items-center ${
                  isSubmitting() ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
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
          </div>

          {/* Submission Message */}
          {submitMessage() && (
            <div class={`mt-6 p-4 rounded-lg text-center text-sm ${
              submitMessage().includes('Thank you')
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {submitMessage()}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Qualify;