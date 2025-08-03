import { onMount } from 'solid-js';
import { gsap } from 'gsap';

const Hero = () => {
  let heroTitle;
  let heroSubtitle;
  let heroButtons;

  onMount(() => {
    // GSAP animations for content
    gsap.fromTo(heroTitle, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.2 }
    );
    
    gsap.fromTo(heroSubtitle, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.4 }
    );
    
    gsap.fromTo(heroButtons, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.6 }
    );
    
    // Add pulse animation to buttons
    const pulseButtons = document.querySelectorAll('.pulse-btn');
    pulseButtons.forEach(button => {
      if (button.classList.contains('bg-accent')) {
        button.style.animation = 'pulse-accent 2s infinite';
      } else {
        button.style.animation = 'pulse-primary 2s infinite';
      }
    });
    
    // Add firefly effect to buttons
    const fireflyButtons = document.querySelectorAll('.firefly-btn');
    fireflyButtons.forEach(button => {
      button.addEventListener('mouseenter', (e) => createFireflies(e.target));
    });
  });
  
  const createFireflies = (button) => {
    const rect = button.getBoundingClientRect();
    const fireflyCount = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < fireflyCount; i++) {
      const firefly = document.createElement('div');
      firefly.className = 'absolute w-2 h-2 rounded-full bg-white pointer-events-none';
      firefly.style.boxShadow = '0 0 8px 2px rgba(255, 255, 255, 0.8)';
      firefly.style.zIndex = '10';
      
      // Position firefly at random point within button
      const startX = Math.random() * rect.width;
      const startY = Math.random() * rect.height;
      
      firefly.style.left = `${startX}px`;
      firefly.style.top = `${startY}px`;
      
      // Random animation duration and delay
      const duration = 1 + Math.random() * 2;
      const delay = Math.random() * 0.5;
      
      firefly.style.animation = `firefly ${duration}s ${delay}s forwards`;
      
      button.appendChild(firefly);
      
      // Remove firefly after animation completes
      setTimeout(() => {
        if (firefly.parentNode) {
          firefly.parentNode.removeChild(firefly);
        }
      }, (duration + delay) * 1000);
    }
  };

  return (
    <section class="section-padding bg-black text-white">
      <div class="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div class="md:w-1/2 mb-12 md:mb-0">
          <h1 
            ref={el => heroTitle = el}
            class="text-4xl md:text-5xl font-bold mb-6 leading-tight"
          >
            Branding. <span class="text-red-500">Design.</span> Xperience
          </h1>
          <p 
            ref={el => heroSubtitle = el}
            class="text-xl mb-8 text-gray-300"
          >
            We are a creative agency, crafting innovative business experiences hooked on value.
          </p>
          <div 
            ref={el => heroButtons = el}
            class="flex flex-col sm:flex-row gap-4"
          >
            <a href="#contact">
              <button class="firefly-btn pulse-btn relative overflow-hidden bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg transition duration-300 transform hover:-translate-y-1">
                Get in Touch
              </button>
            </a>
          </div>
        </div>
        <div class="md:w-1/2 flex justify-center">
          {/* You can add your logo back here when ready */}
          <img src="/logo.png" alt="logo" />
        </div>
      </div>
    </section>
  );
};

export default Hero;