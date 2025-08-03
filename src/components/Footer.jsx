const Footer = () => {
  return (
    <footer class="bg-primary text-white py-12">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-6 md:mb-0">
            <h2 class="text-2xl font-bold text-white">Brand<span class="text-accent">Studio</span></h2>
            <p class="mt-2 text-gray-400">Creating world-class brand experiences</p>
          </div>
          <div class="flex space-x-6">
            <a href="#" class="text-black">Instagram</a>
            <a href="#" class="text-black">LinkedIn</a>
            <a href="#" class="text-black">Twitter</a>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© 2025 JimmyWhyte Universal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;