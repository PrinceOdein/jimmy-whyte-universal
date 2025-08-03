import { onMount } from 'solid-js';

const Contact = () => {
  onMount(() => {
    // Add pulse animation to button
    const contactButton = document.querySelector('.contact-cta');
    if (contactButton) {
      contactButton.style.animation = 'pulse-accent 2s infinite';
    }
    
    // Add firefly effect
    const fireflyButton = document.querySelector('.contact-firefly');
    if (fireflyButton) {
      fireflyButton.addEventListener('mouseenter', (e) => {
        const rect = e.target.getBoundingClientRect();
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
          
          e.target.appendChild(firefly);
          
          // Remove firefly after animation completes
          setTimeout(() => {
            if (firefly.parentNode) {
              firefly.parentNode.removeChild(firefly);
            }
          }, (duration + delay) * 1000);
        }
      });
    }
  });

  return (
    <section id="contact" class="section-padding bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Brand?</h2>
          <p class="text-xl mb-8 text-gray-600">
            Book your free 30-minute strategy session today.
          </p>
          <button class="contact-cta contact-firefly relative overflow-hidden bg-red-500 hover:bg-red-600 text-white font-medium py-4 px-8 rounded-lg transition duration-300 transform hover:-translate-y-1 text-lg">
            Schedule Your Free Call
          </button>
        </div>
      </div>
    </section>
  );
};

export default Contact;