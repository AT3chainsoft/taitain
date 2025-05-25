import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoWhite from './LogoWhite';
import { ChatBubbleLeftRightIcon, EnvelopeIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to subscribe the user
    console.log(`Subscribing email: ${email}`);
    setSubscribed(true);
    setEmail('');
    
    // Reset the subscribed state after 5 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo and description */}
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center space-x-2">
              <LogoWhite className="h-10 w-auto text-white" />
            </div>
            <p className="text-gray-300 text-base">
              The premier platform for cryptocurrency staking. Secure, efficient, and user-friendly solutions to maximize your digital asset returns.
            </p>
            <div className="flex space-x-6">
              {/* Social media icons - Only YouTube, Facebook and Telegram */}
               <a href="https://www.facebook.com/share/1AaxMWDANB/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
               
              <a href="https://t.me/taitaninvest" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">Telegram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              <a href="https://youtube.com/@taitanstaking?si=Zo2DXr8IyzgVyutU" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <span className="sr-only">YouTube</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            
            </div>
          </div>
          
          {/* Links */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Platform</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/staking" className="text-base text-gray-300 hover:text-white">Staking</Link>
                  </li>
                  <li>
                    <Link to="/referral" className="text-base text-gray-300 hover:text-white">Referrals</Link>
                  </li>
                  <li>
                    <Link to="/forum" className="text-base text-gray-300 hover:text-white">Community Forum</Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="text-base text-gray-300 hover:text-white">Dashboard</Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/support" className="text-base text-gray-300 hover:text-white">Customer Support</Link>
                  </li>
                  <li>
                    <Link to="/documentation" className="text-base text-gray-300 hover:text-white">Documentation</Link>
                  </li>
                
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
                <ul className="mt-4 space-y-4">
                 
                 
                  <li>
                    <Link to="/support" className="text-base text-gray-300 hover:text-white">
                      <ChatBubbleLeftRightIcon className="inline-block h-5 w-5 mr-1" />
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/privacy-policy" className="text-base text-gray-300 hover:text-white">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link to="/terms-of-service" className="text-base text-gray-300 hover:text-white">Terms of Service</Link>
                  </li>
                  <li>
                    <Link to="/cookie-policy" className="text-base text-gray-300 hover:text-white">Cookie Policy</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 text-center">© 2025 Taitan Staking Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
