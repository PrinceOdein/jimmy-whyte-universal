const Header = () => {
  return (
    <>
       <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center">
         <img src="/header.png" class="rounded w-8 h-8" alt=""/>
        </div>
        <nav class="hidden md:flex space-x-5">
          <a href="#services" class="font-medium hover:text-accent transition">Services</a>
          <a href="#work" class="font-medium hover:text-accent transition">Our Work</a>
        </nav>
          <div class="bg-black rounded p-1 text-white">
          <button>
            <a href="#contact" class="bg-black rounded p-1 text-white">Contact</a>
          </button>
          </div>
      </div>
    </header>
    </>
  );
};

export default Header;