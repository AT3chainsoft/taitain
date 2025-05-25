import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ServerIcon,
  GlobeAltIcon,
  LightBulbIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const MobileAboutPage = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

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

  // Stats data
  const stats = [
    { id: 1, name: 'Total Value Locked', value: '$15M+' },
    { id: 2, name: 'Active Users', value: '10,000+' },
    { id: 3, name: 'Weekly Returns', value: 'Up to 3%' },
    { id: 4, name: 'Supported Networks', value: '4' },
  ];

  // FAQ data
  const faqs = [
    {
      question: 'What is Taitan Staking Platform?',
      answer: 'Taitan is a cryptocurrency staking platform that allows you to earn passive income on your USDT and USDC holdings. We offer up to 3% weekly returns with flexible lock periods ranging from 1 to 12 months.'
    },
    {
      question: 'How does staking work on Taitan?',
      answer: 'You deposit your USDT or USDC to our platform, select a staking package or create a custom one, and earn passive income. Your returns are calculated weekly and you can track them in real-time on your dashboard.'
    },
    {
      question: 'Is there a minimum investment amount?',
      answer: 'Yes, the minimum investment amount is $100 USDT/USDC for our standard packages. For custom packages, the minimum is also $100.'
    },
    {
      question: 'Which networks do you support for deposits?',
      answer: 'We currently support deposits via TRC20 (Tron) and Polygon networks for both USDT and USDC.'
    },
    {
      question: 'How do I withdraw my funds?',
      answer: 'You can request a withdrawal from your dashboard. For active stakings, you\'ll need to wait until the lock period is over. For completed stakings, you can withdraw your principal and profits at any time.'
    },
    {
      question: 'Is my investment safe?',
      answer: 'We prioritize security with bank-grade encryption, regular security audits, and multi-signature wallets. We also maintain a reserve fund to ensure stability and reliability of the platform.'
    }
  ];

  const toggleFAQ = (index) => {
    if (openFAQ === index) {
      setOpenFAQ(null);
    } else {
      setOpenFAQ(index);
    }
  };

  return (
    <div className="pb-20">
      {/* Hero section */}
      <div className="relative bg-gradient-to-b from-primary-900 to-primary-800 text-white px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <h1 className="text-2xl font-bold mb-2">About Taitan Staking</h1>
          <div className="w-16 h-1 bg-primary-400 mb-4"></div>
          <p className="text-primary-100 text-sm mb-4">
            Taitan is a premier staking platform designed to provide secure, 
            user-friendly, and profitable staking options for cryptocurrency holders.
          </p>
        </motion.div>
      </div>
      
      {/* Mission statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white shadow-md mx-4 px-4 py-5 rounded-lg -mt-5 relative z-10"
      >
        <h2 className="text-lg font-semibold text-primary-800 mb-2">Our Mission</h2>
        <p className="text-gray-600 text-sm">
          We aim to bring financial opportunities to everyone by providing secure staking solutions 
          with exceptional returns, helping investors grow their digital assets with confidence.
        </p>
      </motion.div>
      
      {/* Stats section */}
      <section className="py-6 px-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Taitan by Numbers</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 + stat.id * 0.1 }}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-100"
            >
              <dt className="text-sm font-medium text-gray-500">{stat.name}</dt>
              <dd className="mt-1 text-xl font-semibold text-primary-600">{stat.value}</dd>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Why choose us section */}
      <motion.section
        className="py-6 px-4 bg-gray-50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-4">Why Choose Taitan</h2>
        
        <div className="space-y-4">
          <motion.div variants={itemVariants} className="bg-white p-4 rounded-lg shadow-sm flex items-start space-x-3">
            <div className="bg-green-100 p-2 rounded-md">
              <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">High Returns</h3>
              <p className="text-sm text-gray-600">Weekly returns of up to 3% on all staked assets</p>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white p-4 rounded-lg shadow-sm flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-md">
              <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Enterprise Security</h3>
              <p className="text-sm text-gray-600">Multi-signature wallets and regular security audits</p>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white p-4 rounded-lg shadow-sm flex items-start space-x-3">
            <div className="bg-purple-100 p-2 rounded-md">
              <ServerIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Multi-Network Support</h3>
              <p className="text-sm text-gray-600">Support for all major networks</p>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white p-4 rounded-lg shadow-sm flex items-start space-x-3">
            <div className="bg-orange-100 p-2 rounded-md">
              <GlobeAltIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">24/7 Global Support</h3>
              <p className="text-sm text-gray-600">Our support team is always ready to help</p>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* FAQ Section */}
      <section className="py-6 px-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-lg shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <button 
                className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-sm font-medium text-gray-900">{faq.question}</h3>
                {openFAQ === index ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {openFAQ === index && (
                <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-100 pt-2">
                  {faq.answer}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Security commitment */}
      <section className="py-6 px-4 bg-primary-50">
        <div className="flex items-start space-x-3 mb-4">
          <div className="bg-primary-100 p-2 rounded-md">
            <ShieldCheckIcon className="h-6 w-6 text-primary-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Our Security Commitment</h2>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          At Taitan, we prioritize the security of your assets above all else. Our platform employs:
        </p>
        
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center">
            <LightBulbIcon className="h-4 w-4 text-primary-600 mr-2" />
            <span>Multi-signature wallet technology</span>
          </li>
          <li className="flex items-center">
            <LightBulbIcon className="h-4 w-4 text-primary-600 mr-2" />
            <span>Regular third-party security audits</span>
          </li>
          <li className="flex items-center">
            <LightBulbIcon className="h-4 w-4 text-primary-600 mr-2" />
            <span>Cold storage for majority of assets</span>
          </li>
          <li className="flex items-center">
            <LightBulbIcon className="h-4 w-4 text-primary-600 mr-2" />
            <span>24/7 monitoring systems</span>
          </li>
        </ul>
      </section>
      
      {/* Contact Us */}
      <div className="mt-6 px-4 text-center">
        <p className="text-sm text-gray-600 mb-2">Have more questions about Taitan?</p>
        <motion.div
          whileTap={{ scale: 0.97 }}
          className="bg-primary-600 text-white rounded-lg py-3 text-sm font-medium shadow-sm"
        >
          Contact Support
        </motion.div>
      </div>
    </div>
  );
};

export default MobileAboutPage;
