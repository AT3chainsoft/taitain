import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  ChartBarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayIcon,
  SparklesIcon,
  GlobeAltIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { PlayCircleIcon } from '@heroicons/react/24/solid';
import ROICalculator from '../components/ROICalculator';
import StakingCard from '../components/StakingCard';
import { motion } from 'framer-motion';

const stats = [
  { id: 1, name: 'Total Value Locked', value: '$15M+' },
  { id: 2, name: 'Active Users', value: '10,000+' },
  { id: 3, name: 'Weekly Returns', value: 'Up to 3%' },
  { id: 4, name: 'Supported Networks', value: '4' },
];

const features = [
  {
    name: 'High Yield Staking',
    description: 'Earn up to 3% weekly returns on your USDT/USDC investments with our optimized staking strategy.',
    icon: ArrowTrendingUpIcon,
    color: 'bg-gradient-to-br from-blue-500 to-blue-600',
  },
  {
    name: 'Security First',
    description: 'Your assets are secured with bank-grade encryption and multi-layer protection systems.',
    icon: ShieldCheckIcon,
    color: 'bg-gradient-to-br from-green-500 to-green-600',
  },
  {
    name: 'Transparent Earnings',
    description: 'Track your earnings in real-time with our detailed dashboard and reporting tools.',
    icon: ChartBarIcon,
    color: 'bg-gradient-to-br from-purple-500 to-purple-600',
  },
  {
    name: 'Flexible Lock Periods',
    description: 'Choose staking periods from 1 to 12 months to align with your financial goals.',
    icon: BanknotesIcon,
    color: 'bg-gradient-to-br from-amber-500 to-amber-600',
  },
  {
    name: 'Multi-Network Support',
    description: 'Deposit using TRC20 or Polygon networks for maximum flexibility and lower fees.',
    icon: GlobeAltIcon,
    color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
  },
  {
    name: 'Referral Rewards',
    description: 'Earn 5% commission on your friends\' first investments through our referral program.',
    icon: UserGroupIcon,
    color: 'bg-gradient-to-br from-pink-500 to-pink-600',
  },
];

const testimonials = [
  {
    name: 'Michael R.',
    role: 'Software Developer',
    content: 'I\'ve been staking USDT with Titan for 8 months. Started with $2,000 and have earned $1,620 so far. The weekly payouts are consistent and I appreciate the transparency in how returns are calculated. The dashboard analytics make it easy to track my growth.',
  },
  {
    name: 'Jennifer K.',
    role: 'Finance Professional',
    content: 'After comparing several staking platforms, I chose Titan because of their security features and consistent returns. I\'ve staked $5,000 across different packages and earned an average of 2.8% weekly. The customer service team is responsive when I needed help with my first withdrawal.',
  },
  {
    name: 'Ahmed H.',
    role: 'Crypto Enthusiast',
    content: 'The referral program actually works! I shared my code with just 3 friends who invested, and I\'ve earned $760 in commissions. The platform is intuitive even for people new to staking, and I love that I can customize my staking periods based on my financial plans.',
  },
];

const faqs = [
  {
    question: 'What is Titan Staking Platform?',
    answer: 'Titan is a cryptocurrency staking platform that allows you to earn passive income on your USDT and USDC holdings. We offer up to 3% weekly returns with flexible lock periods ranging from 1 to 12 months.',
  },
  {
    question: 'How does staking work on Titan?',
    answer: 'You deposit your USDT or USDC to our platform, select a staking package or create a custom one, and earn passive income. Your returns are calculated weekly and you can track them in real-time on your dashboard.',
  },
  {
    question: 'Is there a minimum investment amount?',
    answer: 'Yes, the minimum investment amount is $100 USDT/USDC for our standard packages. For custom packages, the minimum is also $100.',
  },
  {
    question: 'Which networks do you support for deposits?',
    answer: 'We currently support deposits via TRC20 (Tron) and Polygon networks for both USDT and USDC.',
  },
  {
    question: 'How do I withdraw my funds?',
    answer: 'You can request a withdrawal from your dashboard. For active stakings, you\'ll need to wait until the lock period is over. For completed stakings, you can withdraw your principal and profits at any time.',
  },
  {
    question: 'How does the referral program work?',
    answer: 'You earn 5% commission on the initial investment amount of anyone you refer to our platform. There\'s no limit to how many people you can refer or how much you can earn through referrals.',
  },
  {
    question: 'Is my investment safe?',
    answer: 'We prioritize security with bank-grade encryption, regular security audits, and multi-signature wallets. We also maintain a reserve fund to ensure stability and reliability of the platform.',
  },
  {
    question: 'How long does it take for deposits to be credited?',
    answer: 'Deposits are typically processed within 24 hours after we receive them. Once approved, they\'ll be immediately available in your account.',
  }
];

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [openFAQs, setOpenFAQs] = useState({});
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const videoRef = useRef(null);

  // Animation scroll tracking
  const [isVisible, setIsVisible] = useState({
    hero: true,
    video: false,
    stats: false,
    features: false,
    packages: false,
    testimonials: false,
    faq: false,
    cta: false,
  });

  // Animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.85;
      
      // Get position of each section
      const sections = {
        video: document.getElementById('video-section'),
        stats: document.getElementById('stats-section'),
        features: document.getElementById('features-section'),
        packages: document.getElementById('packages-section'),
        testimonials: document.getElementById('testimonials-section'),
        faq: document.getElementById('faq'),
        cta: document.getElementById('cta-section'),
      };
      
      // Check if sections are visible
      Object.entries(sections).forEach(([key, section]) => {
        if (section && scrollPosition > section.offsetTop) {
          setIsVisible(prev => ({ ...prev, [key]: true }));
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // YouTube video handler - specific to desktop implementation
  useEffect(() => {
    // Initialize YouTube iframe API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(tag, firstScript);
    }
    
    // When modal opens, ensure we have control of the player
    if (isVideoModalOpen && videoRef.current) {
      // Use a timeout to ensure iframe is loaded
      const timer = setTimeout(() => {
        try {
          // Try to postMessage to the iframe to pause/play
          videoRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } catch (error) {
          console.log('Video player not ready yet');
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isVideoModalOpen]);

  const toggleFAQ = (index) => {
    setOpenFAQs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
    // Pause video if it's playing
    if (videoRef.current) {
      try {
        videoRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } catch (error) {
        console.log('Could not pause video');
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      {/* Redesigned Hero Section with improved visibility and width */}
      <div id="hero-section" className="relative overflow-hidden min-h-[85vh] bg-gradient-to-b from-slate-900 to-gray-900">
        {/* Solid background overlay to improve visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-primary-900/95 to-slate-900/95"></div>

        {/* Pattern overlay with better visibility */}
        <div className="absolute inset-0 bg-[url('./assets/grid-pattern.svg')] bg-center opacity-10"></div>
          
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary-500/20 blur-md"
            style={{
              width: Math.random() * 8 + 4 + 'px',
              height: Math.random() * 8 + 4 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [Math.random() * 50 - 25, Math.random() * -50 + 25],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 10 + 10,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Improved glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-700/30 blur-[100px]"></div>
        <div className="absolute bottom-1/3 right-1/3 w-[40rem] h-[30rem] rounded-full bg-purple-800/20 blur-[120px]"></div>

        <div className="relative pt-28 pb-24 sm:pt-32 sm:pb-32 lg:pb-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  {/* Changed from max-w-8xl to max-w-7xl for better width */}
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
              <div className="lg:col-span-7 space-y-8"> {/* Reduced space-y from 12 to 8 */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative"
                >
                  {/* Badge with better visibility */}
                  <motion.div
                    className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
                    animate={{ 
                      y: [0, -5, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut",
                    }}
                  >
                    <span className="relative flex h-3 w-3 mr-2 self-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm text-white font-medium">Up to 3% Weekly Returns</span>
                  </motion.div>
                  
                  {/* Improved headline readability */}
                  <motion.h1 
                    className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    <span className="block drop-shadow-lg">Transforming</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-300 via-secondary-300 to-primary-200 drop-shadow-md">
                      Crypto Investing
                    </span>
                  </motion.h1>
                  
                  {/* Improved paragraph readability */}
                  <motion.p 
                    className="mt-6 text-lg sm:text-xl text-gray-200 max-w-2xl font-light"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    Experience unrivaled staking returns with our secure, transparent, and powerful platform designed specifically for serious investors.
                  </motion.p>
                  
                  {/* Buttons with better spacing */}
                  <motion.div
                    className="mt-8 flex flex-col sm:flex-row gap-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <Link
                      to={isAuthenticated ? "/dashboard" : "/register"}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-base font-medium shadow-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 border border-primary-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-600/20 hover:-translate-y-1"
                    >
                      {isAuthenticated ? "View Dashboard" : "Start Investing Now"}
                      <ArrowRightIcon className="ml-3 -mr-1 h-5 w-5" />
                    </Link>
                    
                    <button
                      onClick={openVideoModal}
                      className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-base font-medium text-white bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:border-white/30 hover:shadow-lg"
                    >
                      <PlayCircleIcon className="h-5 w-5 mr-2 text-primary-300" />
                      See How It Works
                    </button>
                  </motion.div>
                </motion.div>
                
                {/* Features list with better spacing */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="flex flex-wrap gap-y-3 gap-x-6 mt-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-2 rounded-lg shadow-inner">
                      <ShieldCheckIcon className="h-5 w-5 text-primary-300" />
                    </div>
                    <p className="text-sm text-gray-200 font-medium">Bank-Grade Security</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-2 rounded-lg shadow-inner">
                      <GlobeAltIcon className="h-5 w-5 text-secondary-300" />
                    </div>
                    <p className="text-sm text-gray-200 font-medium">Multi-Network Support</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-2 rounded-lg shadow-inner">
                      <CurrencyDollarIcon className="h-5 w-5 text-green-400" />
                    </div>
                    <p className="text-sm text-gray-200 font-medium">Instant Withdrawals</p>
                  </div>
                </motion.div>
              </div>
              
              <div className="hidden lg:block lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="relative"
                >
                  {/* Improved card effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 via-secondary-500 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse-slow"></div>
                  
                  {/* Calculator card with better visibility */}
                  <div className="relative bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <div className="relative mb-6">
                      <h3 className="text-xl text-white font-bold">Calculate Your Returns</h3>
                      <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mt-2"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <ROICalculator />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Keep the decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 lg:h-24">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full">
            <path fill="#F9FAFB" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,186.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Video Section - Improved implementation */}
      <div id="video-section" className="relative py-24 bg-gray-900">
        <div className="absolute inset-0 bg-[url('./assets/dot-pattern.svg')] bg-center opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.video ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <SparklesIcon className="h-10 w-10 mx-auto mb-4 text-primary-400" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white">See Titan in Action</h2>
            <p className="mt-3 text-xl text-gray-300 max-w-3xl mx-auto">
              Watch how our platform helps thousands of investors grow their crypto assets with ease
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible.video ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative max-w-4xl mx-auto"
          >
            {/* Enhanced video container with proper aspect ratio */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-70"></div>
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              {/* Fixed aspect ratio container */}
              <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/tYVSgbN0BJ8?enablejsapi=1&modestbranding=1&rel=0"
                  title="Titan Staking Platform Explainer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            
            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
          </motion.div>
          
          <div className="text-center mt-8">
            <a 
              href="https://www.youtube.com/watch?v=tYVSgbN0BJ8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors"
            >
              <span>Watch on YouTube</span>
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Stats Section - Modern, clean design */}
      <div id="stats-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.stats ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Platform Statistics</h2>
            <p className="mt-1 text-3xl sm:text-4xl font-bold text-gray-900">Our Impact in Numbers</p>
            <div className="mt-5 max-w-prose mx-auto">
              <p className="text-xl text-gray-500">
                Discover how Titan is revolutionizing crypto staking for investors worldwide
              </p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible.stats ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:border-primary-100 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-100/20"
              >
                <p className="text-4xl font-bold bg-gradient-to-br from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="mt-4 text-lg font-medium text-gray-500">{stat.name}</p>
                
                {/* Visual element for extra design */}
                <div className="h-1.5 w-12 mt-4 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Features Section - Modern card design */}
      <div id="features-section" className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="absolute opacity-40 -right-64 -top-64 w-96 h-96 rounded-full bg-primary-100 blur-3xl"></div>
        <div className="absolute opacity-40 -left-64 -bottom-64 w-96 h-96 rounded-full bg-secondary-100 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Platform Features</h2>
            <p className="mt-1 text-3xl sm:text-4xl font-bold text-gray-900">Why Choose Titan Staking</p>
            <div className="mt-5 max-w-prose mx-auto">
              <p className="text-xl text-gray-500">
                Our platform combines security, transparency, and high returns to provide the best staking experience
              </p>
            </div>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:border-primary-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.name}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Remaining sections with similar enhancements... */}
      {/* Packages Section */}
      <div id="packages-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.packages ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Investment Options</h2>
            <p className="mt-1 text-3xl sm:text-4xl font-bold text-gray-900">Choose Your Staking Package</p>
            <div className="mt-5 max-w-prose mx-auto">
              <p className="text-xl text-gray-500">
                Select a pre-defined package or create your custom staking plan to match your investment goals
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.packages ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <StakingCard amount={100} percentage={2.5} lockPeriod={1} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.packages ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <StakingCard amount={500} percentage={2.5} lockPeriod={3} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.packages ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <StakingCard amount={1000} percentage={2.5} lockPeriod={3} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.packages ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <StakingCard amount={5000} percentage={3} lockPeriod={5} />
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link
              to={isAuthenticated ? "/staking" : "/register"}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 hover:shadow-xl"
            >
              {isAuthenticated ? "View All Packages" : "Create Custom Package"}
              <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Continue with improved design for testimonials, FAQs, and CTA */}
      {/* Testimonials Section */}
      <div id="testimonials-section" className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className={`text-base font-semibold text-primary-600 tracking-wide uppercase transition-all duration-700 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              TESTIMONIALS
            </h2>
            <p className={`mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl transition-all duration-700 delay-150 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              What Our Users Say
            </p>
            <p className={`max-w-xl mt-5 mx-auto text-xl text-gray-500 transition-all duration-700 delay-300 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Real experiences from investors using our staking platform
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name} 
                className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover-card transition-all duration-700 delay-${index * 150} ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {/* Initial circle with first letter of name instead of image */}
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-blue-600' : index === 1 ? 'bg-purple-600' : 'bg-green-600'
                      }`}>
                        {testimonial.name[0]}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="mt-6 text-gray-700 relative">
                    <svg className="absolute -top-2 -left-2 h-8 w-8 text-gray-200 transform -translate-x-1/2 -translate-y-1/2" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="relative pl-6">
                      {testimonial.content}
                    </p>
                  </div>
                  <div className="mt-6 flex">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <svg
                        key={rating}
                        className="h-5 w-5 text-yellow-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className={`text-base font-semibold text-primary-600 tracking-wide uppercase transition-all duration-700 ${isVisible.faq ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              FAQ
            </h2>
            <p className={`mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl transition-all duration-700 delay-150 ${isVisible.faq ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Frequently Asked Questions
            </p>
            <p className={`max-w-xl mt-5 mx-auto text-xl text-gray-500 transition-all duration-700 delay-300 ${isVisible.faq ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Get answers to the most common questions about Titan Staking Platform.
            </p>
          </div>

          <div className="mt-16 max-w-3xl mx-auto">
            <dl className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={faq.question}
                  className={`bg-white shadow-md rounded-lg transition-all duration-700 delay-${Math.min(index * 100, 500)} ${isVisible.faq ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                >
                  <dt>
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex justify-between items-center p-6 text-left focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                      <span className="ml-6 h-7 flex items-center">
                        <svg
                          className={`${openFAQs[index] ? 'rotate-0' : '-rotate-90'} h-6 w-6 transform transition-transform duration-300`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                  </dt>
                  <dd
                    className={`${
                      openFAQs[index] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden transition-all duration-300`}
                  >
                    <div className="px-6 pb-6 text-base text-gray-500 border-t border-gray-100 pt-4">{faq.answer}</div>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-500">
              Didn't find what you're looking for?{' '}
              <a href="mailto:support@titanstaking.com" className="text-primary-600 hover:text-primary-700 font-medium">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div id="cta-section" className="bg-gradient-to-r from-primary-600 to-secondary-600 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-700 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Ready to start earning?</span>
              <span className="block">Create your account today.</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-primary-100">
              Join thousands of investors already using Titan Staking Platform to grow their crypto assets.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to={isAuthenticated ? "/dashboard" : "/register"}
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 transform transition-all hover:scale-105"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                </Link>
              </div>
              <div className="ml-3 inline-flex">
                <a
                  href="#features-section"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-800 bg-opacity-20 hover:bg-opacity-30 transform transition-all hover:scale-105"
                >
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Modal */}
      {isVideoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm transition-opacity p-0 sm:p-4" 
          onClick={closeVideoModal}
        >
          <motion.div 
            className="relative w-full h-full sm:w-auto sm:h-auto sm:max-w-6xl sm:max-h-[80vh]"
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Close button with improved styling */}
            <button 
              className="absolute top-4 right-4 z-10 text-white hover:text-primary-300 transition-colors p-2 bg-black/30 rounded-full"
              onClick={closeVideoModal}
              aria-label="Close video"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Video container with responsive fullscreen behavior */}
            <div className="relative w-full h-full sm:rounded-lg overflow-hidden">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 sm:rounded-xl blur-md opacity-70"></div>
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <div className="w-full h-full" style={{ maxHeight: '100vh' }}>
                  <iframe
                    ref={videoRef}
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/tYVSgbN0BJ8?enablejsapi=1&autoplay=1&modestbranding=1&rel=0&showinfo=0"
                    title="Titan Staking Platform Explainer"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
