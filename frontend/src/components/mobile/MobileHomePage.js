import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRightIcon, 
  ChartBarIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  LockClosedIcon,
  UserGroupIcon,
  PlayCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const MobileHomePage = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // YouTube video loading - specific mobile implementation
  const youtubeContainerRef = useRef(null);
  const youtubeModalRef = useRef(null);
  
  useEffect(() => {
    // Function to load YouTube API and set up the player
    const loadYouTubeAndSetupPlayer = () => {
      // Check if YouTube API is already loaded
      if (!window.YT) {
        // If not loaded, create script tag and add to head
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        
        // Create YouTube player after API loads
        window.onYouTubeIframeAPIReady = initializeYouTubePlayer;
        
        // Insert script tag
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        // If API already loaded, initialize player directly
        initializeYouTubePlayer();
      }
    };
    
    // Initialize YouTube player
    const initializeYouTubePlayer = () => {
      if (window.YT && window.YT.Player && youtubeContainerRef.current) {
        // Create the player with the corrected aspect ratio
        new window.YT.Player(youtubeContainerRef.current, {
          videoId: 'tYVSgbN0BJ8',
          playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            showinfo: 0,
            mute: 0,
            origin: window.location.origin,
            modestbranding: 1
          }
        });
      }
    };
    
    loadYouTubeAndSetupPlayer();
    
    return () => {
      // Cleanup function
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);
  
  // Initialize modal video player when modal is shown
  useEffect(() => {
    if (showVideoModal && youtubeModalRef.current && window.YT && window.YT.Player) {
      new window.YT.Player(youtubeModalRef.current, {
        videoId: 'tYVSgbN0BJ8',
        playerVars: {
          autoplay: 1,
          controls: 1,
          rel: 0,
          showinfo: 0,
          origin: window.location.origin,
          modestbranding: 1
        }
      });
    }
  }, [showVideoModal]);

  // Open full-screen video modal
  const openVideoModal = () => {
    setShowVideoModal(true);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  };

  // Close video modal
  const closeVideoModal = () => {
    setShowVideoModal(false);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary-900 to-primary-800 text-white px-4 py-12 rounded-b-3xl shadow-lg overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-10 right-0 w-32 h-32 rounded-full bg-primary-700/30 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-primary-600/20 blur-3xl"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <h1 className="text-3xl font-bold mb-3">
            Earn up to <span className="text-yellow-400">3%</span> weekly returns
          </h1>
          
          <p className="text-primary-50 text-sm mb-8">
            Join thousands of investors on Taitan's secure blockchain staking platform
          </p>
          
          <div className="flex flex-col space-y-3">
            <Link to="/register" className="btn-primary">
              <span>Get Started Now</span>
              <ArrowRightIcon className="h-5 w-5 ml-2" />
            </Link>
            
            <Link to="/login" className="btn-secondary">
              <LockClosedIcon className="h-4 w-4 mr-1" />
              <span>Sign In</span>
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Stats Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white shadow-lg mx-4 px-4 py-5 rounded-xl -mt-6 relative z-10 grid grid-cols-3"
      >
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">Users</p>
          <p className="text-xl font-bold text-gray-900">15k+</p>
        </div>
        <div className="text-center border-l border-r border-gray-100">
          <p className="text-sm font-medium text-gray-500">TVL</p>
          <p className="text-xl font-bold text-gray-900">$25M+</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">Returns</p>
          <p className="text-xl font-bold text-primary-600">3%</p>
        </div>
      </motion.div>
      
      {/* YouTube Video Section - Fixed aspect ratio */}
      <motion.div
        className="mt-8 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <PlayCircleIcon className="h-5 w-5 mr-2 text-primary-600" />
              How Taitan Works
            </h2>
            
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={openVideoModal}
              className="text-xs text-primary-600 font-medium flex items-center"
            >
              Full Screen
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" />
              </svg>
            </motion.button>
          </div>
          
          {/* Fixed aspect ratio container */}
          <div className="relative w-full rounded-lg overflow-hidden shadow-sm" style={{ paddingTop: '56.25%' }}>
            {/* YouTube player will replace this div, maintaining 16:9 aspect ratio */}
            <div 
              id="youtube-player" 
              ref={youtubeContainerRef} 
              className="absolute top-0 left-0 w-full h-full rounded-lg bg-gray-100"
            ></div>
          </div>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            Learn how Taitan helps you maximize your crypto investments
          </p>
        </div>
      </motion.div>
      
      {/* Features Section */}
      <motion.div 
        className="px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Why Choose Taitan</h2>
        
        <div className="space-y-6">
          <motion.div variants={itemVariants} className="feature-card">
            <div className="feature-icon bg-green-100">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">High Weekly Returns</h3>
              <p className="text-gray-600">Earn up to 3% weekly on your staked assets</p>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="feature-card">
            <div className="feature-icon bg-blue-100">
              <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Bank Grade Security</h3>
              <p className="text-gray-600">Your assets are protected with enterprise security</p>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="feature-card">
            <div className="feature-icon bg-purple-100">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Flexible Staking</h3>
              <p className="text-gray-600">Choose from different packages and lock periods</p>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="feature-card">
            <div className="feature-icon bg-orange-100">
              <UserGroupIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Referral Program</h3>
              <p className="text-gray-600">Earn 5% on friends' first investments</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-primary-900 to-primary-800 mx-4 my-6 p-6 rounded-xl text-white"
      >
        <h2 className="text-xl font-bold mb-2">Ready to start earning?</h2>
        <p className="text-primary-100 mb-4">Join Taitan today and experience secure blockchain staking</p>
        <Link to="/register" className="w-full bg-white text-primary-700 py-3 rounded-lg font-medium flex items-center justify-center">
          Create Account
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </Link>
      </motion.div>
      
      {/* Video Modal - Full optimized for mobile */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black p-3 flex flex-col">
          <div className="flex justify-end mb-2">
            <button 
              onClick={closeVideoModal}
              className="text-white p-1"
              aria-label="Close video"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-grow flex items-center justify-center">
            <div className="w-full h-full max-h-[calc(100vw*9/16)]">
              <div className="relative w-full h-0" style={{ paddingTop: '56.25%' }}>
                <div 
                  id="youtube-modal-player"
                  ref={youtubeModalRef}
                  className="absolute inset-0 w-full h-full"
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Additional CSS for components */}
      <style jsx>{`
        .btn-primary {
          @apply bg-white text-primary-700 font-medium py-3 px-6 rounded-lg flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all;
        }
        .btn-secondary {
          @apply bg-white/20 backdrop-blur-sm text-white font-medium py-3 px-6 rounded-lg border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all;
        }
        .feature-card {
          @apply bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center;
        }
        .feature-icon {
          @apply p-3 rounded-full;
        }
      `}</style>
    </div>
  );
};

export default MobileHomePage;
