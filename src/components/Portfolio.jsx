const Portfolio = () => {
  return (
    <section id="work" class="section-padding bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Featured Work</h2>
          <p class="text-black text-2xl">
            Check out some of our recent projects.
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 gap-8">
          <div class="card">
            <div class="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <h3 class="text-xl font-bold mb-2">Petrostar</h3>
            {/* <!-- <p class="text-gray-600">Complete brand identity and website redesign for a SaaS company.</p> --> */}
          </div>
          
          <div class="card">
            <div class="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <h3 class="text-xl font-bold mb-2">Judora</h3>
            {/* <!-- <p class="text-gray-600">Brand strategy and packaging design for sustainable products.</p> --> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;