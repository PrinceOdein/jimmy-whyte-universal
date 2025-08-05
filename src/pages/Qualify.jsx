// src/pages/Qualify.jsx
import { createSignal } from 'solid-js';
import Header from '../components/Header';
// Import the Supabase client
import { supabase } from '../lib/supabaseClient'; // Adjust path if needed

const Qualify = () => {
  const [formData, setFormData] = createSignal({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    revenueRange: '',
    projectDetails: '',
    servicesInterested: [],
  });

  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [submitMessage, setSubmitMessage] = createSignal('');

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
    setFormData(prev => {
      const currentServices = [...prev.servicesInterested];
      const index = currentServices.indexOf(service);

      if (index >= 0) {
        currentServices.splice(index, 1);
      } else {
        currentServices.push(service);
      }

      return {
        ...prev,
        servicesInterested: currentServices
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!formData().name || !formData().email || !formData().phone ||
        !formData().company || !formData().revenueRange) {
      setSubmitMessage('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      console.log("Attempting to insert lead into Supabase..."); // Debug log

      // Prepare data for Supabase
      const leadData = {
        name: formData().name,
        email: formData().email,
        phone: formData().phone,
        company: formData().company,
        website: formData().website || null, // Handle optional fields
        revenue_range: formData().revenueRange, // Match DB column name
        project_details: formData().projectDetails || null, // Match DB column name
        // Convert array to JSON string for storage in a text column
        // If using JSONB column, you might pass the array directly: services_interested: formData().servicesInterested
        services_interested: JSON.stringify(formData().servicesInterested) // Match DB column name
      };

      // Insert data into the 'leads' table
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData]);

      if (error) {
        throw error; // Handle Supabase errors
      }

      console.log('Lead saved to Supabase:', data);
      setSubmitMessage('Thank you! Your information has been submitted successfully.');

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        website: '',
        revenueRange: '',
        projectDetails: '',
        servicesInterested: [],
      });

    } catch (error) {
      console.error('Error saving lead to Supabase:', error);
      console.error('Error details:', error.message, error.details, error.hint); // More detailed error logging
      setSubmitMessage(`Error: ${error.message || 'Failed to submit form. Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="min-h-screen bg-white text-black">
      <Header />
      <section class="section-padding flex flex-col md:flex-row items-start justify-between gap-8">
        {/* ... Left column with form inputs ... */}
        <div class="md:w-1/2">
          <h1 class="text-3xl font-bold mb-6">Start a New Project with Jimmy Whyte</h1>
          <form onSubmit={handleSubmit} class="space-y-4">
            {/* ... input fields ... make sure they have 'name', 'email', etc. as values ... */}
             <input
              type="text"
              placeholder="Your name*"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:outline-none"
              value={formData().name}
              onInput={(e) => setFormData({ ...formData(), name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Your e-mail*"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:outline-none"
              value={formData().email}
              onInput={(e) => setFormData({ ...formData(), email: e.target.value })}
              required
            />
             <input
              type="tel"
              placeholder="Phone Number*"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:outline-none"
              value={formData().phone}
              onInput={(e) => setFormData({ ...formData(), phone: e.target.value })}
              required
            />
             <input
              type="text"
              placeholder="Company Name*"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:outline-none"
              value={formData().company}
              onInput={(e) => setFormData({ ...formData(), company: e.target.value })}
              required
            />
             <input
              type="url"
              placeholder="Company Website"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:outline-none"
              value={formData().website}
              onInput={(e) => setFormData({ ...formData(), website: e.target.value })}
            />
             <select
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:outline-none"
              value={formData().revenueRange}
              onInput={(e) => setFormData({ ...formData(), revenueRange: e.target.value })}
              required
            >
              <option value="">Select Monthly Revenue Range*</option>
              <option value="$5000-$10000">$5,000 - $10,000</option>
              <option value="$15000-$25000">$15,000 - $25,000</option>
              <option value="$25000-$95000">$25,000 - $95,000</option>
              <option value="$100000-$200000">$100,000 - $200,000</option>
              <option value="$200000+">$200,000+</option>
            </select>
             <textarea
              placeholder="Tell us about your project..."
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:outline-none resize-none"
              rows="4"
              value={formData().projectDetails}
              onInput={(e) => setFormData({ ...formData(), projectDetails: e.target.value })}
            ></textarea>
            {/* ... end of form inputs ... */}
          </form>
        </div>

        {/* ... Right column with services and submit button ... */}
        <div class="md:w-1/2">
          <h2 class="text-xl font-bold mb-4">I'm interested in...</h2>
          <div class="flex flex-wrap gap-2">
            {servicesList.map((service) => (
              <button
                type="button"
                onClick={() => toggleService(service)}
                class={`px-4 py-2 rounded-lg border transition duration-300 ${
                  formData().servicesInterested.includes(service)
                    ? 'bg-red-500 text-white border-red-500'
                    : 'border-gray-300 hover:bg-red-500 hover:text-white'
                }`}
              >
                {service}
              </button>
            ))}
          </div>
          <div class="mt-8">
            <button
              type="submit" // Make sure this is type="submit" and inside the <form>
              onClick={handleSubmit} // This might be redundant if inside <form onSubmit>, but can stay
              disabled={isSubmitting()}
              class={`bg-red-500 hover:bg-red-600 text-white font-medium py-4 px-8 rounded-lg transform rotate-45 transition duration-300 ${
                isSubmitting() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting() ? 'Sending...' : 'Send'}
            </button>
            {submitMessage() && (
              <p class={`mt-4 text-center ${
                submitMessage().includes('Thank you') ? 'text-green-600' : 'text-red-600'
              }`}>
                {submitMessage()}
              </p>
            )}
          </div>
        </div>
        {/* ... end of right column ... */}
      </section>
    </div>
  );
};

export default Qualify;