// src/pages/ThankYou.jsx
import { createSignal, onMount } from 'solid-js';
import Header from '../components/Header';

const ThankYou = () => {
  const [leadName, setLeadName] = createSignal('there'); // Default if no name passed

  onMount(() => {
    // Optional: Retrieve lead name from state/location/search params/localStorage
    // Example using URL search params (requires passing name in URL)
    // const urlParams = new URLSearchParams(window.location.search);
    // const name = urlParams.get('name');
    // if (name) {
    //   setLeadName(name);
    // }
    
    // Example using localStorage (if you saved formData.name before redirecting)
    // try {
    //   const savedName = localStorage.getItem('submittedLeadName');
    //   if (savedName) {
    //     setLeadName(savedName);
    //     // Optionally clear after retrieval
    //     // localStorage.removeItem('submittedLeadName');
    //   }
    // } catch (e) {
    //   console.warn("Could not retrieve lead name from localStorage", e);
    // }
  });

  return (
    <div class="min-h-screen bg-white text-black">
      <Header />
      <main class="py-16 max-w-2xl mx-auto px-4">
        <div class="bg-gray-50 rounded-2xl p-8 shadow-sm">
          <div class="text-center">
            <h1 class="text-3xl md:text-4xl font-bold mb-6 text-green-600">Thank You, {leadName()}!</h1>
            <p class="text-gray-600 mb-8 text-lg">
              Your information has been submitted successfully.
            </p>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-sm mb-8">
            <h2 class="text-2xl font-bold mb-4 text-center">Here's What Happens Next</h2>
            <ul class="space-y-4">
              <li class="flex items-start">
                <span class="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 font-medium">1</span>
                <span><strong class="text-gray-800">Confirmation:</strong> Our team will review your details and send a confirmation email shortly.</span>
              </li>
              <li class="flex items-start">
                <span class="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 font-medium">2</span>
                <span><strong class="text-gray-800">Scheduling:</strong> We will contact you via email to schedule your discovery call at a time that suits you best.</span>
              </li>
              <li class="flex items-start">
                <span class="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 font-medium">3</span>
                <span><strong class="text-gray-800">Discovery Call:</strong> During our call, we'll dive deep into your project goals and explore how we can bring your vision to life.</span>
              </li>
              <li class="flex items-start">
                <span class="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 font-medium">4</span>
                <span><strong class="text-gray-800">Next Steps:</strong> Following the call, we'll outline potential next steps and how we can partner together.</span>
              </li>
            </ul>
          </div>

          <div class="text-center">
            <p class="text-gray-600 mb-6">
              We're excited to connect with you and discuss your project!
            </p>
            <div class="flex justify-center">
              <div class="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThankYou;
