// src/pages/Qualify.jsx
import { useState, createEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { supabase } from '../lib/supabaseClient';

const Qualify = () => {
  // --- State Management ---
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
    // --- ADD BOOKING RELATED FIELD ---
    selectedTimeSlot: null, // To store the selected slot object
    // --- ---
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [direction, setDirection] = useState('forward'); // For animation direction

  // --- ADDITIONAL STATE FOR BOOKING ---
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]); // Array of slot objects from API
  const [slotFetchError, setSlotFetchError] = useState(null);
  // --- ---

  const navigate = useNavigate();

  // --- Define Conversation Steps ---
  const steps = [
    {
      id: 'intro',
      title: "Hi there! I'm excited to learn about your project.",
      subtitle: "Let's start with a few quick questions.",
      component: () => (
        <div class="text-center py-6">
          <p class="text-lg">This will help us understand your needs.</p>
        </div>
      ),
      required: [],
    },
    {
      id: 'contact',
      title: "What's your name?",
      subtitle: "And how can we reach you?",
      component: () => (
        <div class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              id="name"
              type="text"
              placeholder="e.g., Alex Johnson"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition"
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
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition"
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
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition"
              value={formData().phone}
              onInput={(e) => setFormData({ ...formData(), phone: e.target.value })}
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
        <div class="space-y-4">
          <div>
            <label for="company" class="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
            <input
              id="company"
              type="text"
              placeholder="e.g., InnovateX Inc."
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition"
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
              placeholder="e.g., https://innovatex.com  "
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition"
              value={formData().website}
              onInput={(e) => setFormData({ ...formData(), website: e.target.value })}
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
          <label for="revenueRange" class="block text-sm font-medium text-gray-700 mb-1">Select Range *</label>
          <select
            id="revenueRange"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition appearance-none bg-white"
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
      ),
      required: ['revenueRange'],
    },
    {
      id: 'project',
      title: "What can you tell me about your project?",
      subtitle: "Share your goals, challenges, or any specific outcomes you're hoping to achieve.",
      component: () => (
        <div>
          <label for="projectDetails" class="block text-sm font-medium text-gray-700 mb-1">Project Details</label>
          <textarea
            id="projectDetails"
            placeholder="Describe your project, goals, or challenges..."
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black transition resize-none"
            rows="4"
            value={formData().projectDetails}
            onInput={(e) => setFormData({ ...formData(), projectDetails: e.target.value })}
            autoFocus
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
          const currentServices = [...formData().servicesInterested];
          const index = currentServices.indexOf(service);
          if (index >= 0) {
            currentServices.splice(index, 1);
          } else {
            currentServices.push(service);
          }
          setFormData({ ...formData(), servicesInterested: currentServices });
        };

        return (
          <div class="space-y-3">
            {servicesList.map((service) => (
              <button
                type="button"
                onClick={() => toggleService(service)}
                class={`w-full text-left px-4 py-3 rounded-lg border transition duration-200 ease-in-out flex items-center ${
                  formData().servicesInterested.includes(service)
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                }`}
              >
                <div class={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 flex-shrink-0 ${
                  formData().servicesInterested.includes(service)
                    ? 'border-white bg-white'
                    : 'border-gray-400'
                }`}>
                  {formData().servicesInterested.includes(service) && (
                    <svg class="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span class="text-sm">{service}</span>
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
        // --- FETCH AVAILABLE SLOTS FROM BACKEND PROXY ---
        const fetchAvailableSlots = async (eventTypeSlug = 'discovery-call') => { // Default to your event type
          setIsFetchingSlots(true);
          setSlotFetchError(null);
          setAvailableTimeSlots([]); // Clear previous slots

          try {
            // --- IMPORTANT: REPLACE WITH YOUR DEPLOYED BACKEND FUNCTION URL ---
            // This should be the public URL of your deployed proxy function
            // Example for Vercel: `https://your-project.vercel.app/api/calcom-slots`
            const PROXY_ENDPOINT_URL = '/api/calcom-slots'; // Adjust this path
            // --- ---

            // Construct the full URL with the required query parameter
            const url = new URL(PROXY_ENDPOINT_URL, window.location.origin); // Handles relative/absolute URLs correctly
            url.searchParams.append('eventTypeSlug', eventTypeSlug);
            // Optional: Add other parameters like date range, timezone if your backend supports them
            // url.searchParams.append('timeZone', Intl.DateTimeFormat().resolvedOptions().timeZone);

            console.log("Fetching slots from proxy endpoint:", url.toString()); // Debug log

            const response = await fetch(url.toString());

            // Check if the response is okay (status 200-299)
            if (!response.ok) {
              // Handle potential errors from your backend proxy function
              let errorMessage = 'Failed to fetch time slots.';
              try {
                // Try to parse the error message sent by your backend
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage; // Use backend error message if available
              } catch (e) {
                // If parsing the error response fails, use status text
                errorMessage = `Error ${response.status}: ${response.statusText}`;
              }
              // Throw the error to be caught by the `catch` block below
              throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log("Successfully fetched slots from backend proxy:", data); // Debug log

            // --- CRUCIAL: PROCESS THE API RESPONSE ---
            // You MUST adapt this part based on the EXACT structure of the response
            // returned by your backend proxy function.
            // The structure depends on how your backend formats the data received from Cal.com.

            // Example 1: If your backend returns a simple array of slots
            let processedSlots = [];
            if (Array.isArray(data)) {
              processedSlots = data;
            }
            // Example 2: If your backend returns an object with a 'slots' property
            else if (data && Array.isArray(data.slots)) {
              processedSlots = data.slots;
            }
            // Example 3: If Cal.com API returns a complex structure, your backend might flatten it
            // Check your backend function's `slotsData` structure and map it here.
            // For example, if slots are under `data.data.slots`:
            // else if (data && data.data && Array.isArray(data.data.slots)) {
            //     processedSlots = data.data.slots;
            // }
            // Add more conditions as needed based on your backend's response format.

            // Ensure slots have unique identifiers if not already present
            // This helps with React list keys and selection logic
            const slotsWithIds = processedSlots.map((slot, index) => ({
              ...slot,
              // Use existing ID if available, otherwise create one based on date/time
              id: slot.id || slot.uid || `slot-${index}-${slot.date}-${slot.time}` 
            }));

            console.log("Processed slots for display in UI:", slotsWithIds); // Debug log
            // --- ---

            // Update the state with the fetched and processed slots
            setAvailableTimeSlots(slotsWithIds);

          } catch (error) {
            // Handle any errors that occurred during the fetch or processing
            console.error("Error occurred while fetching or processing Cal.com slots:", error);
            // Set a user-friendly error message in the state
            setSlotFetchError(error.message || 'An unexpected error occurred while fetching time slots.');
            // Clear the slots array on error to avoid showing stale/incorrect data
            setAvailableTimeSlots([]);
          } finally {
            // Always set the loading state to false when the fetch attempt finishes (success or error)
            setIsFetchingSlots(false);
          }
        };

        // --- EFFECT TO FETCH SLOTS WHEN COMPONENT MOUNTS ---
        // This effect runs once when the booking step component is first rendered
        createEffect(() => {
          // Optional: Check if slots are already fetched to avoid unnecessary calls
          // if (availableTimeSlots().length === 0 && !isFetchingSlots()) {
            fetchAvailableSlots('discovery-call'); // Use your actual event type slug
          // }
        }, []); // Empty dependency array means it runs only once on mount
        // --- ---

        // --- FORMAT SLOT DATE/TIME FOR DISPLAY ---
        const formatSlotDateTime = (slot) => {
          try {
            // Adjust formatting based on the actual structure of your slot object
            // Example assuming slot has 'date' (YYYY-MM-DD) and 'time' (HH:MM) strings
            // and potentially a 'utcOffset' or assumed UTC
            const slotDateTime = new Date(`${slot.date}T${slot.time}:00Z`); // Assume UTC if no offset
            // Or if slot.time includes offset: const slotDateTime = new Date(`${slot.date}T${slot.time}`);
            
            const displayDate = slotDateTime.toLocaleDateString([], {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            });
            const displayTime = slotDateTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              timeZoneName: 'short' // Shows timezone abbreviation
            });
            
            return { displayDate, displayTime };
          } catch (e) {
            console.error("Error formatting slot datetime:", e, slot);
            // Fallback if formatting fails
            return { 
              displayDate: slot.date || 'Unknown Date', 
              displayTime: slot.time || 'Unknown Time' 
            };
          }
        };
        // --- ---

        return (
          <div class="transition-opacity duration-300">
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
                    const { displayDate, displayTime } = formatSlotDateTime(slot);
                    
                    return (
                      <button
                        type="button"
                        onClick={() => {
                          // Update formData with the selected slot
                          setFormData({ ...formData(), selectedTimeSlot: slot });
                          console.log("Selected slot:", slot); // Debug log
                        }}
                        class={`p-3 rounded-lg border text-left text-sm transition-all duration-200 ease-in-out ${
                          formData().selectedTimeSlot?.id === slot.id // Check using the unique ID
                            ? 'bg-red-500 text-white border-red-500 shadow-md transform scale-[1.02]'
                            : 'border-gray-300 hover:bg-red-500 hover:text-white'
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

            {/* Optional: Show Selected Slot Summary */}
            {formData().selectedTimeSlot && (
              <div class="mt-4 p-3 bg-gray-100 rounded-lg">
                <div class="font-medium text-gray-700 mb-1">Selected Booking Slot:</div>
                <div>
                  {(() => {
                    try {
                      // Adjust date/time formatting based on the actual slot object structure
                      const slot = formData().selectedTimeSlot;
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

            {/* Optional: Add a note below the slots */}
            <p class="text-gray-500 text-sm mt-4 text-center">
              Can't find a suitable time? <a href="mailto:youremail@example.com" class="text-red-500 hover:underline">Contact us</a>.
            </p>
          </div>
        );
      },
      required: [], // Optional selection for now, but good to collect
    },
    {
      id: 'review',
      title: "Here's a summary of the information you provided:",
      subtitle: "Please review and make any necessary changes before submitting.",
      component: () => (
        <div class="bg-gray-50 p-5 rounded-lg space-y-3 text-sm">
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
                    // Adjust date/time formatting based on the actual slot object structure
                    const slot = formData().selectedTimeSlot;
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
      ),
      required: [],
    },
    {
      id: 'submit',
      title: "Thanks for sharing those details!",
      subtitle: "Are you ready to submit your information?",
      component: () => (
        <div class="text-center py-4">
          <div class="flex justify-center mb-4">
            <div class="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
          </div>
          <p class="text-gray-600">We'll be in touch soon to discuss how we can help bring your project to life.</p>
        </div>
      ),
      required: [],
    }
  ];

  // --- Navigation Logic ---
  const nextStep = () => {
    const currentStepIndex = currentStep();
    const stepData = steps[currentStepIndex];

    // Basic validation for required fields in the current step
    if (stepData.required && stepData.required.length > 0) {
      let isValid = true;
      for (const field of stepData.required) {
        const fieldValue = formData()[field];
        if (!fieldValue || (typeof fieldValue === 'string' && fieldValue.trim() === '')) {
          isValid = false;
          break;
        }
        // Handle array fields like servicesInterested if they become required
        // else if (field === 'servicesInterested' && Array.isArray(fieldValue) && fieldValue.length === 0) {
        //   isValid = false;
        //   break;
        // }
      }
      if (!isValid) {
        alert(`Please fill out the required field(s) on this step.`);
        return; // Stop if validation fails
      }
    }

    // Move to next step or submit
    if (currentStepIndex < steps.length - 1) {
      setDirection('forward');
      setCurrentStep(currentStepIndex + 1);
    } else {
      handleSubmit(); // Call submit function on final step
    }
  };

  const prevStep = () => {
    const currentStepIndex = currentStep();
    if (currentStepIndex > 0) {
      setDirection('backward');
      setCurrentStep(currentStepIndex - 1);
    }
  };

  // --- Submission Logic ---
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      console.log("Attempting to insert lead into Supabase...");

      // --- Prepare data for Supabase ---
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
      // --- ---

      const { data, error } = await supabase
        .from('leads') // Make sure this matches your actual table name
        .insert([leadData]);

      if (error) {
        throw error;
      }

      console.log('Lead (with booking intent) saved to Supabase:', data);
      setSubmitMessage('Thank you! Your information and preferred time slot have been submitted successfully. We will contact you shortly.');

      // Optional: Reset form or redirect after successful submission
      // setFormData({ name: '', email: '', ... }); 
      // setCurrentStep(0); // Go back to the first step

    } catch (error) {
      console.error('Error saving lead to Supabase:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      setSubmitMessage(`Error: ${error.message || 'Failed to submit form. Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Get Current Step Data ---
  const currentStepIndex = currentStep();
  const currentStepData = steps[currentStepIndex];

  return (
    <div class="min-h-screen bg-white text-black">
      <Header />
      <section class="section-padding max-w-2xl mx-auto px-4">
        <div class="bg-gray-50 rounded-2xl p-6 md:p-8 shadow-sm">
          
          {/* Progress Bar */}
          <div class="mb-8">
            <div class="flex justify-between text-xs text-gray-500 mb-2">
              <span>Step {currentStepIndex + 1}</span>
              <span>{steps.length} total</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                class="bg-red-500 h-1.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div>
            <h1 class="text-2xl md:text-3xl font-bold mb-3">{currentStepData.title}</h1>
            {currentStepData.subtitle && (
              <p class="text-gray-600 mb-6">{currentStepData.subtitle}</p>
            )}
            
            <div class="mb-8">
              {/* Render the current step's component */}
              {currentStepData.component()}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div class="flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              class={`py-2.5 px-5 rounded-lg border text-sm font-medium transition ${
                currentStepIndex === 0 
                  ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-400' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Back
            </button>

            {currentStepIndex < steps.length - 1 ? (
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