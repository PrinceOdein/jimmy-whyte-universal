// src/App.jsx
import { createSignal, onMount, onCleanup } from 'solid-js';
import './index.css';
// Make sure these component files exist in src/pages/
import Home from './pages/Home'; 
import Qualify from './pages/Qualify';

function App() {
  // Signal to track which view to show
  const [currentView, setCurrentView] = createSignal('home');

  // Function to determine which view to show based on URL hash
  const handleHashChange = () => {
    const hash = window.location.hash.slice(1); // Remove the '#'
    console.log("Hash changed to:", hash); // Debug log
    
    if (hash === '/qualify') {
      setCurrentView('qualify');
    } else {
      // Default to home for any other hash or no hash
      setCurrentView('home');
    }
  };

  // Set up the hash change listener when component mounts
  onMount(() => {
    console.log("App mounted"); // Debug log
    // Set initial view based on current hash
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Cleanup listener when component unmounts
    onCleanup(() => {
      console.log("Cleaning up hash listener"); // Debug log
      window.removeEventListener('hashchange', handleHashChange);
    });
  });

  return (
    <div>
      {/* Show Home component when currentView is 'home' */}
      {currentView() === 'home' && <Home />}
      
      {/* Show Qualify component when currentView is 'qualify' */}
      {currentView() === 'qualify' && <Qualify />}
    </div>
  );
}

export default App;