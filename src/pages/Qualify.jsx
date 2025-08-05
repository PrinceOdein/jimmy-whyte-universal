// src/pages/Qualify.jsx
import { createSignal } from 'solid-js';
import Header from '../components/Header';

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
    
    // Validate required fields
    if (!formData().name || !formData().email || !formData().phone || 
        !formData().company || !formData().revenueRange) {
      setSubmitMessage('Please fill out all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const response = await fetch('https://jimmy-whyte-universal-backend.onrender.com/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData()),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
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
      } else {
        setSubmitMessage(`Error: ${result.message || 'Failed to submit form'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('Error: Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="min-h-screen bg-white text-black">
      <Header />
      <section class="section-padding flex flex-col md:flex-row items-start justify-between gap-8">
        <div class="md:w-1/2">
          <h1 class="text-3xl font-bold mb-6">Start a New Project with Jimmy Whyte</h1>
          <form onSubmit={handleSubmit} class="space-y-4">
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
          </form>
        </div>
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
              type="submit"
              onClick={handleSubmit}
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
      </section>
    </div>
  );
};

export default Qualify;