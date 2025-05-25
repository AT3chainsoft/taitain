import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RouteDebugger = () => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <div 
      className={`fixed bottom-4 right-4 bg-black bg-opacity-80 text-green-400 p-2 rounded z-50 text-xs`}
      style={{ maxWidth: expanded ? '400px' : '40px', transition: 'max-width 0.3s ease' }}
    >
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-black font-bold"
      >
        {expanded ? 'x' : '?'}
      </button>
      
      {expanded && (
        <div className="mt-2">
          <h4 className="font-bold mb-1">Page Links:</h4>
          <div className="grid grid-cols-2 gap-1">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/forum" className="hover:text-white">Forum</Link>
            <Link to="/whitepaper" className="hover:text-white">Whitepaper</Link>
            <Link to="/documentation" className="hover:text-white">Documentation</Link>
            <Link to="/security" className="hover:text-white">Security</Link>
            <Link to="/terms-of-service" className="hover:text-white">Terms</Link>
            <Link to="/privacy-policy" className="hover:text-white">Privacy</Link>
            <Link to="/cookie-policy" className="hover:text-white">Cookies</Link>
          </div>
          
          <h4 className="font-bold mt-2 mb-1">Admin Links:</h4>
          <div className="grid grid-cols-2 gap-1">
            <Link to="/admin" className="hover:text-white">Admin Home</Link>
            <Link to="/admin/forum" className="hover:text-white">Admin Forum</Link>
          </div>
          
          <p className="mt-2 text-xs opacity-70">
            Click links to navigate
          </p>
        </div>
      )}
    </div>
  );
};

export default RouteDebugger;
