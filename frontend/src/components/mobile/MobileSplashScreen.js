import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MobileSplashScreen = ({ onLoadComplete }) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setTimeout(() => {
        if (onLoadComplete) onLoadComplete();
      }, 700); // Allow more time for the elegant exit animation
    }, 2800);

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  if (!showSplash) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-gradient-to-br from-[#1E0B3E] via-[#2D1155] to-[#1A073A] flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Animated particles */}
      <div className="absolute inset-0" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 blur-sm"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [Math.random() * 20 - 10, Math.random() * -20 + 10, Math.random() * 20 - 10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 5 + 10,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(circle at center, rgba(147, 51, 234, 0.3) 0%, rgba(0, 0, 0, 0) 70%)"
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Logo and content container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Outer glow effect */}
        <div className="absolute inset-0 rounded-full bg-purple-500/10 blur-3xl -m-10" />
        
        {/* Main logo animation */}
        <motion.div
          className="mb-8 relative"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: 0.3,
          }}
        >
          {/* 3D platform with shadows */}
          <div className="relative w-28 h-28">
            <div className="absolute -inset-1 bg-black/20 rounded-2xl translate-y-1 blur-sm"></div>
            
            {/* Hexagon background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-purple-600 via-primary-600 to-purple-700 rounded-xl"
              animate={{ rotate: [0, 360] }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                <path 
                  d="M50 0 L93.3 25 V75 L50 100 L6.7 75 V25 Z" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.2)" 
                  strokeWidth="1"
                />
              </svg>
            </motion.div>
            
            {/* Floating logo elements */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ 
                rotateZ: [0, -5, 5, 0],
                y: [0, -3, 3, 0],
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {/* Logo T */}
              <motion.div
                className="bg-white h-14 w-14 rounded-lg shadow-lg flex items-center justify-center relative overflow-hidden"
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              >
                {/* Shiny overlay effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent"
                  animate={{ 
                    x: ['-100%', '100%'],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                />
                <span className="text-primary-600 font-bold text-3xl">T</span>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Circles orbiting the main logo */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute w-4 h-4 rounded-full bg-primary-400/40 backdrop-blur-sm"
              style={{ top: '15%', left: '10%' }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <motion.div
              className="absolute w-3 h-3 rounded-full bg-purple-400/30 backdrop-blur-sm"
              style={{ bottom: '20%', right: '15%' }}
              animate={{
                rotate: [0, -360],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        </motion.div>
        
        {/* Brand name with letter-by-letter animation */}
        <div className="relative">
          <motion.h1 
            className="text-2xl font-bold tracking-wider text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {/* Animate each letter separately */}
            {"TAITAN".split('').map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.7 + i * 0.1, 
                  type: "spring",
                  stiffness: 100,
                  damping: 12
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>
          
          {/* Animated underline */}
          <motion.div
            className="h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent mt-1 mx-auto"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          />
          
          <motion.p 
            className="text-center text-white/70 text-xs mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            Blockchain Staking Platform
          </motion.p>
        </div>
        
        {/* Features row with staggered animations */}
        <motion.div
          className="mt-8 flex justify-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          {[
            { text: 'Secure', icon: '🛡️', delay: 0 },
            { text: 'Simple', icon: '✨', delay: 0.1 },
            { text: 'Profitable', icon: '💎', delay: 0.2 }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="rounded-md px-3 py-1.5"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 1.9 + item.delay,
                type: "spring",
                stiffness: 400,
                damping: 15
              }}
            >
              <div className="flex flex-col items-center">
                <span className="mb-1 text-base">{item.icon}</span>
                <span className="text-xs font-medium text-white/80">{item.text}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Loading indicator */}
        <motion.div
          className="mt-12 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          <motion.div 
            className="w-10 h-10 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute h-full w-full rounded-full border-2 border-t-white border-r-white/30 border-b-white/10 border-l-white/30"></div>
            <div className="absolute inset-1 rounded-full border border-white/20"></div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MobileSplashScreen;
