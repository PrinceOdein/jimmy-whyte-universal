const Services = () => {
  return (
    <section id="services" class="section-padding bg-white">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p class="text-gray-600">
            We help brands stand out with exceptional design and strategy.
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div class="card text-center">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3">Brand Strategy</h3>
            <p class="text-gray-600">
              Develop a clear brand identity that resonates with your target audience.
            </p>
          </div>
          
          <div class="card text-center">
            <div class="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3">Web Design</h3>
            <p class="text-gray-600">
              Beautiful, responsive websites that convert visitors into customers.
            </p>
          </div>
          
          <div class="card text-center">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3">Brand Identity</h3>
            <p class="text-gray-600">
              Logo design, brand guidelines, and visual identity systems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;