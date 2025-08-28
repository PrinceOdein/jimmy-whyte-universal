import { Link } from 'react-router-dom';
const Header = () => {
    return(
              <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-red-600">Brand<span className="text-accent">Studio</span></h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="services" className="font-medium hover:text-accent transition">Services</a>
            <a href="#work" className="font-medium hover:text-accent transition">Our Work</a>
          </nav>
          <Link to="/qualify">
            <button className="bg-gray-200 hover:bg-red-600 text-black font-medium py-3 px-6 rounded-lg transition duration-300 text-sm">
              Free Strategy Call
            </button>
          </Link>
        </div>
      </header>
    );
}

export default Header;