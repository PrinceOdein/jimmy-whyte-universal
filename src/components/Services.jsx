import { createSignal, onCleanup, onMount } from 'solid-js';
import { gsap } from 'gsap';

const Services = () => {
  const services = [
    {
      title: "Brand Management & Consultation",
      description: "Strategic guidance to build, maintain, and elevate your brand identity in the marketplace.",
      icon: (
        <svg class="h-8 w-8 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Interactive Design",
      description: "Engaging digital experiences that captivate users and drive meaningful interactions.",
      icon: (
        <svg class="h-8 w-8 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      )
    },
    {
      title: "App/Web Development",
      description: "Custom digital solutions built with cutting-edge technology for optimal performance.",
      icon: (
        <svg class="h-8 w-8 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      title: "Product Packaging",
      description: "Innovative packaging designs that protect your product and tell your brand story.",
      icon: (
        <svg class="h-8 w-8 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      title: "Print Solutions",
      description: "High-quality printed materials that extend your brand presence offline.",
      icon: (
        <svg class="h-8 w-8 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      )
    },
    {
      title: "New Media & Event Services",
      description: "Immersive digital and physical experiences that create lasting brand impressions.",
      icon: (
        <svg class="h-8 w-8 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Trainings",
      description: "Expert-led workshops to empower your team with brand and design knowledge.",
      icon: (
        <svg class="h-8 w-8 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  let sectionRef;
  let cards = [];
  const [isVisible, setIsVisible] = createSignal(false);

  const handleScroll = () => {
    if (!sectionRef) return;
    
    const sectionTop = sectionRef.getBoundingClientRect().top;
    const sectionBottom = sectionRef.getBoundingClientRect().bottom;
    const windowHeight = window.innerHeight;
    
    // Check if section is in viewport
    if (sectionTop < windowHeight * 0.75 && sectionBottom > 0) {
      if (!isVisible()) {
        setIsVisible(true);
        animateCards();
      }
    } else if (isVisible()) {
      setIsVisible(false);
      resetCards();
    }
  };

  const animateCards = () => {
    gsap.fromTo(
      cards,
      { 
        opacity: 0, 
        y: 30,
        borderColor: "transparent"
      },
      { 
        opacity: 1, 
        y: 0,
        borderColor: "#e2e8f0",
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        borderWidth: 1
      }
    );
  };

  const resetCards = () => {
    gsap.set(cards, { 
      opacity: 0, 
      y: 30,
      borderColor: "transparent",
      borderWidth: 0
    });
  };

  onMount(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    // Add pulse animation to CTA button
    const ctaButton = document.querySelector('.services-cta');
    if (ctaButton) {
      ctaButton.style.animation = 'pulse-accent 2s infinite';
    }
  });

  onCleanup(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  return (
    <section 
      id="services" 
      ref={sectionRef}
      class="section-padding bg-white"
    >
      <div class="container mx-auto px-4">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p class="text-gray-600">
            Comprehensive solutions to elevate your brand presence
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              ref={el => cards[index] = el}
              class="bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-xl border border-transparent hover:border-gray-200 opacity-0"
              style={{ "border-style": "solid" }}
            >
              <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 class="text-xl font-bold mb-3">{service.title}</h3>
              <p class="text-gray-600 mb-4">
                {service.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Enhanced CTA Section */}
        <div class="text-center mt-16">
          <a href="#contact">
            <button class="services-cta firefly-btn relative overflow-hidden bg-red-500 hover:bg-red-600 text-white font-medium py-4 px-8 rounded-lg transition duration-300 transform hover:-translate-y-1 text-lg">
              Start Your Project Today
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;