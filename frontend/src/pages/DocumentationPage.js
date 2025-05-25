import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpenIcon, 
  UserIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon, 
  GiftIcon, 
  ChatBubbleLeftRightIcon, 
  QuestionMarkCircleIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const DocumentationPage = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          current = section.getAttribute('id');
        }
      });

      if (current && current !== activeSection) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div>
      {/* Simplified header section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
              <BookOpenIcon className="h-8 w-8 mr-3 text-white opacity-75" />
              <h1 className="text-2xl md:text-3xl font-bold">Titan Platform Documentation</h1>
            </div>
            <div className="w-full md:w-96">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-white bg-opacity-20 placeholder-gray-300 focus:outline-none focus:bg-white focus:text-gray-900 sm:text-sm"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Sidebar - keeping same structure but updating content */}
            <div className="hidden lg:block lg:col-span-3">
              <nav className="sticky top-20 space-y-1 py-8">
                <div className="px-3 pb-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Table of Contents
                </div>
                
                {/* Same sidebar items structure */}
                <SidebarItem 
                  icon={BookOpenIcon} 
                  text="Introduction" 
                  sectionId="introduction" 
                  activeSection={activeSection} 
                  onClick={() => scrollToSection('introduction')} 
                />
                
                <SidebarItem 
                  icon={UserIcon} 
                  text="Getting Started" 
                  sectionId="getting-started" 
                  activeSection={activeSection} 
                  onClick={() => scrollToSection('getting-started')} 
                />
                
                <SidebarItem 
                  icon={ShieldCheckIcon} 
                  text="Account Security" 
                  sectionId="security" 
                  activeSection={activeSection} 
                  onClick={() => scrollToSection('security')} 
                />
                
                <div className="px-3 pt-6 pb-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Platform Features
                </div>
                
                <SidebarItem 
                  icon={CurrencyDollarIcon} 
                  text="Deposit & Withdraw" 
                  sectionId="deposit-withdraw" 
                  activeSection={activeSection} 
                  onClick={() => scrollToSection('deposit-withdraw')} 
                />
                
                <SidebarItem 
                  icon={ChartBarIcon} 
                  text="Staking Packages" 
                  sectionId="staking-packages" 
                  activeSection={activeSection} 
                  onClick={() => scrollToSection('staking-packages')} 
                />
                
                <SidebarItem 
                  icon={GiftIcon} 
                  text="Referral System" 
                  sectionId="referrals" 
                  activeSection={activeSection} 
                  onClick={() => scrollToSection('referrals')} 
                />
                
                <div className="px-3 pt-6 pb-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Help & Support
                </div>
                
                <SidebarItem 
                  icon={ChatBubbleLeftRightIcon} 
                  text="Contact Support" 
                  sectionId="support" 
                  activeSection={activeSection} 
                  onClick={() => scrollToSection('support')} 
                />
                
                <SidebarItem 
                  icon={QuestionMarkCircleIcon} 
                  text="FAQ" 
                  sectionId="faq" 
                  activeSection={activeSection} 
                  onClick={() => scrollToSection('faq')} 
                />
              </nav>
            </div>
            
            {/* Main content - updating with more practical information */}
            <div className="lg:col-span-9">
              <div className="prose prose-lg max-w-none">
                <DocSection
                  id="introduction"
                  icon={BookOpenIcon}
                  title="Introduction"
                  content={
                    <>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        Welcome to the Titan Platform documentation. This guide will help you navigate our platform and understand how to 
                        use its features effectively. Whether you're new to cryptocurrency staking or an experienced user, 
                        you'll find practical information to help you make the most of our services.
                      </p>
                      
                      <div className="flex flex-wrap gap-4 my-8">
                        <FeatureCard 
                          title="User-Friendly" 
                          description="Simple interface designed for both beginners and experienced users" 
                        />
                        <FeatureCard 
                          title="Flexible Staking" 
                          description="Multiple package options with different timeframes" 
                        />
                        <FeatureCard 
                          title="Transparent" 
                          description="Clear information about fees, returns, and lock periods" 
                        />
                      </div>
                    </>
                  }
                />
                
                <DocSection
                  id="getting-started"
                  icon={UserIcon}
                  title="Getting Started"
                  content={
                    <>
                      <h3 className="text-xl font-semibold text-gray-800">Creating Your Account</h3>
                      <p>
                        To use the Titan Platform, you first need to create an account.:
                      </p>
                      
                      <div className="rounded-lg border border-gray-200 p-6 my-6 bg-gray-50">
                        <h4 className="text-lg font-medium text-gray-800">Registration Options</h4>
                        <ul className="mt-4 pl-6 list-disc space-y-2">
                          <li><strong>Wallet Connection:</strong> Connect directly with MetaMask, Trust Wallet, or other compatible wallets</li>
                        </ul>
                      </div>
                      
                
                      
                      <div className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 my-4">
                        <div className="flex">
                          
                        </div>
                      </div>
                    </>
                  }
                />
                
               
                
                <DocSection
                  id="deposit-withdraw"
                  icon={CurrencyDollarIcon}
                  title="Deposit & Withdraw"
                  content={
                    <>
                      <h3 className="text-xl font-semibold text-gray-800">Making Deposits</h3>
                      <p>
                        To fund your Titan Platform account, you can deposit various cryptocurrencies. Currently, we support 
                        USDT and USDC on multiple networks:
                      </p>
                      
                      <div className="my-6 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Currency
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Networks
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Min. Deposit
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">USDT</td>
                              <td className="px-6 py-4 whitespace-nowrap">TRC20, Polygon</td>
                              <td className="px-6 py-4 whitespace-nowrap">10 USDT</td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap">USDC</td>
                              <td className="px-6 py-4 whitespace-nowrap">TRC20, Polygon</td>
                              <td className="px-6 py-4 whitespace-nowrap">10 USDC</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <p>
                        When making a deposit, follow these steps:
                      </p>
                      
                      <ol className="list-decimal pl-6 my-4 space-y-2">
                        <li>Navigate to the Deposit page from your dashboard</li>
                        <li>Select the cryptocurrency and network you wish to use</li>
                        <li>Send funds to the displayed wallet address (double-check the address)</li>
                        <li>Enter your transaction details and submit them for verification</li>
                        <li>Wait for confirmation (typically 10-30 minutes, depending on network congestion)</li>
                      </ol>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-8">Making Withdrawals</h3>
                      <p>
                        To withdraw funds from your Titan Platform account:
                      </p>
                      
                      <ol className="list-decimal pl-6 my-4 space-y-2">
                        <li>Go to the Withdraw page from your dashboard</li>
                        <li>Enter the withdrawal amount and your wallet address</li>
                        <li>Confirm the withdrawal details</li>
                        <li>Check your email for the withdrawal confirmation link</li>
                        <li>Wait for processing (withdrawals are typically processed within 24 hours)</li>
                      </ol>
                      
                      <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-4 my-4">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Withdrawal Fees</h3>
                            <div className="mt-2 text-sm text-blue-700">
                              <p>
                                Withdrawal fees vary by network. Current fees: TRC20 (1 USDT/USDC), Polygon (2 USDT/USDC).
                                These fees cover network transaction costs and may change based on network conditions.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  }
                />
                
                <DocSection
                  id="staking-packages"
                  icon={ChartBarIcon}
                  title="Staking Packages"
                  content={
                    <>
                      <p>
                        Titan Platform offers different staking packages to suit your investment goals. Each package has its own 
                        lock period and return rate. Below are the current packages available:
                      </p>
                      
                      <div className="my-8">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Available Staking Packages</h3>
                          </div>
                          <div className="px-4 py-5 sm:p-6">
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Amount</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lock Period</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weekly Return</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best For</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$100 Package</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$100</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 month</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2.5% ($2.50)</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Beginners</td>
                                  </tr>
                                  <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$500 Package</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$500</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 months</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2.5% ($12.50)</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Medium investors</td>
                                  </tr>
                                  <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$1000 Package</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$1,000</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 months</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2.5% ($25.00)</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Regular investors</td>
                                  </tr>
                                  <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">$5000 Package</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$5,000</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5 months</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3% ($150.00)</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Serious investors</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-800">How to Start Staking</h3>
                      <ol className="list-decimal pl-6 my-4 space-y-2">
                        <li>Ensure you have sufficient funds in your account</li>
                        <li>Navigate to the Staking page from your dashboard</li>
                        <li>Select a package that meets your investment goals</li>
                        <li>Review the details (amount, lock period, expected returns)</li>
                        <li>Confirm your staking package</li>
                      </ol>
                      
                      <div className="rounded-lg border-l-4 border-green-400 bg-green-50 p-4 my-6">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">Profit Calculation Example</h3>
                            <div className="mt-2 text-sm text-green-700">
                              <p>
                                For a $1,000 stake with 2.5% weekly return over 3 months (≈13 weeks):
                                <br />
                                Weekly profit: $25
                                <br />
                                Total profit: $25 × 13 weeks = $325
                                <br />
                                Total return: $1,000 + $325 = $1,325
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  }
                />
                
                <DocSection
                  id="referrals"
                  icon={GiftIcon}
                  title="Referral System"
                  content={
                    <>
                      <p>
                        Our referral program allows you to earn additional rewards by inviting friends to the Titan Platform. 
                        When someone registers using your referral code and creates a staking package, you'll receive a bonus.
                      </p>
                      
                      <div className="my-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">How the Referral Program Works</h3>
                        
                        <div className="space-y-6">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">1</div>
                            </div>
                            <div className="ml-4">
                              <h4 className="text-base font-medium text-gray-900">Share Your Referral Code</h4>
                              <p className="mt-1 text-sm text-gray-500">
                                Your unique referral code can be found on your dashboard or referral page
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">2</div>
                            </div>
                            <div className="ml-4">
                              <h4 className="text-base font-medium text-gray-900">Friends Register and Stake</h4>
                              <p className="mt-1 text-sm text-gray-500">
                                When friends sign up using your code and make their first stake
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">3</div>
                            </div>
                            <div className="ml-4">
                              <h4 className="text-base font-medium text-gray-900">Earn Referral Bonuses</h4>
                              <p className="mt-1 text-sm text-gray-500">
                                You receive 5% of their first stake amount added directly to your balance
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mt-6">Referral Tracking</h3>
                      <p>
                        You can monitor your referrals and rewards on the Referral page of your dashboard. This page shows:
                      </p>
                      <ul className="list-disc pl-6 my-4 space-y-2">
                        <li>Your unique referral code and referral link</li>
                        <li>Number of users who have registered with your code</li>
                        <li>Total earnings from referrals</li>
                        <li>Detailed history of referral rewards</li>
                      </ul>
                      
                      <div className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 my-4">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                            <div className="mt-2 text-sm text-yellow-700">
                              <p>
                                Referral bonuses are paid when your referred friends make their first stake, not upon registration. 
                                There's no limit to how many people you can refer.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  }
                />
                
                <DocSection
                  id="support"
                  icon={ChatBubbleLeftRightIcon}
                  title="Contact Support"
                  content={
                    <>
                      <p>
                        If you need help with the Titan Platform, our support team is ready to assist you. There are several ways 
                        to get in touch with us:
                      </p>
                      
                      <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                          <h4 className="text-lg font-medium text-gray-900 mb-2">
                            <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600 inline mr-2" />
                            Support Tickets
                          </h4>
                          <p className="text-gray-600 mb-4">
                            Create a support ticket for detailed assistance with account issues or complex questions.
                          </p>
                          <Link to="/support" className="text-primary-600 hover:text-primary-800 font-medium inline-flex items-center">
                            Open a support ticket
                            <ArrowRightIcon className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                        
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-800">Support Hours</h3>
                      <p className="mb-4">
                        Our support team is available Monday through Friday, 9:00 AM to 5:00 PM UTC.
                        We strive to respond to all inquiries within 24 hours during business days.
                      </p>
                      
                      <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-4 my-4">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Before Contacting Support</h3>
                            <div className="mt-2 text-sm text-blue-700">
                              <p>
                                Please check our FAQ section below first, as many common questions are already answered there.
                                This may save you time waiting for a response.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  }
                />
                
                <DocSection
                  id="faq"
                  icon={QuestionMarkCircleIcon}
                  title="Frequently Asked Questions"
                  content={
                    <>
                      <div className="space-y-8 mt-6">
                        <FaqItem 
                          question="What is the minimum deposit amount?"
                          answer="The minimum deposit amount is 10 USDT or 10 USDC, depending on which cryptocurrency you're using."
                        />
                        
                        <FaqItem 
                          question="How long do deposits take to process?"
                          answer="Once your deposit transaction is confirmed on the blockchain, it typically takes 10-30 minutes for funds to appear in your account. During periods of high network congestion, it may take longer."
                        />
                        
                        <FaqItem 
                          question="Can I unstake before the lock period ends?"
                          answer="No, currently all staking packages have fixed lock periods. You must wait until the lock period ends before you can withdraw your staked funds."
                        />
                        
                        <FaqItem 
                          question="When do I receive my staking rewards?"
                          answer="Staking rewards are calculated weekly but are only paid out at the end of your staking period. The total profit amount will be added to your balance when the stake completes."
                        />
                        
                        <FaqItem 
                          question="How do referral bonuses work?"
                          answer="When someone uses your referral code and makes their first stake, you receive 5% of their staked amount as a bonus. For example, if they stake $1,000, you receive $50 added to your balance."
                        />
                        
                        <FaqItem 
                          question="What are the withdrawal fees?"
                          answer="Withdrawal fees depend on the network: TRC20 (1 USDT/USDC) and Polygon (2 USDT/USDC). These fees cover the transaction costs on the respective networks."
                        />
                        
                        <FaqItem 
                          question="How long do withdrawals take to process?"
                          answer="Withdrawal requests are typically processed within 24 hours. After processing, it may take additional time for the funds to appear in your wallet, depending on network congestion."
                        />
                      </div>
                    </>
                  }
                />
                
                <div className="mt-16 bg-gray-50 rounded-lg p-8 border border-gray-200">
                  <div className="max-w-3xl mx-auto text-center">
                    <QuestionMarkCircleIcon className="h-12 w-12 mx-auto text-primary-500" />
                    <h3 className="mt-4 text-2xl font-bold text-gray-900">Still need help?</h3>
                    <p className="mt-2 text-lg text-gray-600">
                      If you couldn't find the answer you're looking for, our support team is ready to help.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/support"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Contact Support
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components

const SidebarItem = ({ icon: Icon, text, sectionId, activeSection, onClick }) => {
  const isActive = activeSection === sectionId;
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full transition-colors duration-200 ${
        isActive 
          ? 'bg-primary-50 text-primary-700 border-l-2 border-primary-500' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
      <span className="truncate">{text}</span>
    </button>
  );
};

const DocSection = ({ id, icon: Icon, title, content }) => {
  return (
    <section id={id} className="scroll-mt-20 mb-16 pb-6 border-b border-gray-200">
      <div className="flex items-center mb-6">
        <div className="bg-primary-100 p-2 rounded-lg mr-3">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      </div>
      {content}
    </section>
  );
};

const FeatureCard = ({ title, description }) => {
  return (
    <div className="flex-1 min-w-[250px] bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
};

const SecurityFeature = ({ title, description }) => {
  return (
    <div className="border border-gray-200 rounded-md shadow-sm p-4 bg-white hover:bg-gray-50 transition-colors duration-150">
      <h4 className="font-medium text-gray-900">{title}</h4>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
};

const StakingStep = ({ number, title, description }) => {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 text-lg font-semibold mb-3">
        {number}
      </div>
      <h4 className="text-lg font-medium text-gray-900">{title}</h4>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  );
};

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 pb-6">
      <button
        className="flex justify-between items-center w-full text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <span className={`ml-6 flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''}`}>
          <svg className="h-6 w-6 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div className={`mt-2 pr-12 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <p className="text-base text-gray-500">{answer}</p>
      </div>
    </div>
  );
};

export default DocumentationPage;
