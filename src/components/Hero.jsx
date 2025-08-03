import { onMount } from 'solid-js';
import { gsap } from 'gsap';

const Hero = () => {
  let heroTitle;
  let heroSubtitle;
  let heroButtons;

  onMount(() => {
    // GSAP staggered fade-in animation for hero content
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
  });

  return (
    <section class="section-padding bg-black text-white">
      <div class="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div class="md:w-1/2 mb-12 md:mb-0">
          <h1 
            ref={el => heroTitle = el}
            class="text-4xl md:text-5xl font-bold mb-6 leading-tight"
          >
            Branding. <span class="text-accent">Design.</span> Xperience
          </h1>
          <p 
            ref={el => heroSubtitle = el}
            class="text-xl mb-8 text-gray-300"
          >
            Helping ambitious founders build brands that captivate audiences and drive growth.
          </p>
          <div 
            ref={el => heroButtons = el}
            class="flex flex-col sm:flex-row gap-4"
          >
            <a href="#contact">
              <button class="bg-transparent border-2 border-white hover:bg-white/10 text-white font-medium py-2 px-5 rounded-lg transition">
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