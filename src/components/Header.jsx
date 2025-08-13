import { createSignal, onMount } from 'solid-js';
import { gsap } from 'gsap';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  onMount(() => {
    // Add pulse animation to contact button
    const contactButton = document.querySelector('.contact-cta');
    if (contactButton) {
      contactButton.style.animation = 'pulse-accent 2s infinite';
    }
  });

  const toggleMenu = () => {
    const menuElement = document.querySelector('.mobile-menu-container');
    
    if (!isMenuOpen()) {
      // Opening the menu
      setIsMenuOpen(true);
      
      // Wait for the next tick to ensure DOM is updated
      setTimeout(() => {
        gsap.set(menuElement, { height: 0, opacity: 0 });
        gsap.to(menuElement, {
          height: "auto",
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            // Animate menu items after container opens
            gsap.fromTo('.mobile-menu li', 
              { opacity: 0, y: -10 },
              { 
                opacity: 1, 
                y: 0, 
                duration: 0.3, 
                stagger: 0.1,
                ease: "power2.out"
              }
            );
          }
        });
      }, 0);
    } else {
      // Closing the menu
      gsap.to(menuElement, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          setIsMenuOpen(false);
        }
      });
    }
  };

  return (
    <>
      <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
          <div class="flex items-center">
            <img src="/header.png" class="rounded w-10 h-10" alt="Brand Studio"/>
          </div>
          
          {/* Desktop Navigation */}
          <nav class="hidden md:flex space-x-8">
            <a href="#services" class="font-medium hover:text-red-500 transition">Services</a>
            <a href="#work" class="font-medium hover:text-red-500 transition">Our Work</a>
          </nav>
          
          <div class="hidden md:block">
            <button class="contact-cta firefly-btn relative overflow-hidden bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300 transform hover:-translate-y-0.5">
              <a href="#/qualify">Contact</a>
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            class="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen() ? (
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen() && (
          <div 
            class="mobile-menu-container md:hidden bg-white border-t overflow-hidden"
            style={{ "transform-origin": "top center" }}
          >
            <div class="container mx-auto px-4 py-4">
              <nav class="mobile-menu flex flex-col space-y-4">
                <li class="list-none">
                  <a 
                    href="#services" 
                    class="block py-2 font-medium hover:text-red-500 transition"
                    onClick={toggleMenu}
                  >
                    Services
                  </a>
                </li>
                <li class="list-none">
                  <a 
                    href="#work" 
                    class="block py-2 font-medium hover:text-red-500 transition"
                    onClick={toggleMenu}
                  >
                    Our Work
                  </a>
                </li>
                <li class="list-none">
                  <button class="contact-cta firefly-btn relative overflow-hidden w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                    <a href="#contact" onClick={toggleMenu}>Contact</a>
                  </button>
                </li>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;