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
              <h1 className="text-2xl md:text-3xl font-bold">Taitan Staking Documentation</h1>
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
            {/* Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <nav className="sticky top-20 space-y-1 py-8">
                <div className="px-3 pb-4 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Table of Contents
                </div>
                
                <SidebarItem 
                  icon={BookOpenIcon} 
                  text="Introduction" 
                  sectionId="introduction" 
                  activeSection={activeSection} 
                  onClick={() => scrollToSection('introduction')} 
                />
                
                <SidebarItem 
                  icon={UserIcon} 
                  text="Account Setup" 
                  sectionId="account-setup" 
                  activeSection={activeSection} 
                  onClick={() => scrollToSection('account-setup')} 
                />
                
                <SidebarItem 
                  icon={ShieldCheckIcon} 
                  text="Security" 
                  sectionId="security" 
                  activeSection={activeSection} 
                  onClick={() => scrollToSection('security')} 
                />
                
                <div className="px-3 pt-6 pb-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Staking
                </div>
                
                <SidebarItem 
                  icon={CurrencyDollarIcon} 
                  text="Staking Basics" 
                  sectionId="staking-basics" 
                  activeSection={activeSection} 
                  onClick={() => scrollToSection('staking-basics')} 
                />
                
                <SidebarItem 
                  icon={ChartBarIcon} 
                  text="Staking Strategies" 
                  sectionId="strategies" 
                  activeSection={activeSection} 
                  onClick={() => scrollToSection('strategies')} 
                />
                
                <SidebarItem 
                  icon={GiftIcon} 
                  text="Rewards" 
                  sectionId="rewards" 
                  activeSection={activeSection} 
                  onClick={() => scrollToSection('rewards')} 
                />
                
                <div className="px-3 pt-6 pb-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </div>
                
                <SidebarItem 
                  icon={GiftIcon} 
                  text="Referral Program" 
                  sectionId="referrals" 
                  activeSection={activeSection} 
                  onClick={() => scrollToSection('referrals')} 
                />
                
                <SidebarItem 
                  icon={ChatBubbleLeftRightIcon} 
                  text="Support" 
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
            
            {/* Main content */}
            <div className="lg:col-span-9">
              <div className="prose prose-lg max-w-none">
                <DocSection
                  id="introduction"
                  icon={BookOpenIcon}
                  title="Introduction"
                  content={
                    <>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        Welcome to Taitan Staking! This documentation will guide you through using our platform
                        to stake your cryptocurrency assets and earn rewards. Whether you're new to staking or an
                        experienced user, you'll find everything you need to know about our platform here.
                      </p>
                      
                      <div className="flex flex-wrap gap-4 my-8">
                        <FeatureCard 
                          title="Secure" 
                          description="Multi-layer security protocols protecting your assets" 
                        />
                        <FeatureCard 
                          title="Easy" 
                          description="User-friendly interface for beginners and experts alike" 
                        />
                        <FeatureCard 
                          title="Profitable" 
                          description="Maximized returns through optimized staking strategies" 
                        />
                      </div>
                    </>
                  }
                />
                
                <DocSection
                  id="account-setup"
                  icon={UserIcon}
                  title="Account Setup"
                  content={
                    <>
                      <h3 className="text-xl font-semibold text-gray-800">Registration</h3>
                      <p>
                        To start using Taitan Staking, you need to create an account. Registration is simple and 
                        only requires your email address and a secure password. For enhanced security, we recommend 
                        enabling two-factor authentication (2FA) after registration.
                      </p>
                      
                      <div className="rounded-lg border border-gray-200 p-6 my-6 bg-gray-50">
                        <h4 className="text-lg font-medium text-gray-800">Registration Process</h4>
                        <ol className="mt-4 pl-6 list-decimal">
                          <li className="mb-2">Click on the "Sign Up" button in the top-right corner</li>
                          <li className="mb-2">Enter your email address and create a password</li>
                          <li className="mb-2">Verify your email by clicking the link sent to your inbox</li>
                          <li className="mb-2">Complete your profile information</li>
                          <li>Enable 2FA for additional security (recommended)</li>
                        </ol>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-800">Wallet Connection</h3>
                      <p>
                        After creating your account, you'll need to connect your cryptocurrency wallet. We support 
                        various wallet providers to ensure maximum compatibility and user convenience.
                      </p>
                      
                      <div className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 my-4">
                        <div className="flex">
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                            <div className="mt-2 text-sm text-yellow-700">
                              <p>
                                Never share your wallet's private keys or recovery phrases with anyone, including Taitan Staking support.
                                We will never ask for this information.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  }
                />
                
                <DocSection
                  id="security"
                  icon={ShieldCheckIcon}
                  title="Security"
                  content={
                    <>
                      <p>
                        At Taitan Staking, we prioritize the security of your assets and personal information. 
                        We employ industry-leading security practices, including encryption, secure coding practices, 
                        and regular security audits.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                        <SecurityFeature
                          title="Two-Factor Authentication"
                          description="Add an extra layer of security to your account with 2FA"
                        />
                        <SecurityFeature
                          title="Cold Storage"
                          description="Majority of funds are stored in offline cold wallets"
                        />
                        <SecurityFeature
                          title="Regular Audits"
                          description="Third-party security audits of all smart contracts"
                        />
                        <SecurityFeature
                          title="Bug Bounty Program"
                          description="Active program for reporting security vulnerabilities"
                        />
                      </div>
                      
                      <div className="flex my-6">
                        <div className="flex-1 bg-gray-50 rounded-lg p-6 flex items-center">
                          <div>
                            <p className="text-base text-gray-500">For more detailed information about our security measures, please visit our</p>
                            <Link to="/security" className="mt-2 inline-flex items-center text-primary-600 hover:text-primary-800 font-medium">
                              Security page
                              <ArrowRightIcon className="ml-1 h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </>
                  }
                />
                
                <DocSection
                  id="staking-basics"
                  icon={CurrencyDollarIcon}
                  title="Staking Basics"
                  content={
                    <>
                      <p>
                        Staking is the process of participating in transaction validation on a proof-of-stake (PoS) 
                        blockchain. By staking your cryptocurrencies, you help secure the network and earn rewards 
                        in return. Our platform simplifies this process, allowing you to stake your assets with just 
                        a few clicks.
                      </p>
                      
                      <div className="my-8 relative">
                        <div className="relative bg-white p-6 rounded-lg border border-gray-200 overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-500 to-primary-600"></div>
                          <h4 className="text-lg font-medium text-gray-900 mb-4">How Staking Works</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StakingStep 
                              number="01" 
                              title="Deposit" 
                              description="Transfer your crypto assets to your Taitan Staking wallet" 
                            />
                            <StakingStep 
                              number="02" 
                              title="Stake" 
                              description="Choose your staking plan and lock your assets" 
                            />
                            <StakingStep 
                              number="03" 
                              title="Earn" 
                              description="Receive staking rewards automatically" 
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  }
                />
                
                {/* Continue with other sections following the same pattern */}
                <DocSection
                  id="strategies"
                  icon={ChartBarIcon}
                  title="Staking Strategies"
                  content={
                    <>
                      <p>
                        Different staking strategies can be employed depending on your investment goals and risk tolerance. 
                        Our platform offers multiple staking plans with varying lock-up periods and reward rates. Generally, 
                        longer staking periods offer higher rewards but come with less flexibility.
                      </p>
                      
                      <div className="my-8">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Staking Plans Comparison</h3>
                          </div>
                          <div className="px-4 py-5 sm:p-6">
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lock Period</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APY Range</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Best For</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Flexible</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">None</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1-4%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Liquidity needs</td>
                                  </tr>
                                  <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Standard</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">30 days</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4-8%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Balanced approach</td>
                                  </tr>
                                  <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Premium</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">90 days</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8-12%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Growth focus</td>
                                  </tr>
                                  <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Expert</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">180+ days</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12-18%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Maximizing returns</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  }
                />
                
                <DocSection
                  id="rewards"
                  icon={GiftIcon}
                  title="Rewards"
                  content={
                    <>
                      <p>
                        Staking rewards are distributed according to the specific plan you choose. Rewards can be 
                        automatically compounded or withdrawn depending on your preference. The annual percentage 
                        yield (APY) varies based on market conditions and the cryptocurrency being staked.
                      </p>
                      
                      <div className="my-8">
                        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6 border border-primary-100">
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Reward Options</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                              <h5 className="text-primary-600 font-medium mb-2">Auto-Compound</h5>
                              <p className="text-gray-600">Automatically reinvest your rewards to maximize growth over time through the power of compound interest.</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                              <h5 className="text-primary-600 font-medium mb-2">Regular Payout</h5>
                              <p className="text-gray-600">Receive your rewards directly to your wallet at regular intervals to use as you wish.</p>
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
                  title="Referral Program"
                  content={
                    <>
                      <p>
                        Our referral program allows you to earn additional rewards by inviting friends to join 
                        Taitan Staking. When someone signs up using your referral link and makes a qualifying stake, 
                        both you and your referral receive bonus rewards.
                      </p>
                      
                      <div className="flex flex-col md:flex-row gap-6 my-8">
                        <div className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
                          <h4 className="text-lg font-medium text-indigo-900 flex items-center">
                            <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-200 text-indigo-600 mr-2">1</span>
                            You Refer
                          </h4>
                          <p className="mt-2 text-gray-600">Share your unique referral link with friends and colleagues</p>
                        </div>
                        <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
                          <h4 className="text-lg font-medium text-purple-900 flex items-center">
                            <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-purple-200 text-purple-600 mr-2">2</span>
                            They Join
                          </h4>
                          <p className="mt-2 text-gray-600">Your friends create an account and stake crypto assets</p>
                        </div>
                        <div className="flex-1 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg p-6 border border-pink-100">
                          <h4 className="text-lg font-medium text-pink-900 flex items-center">
                            <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-pink-200 text-pink-600 mr-2">3</span>
                            Both Earn
                          </h4>
                          <p className="mt-2 text-gray-600">You both receive bonus rewards on your staking earnings</p>
                        </div>
                      </div>
                    </>
                  }
                />
                
                <DocSection
                  id="support"
                  icon={ChatBubbleLeftRightIcon}
                  title="Support"
                  content={
                    <>
                      <p>
                        If you encounter any issues or have questions, our support team is available 24/7. You can 
                        reach us through the Support page, email at support@titanstaking.com, or through live chat on our platform.
                      </p>
                      
                      <div className="my-8 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                        <div className="divide-y divide-gray-200">
                          <div className="px-6 py-5 flex items-start">
                            <div className="flex-shrink-0">
                              <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600" />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-lg font-medium text-gray-900">Support Tickets</h4>
                              <p className="mt-1 text-gray-600">
                                Create a support ticket for complex issues that require detailed investigation
                              </p>
                              <Link to="/support" className="mt-3 inline-flex items-center text-primary-600 hover:text-primary-800 font-medium">
                                Open a ticket
                                <ArrowRightIcon className="ml-1 h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                          <div className="px-6 py-5 flex items-start">
                            <div className="flex-shrink-0">
                              <QuestionMarkCircleIcon className="h-6 w-6 text-primary-600" />
                            </div>
                            <div className="ml-4">
                              <h4 className="text-lg font-medium text-gray-900">Community Forum</h4>
                              <p className="mt-1 text-gray-600">
                                Get help from the community and share your knowledge with others
                              </p>
                              <Link to="/forum" className="mt-3 inline-flex items-center text-primary-600 hover:text-primary-800 font-medium">
                                Visit forum
                                <ArrowRightIcon className="ml-1 h-4 w-4" />
                              </Link>
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
                          question="What is staking?"
                          answer="Staking is a way of earning rewards by participating in transaction validation on a proof-of-stake blockchain. By locking up your cryptocurrency, you contribute to network security and earn rewards in return."
                        />
                        
                        <FaqItem 
                          question="How are rewards calculated?"
                          answer="Rewards are calculated based on the amount staked, the duration of staking, and the current reward rate for the specific cryptocurrency. The formula typically involves the total staked amount, the staking period, and the annual percentage yield (APY)."
                        />
                        
                        <FaqItem 
                          question="Is there a minimum staking amount?"
                          answer="Yes, minimum staking amounts vary by cryptocurrency. For most major cryptocurrencies, the minimum amount ranges from $50 to $100 worth of tokens. Please check the specific staking page for details on each cryptocurrency."
                        />
                        
                        <FaqItem 
                          question="Can I unstake early?"
                          answer="Early unstaking may be possible depending on the staking plan, but it typically incurs a penalty fee. Flexible staking allows you to withdraw anytime without penalties, while fixed-term staking plans have early withdrawal fees ranging from 5% to 15% of rewards."
                        />
                        
                        <FaqItem 
                          question="How long does it take to receive rewards?"
                          answer="Reward distribution times vary by cryptocurrency and staking plan. Flexible staking rewards are typically distributed daily, while fixed-term staking rewards may be distributed weekly or at the end of the staking period."
                        />
                        
                        <FaqItem 
                          question="Are staking rewards taxable?"
                          answer="In most jurisdictions, staking rewards are considered taxable income. However, tax regulations vary by country, so we recommend consulting with a tax professional for guidance specific to your situation."
                        />
                      </div>
                    </>
                  }
                />
                
                {/* Still Have Questions Section */}
                <div className="mt-16 bg-gradient-to-r from-primary-50 to-indigo-50 rounded-lg p-8 border border-primary-100">
                  <div className="max-w-3xl mx-auto text-center">
                    <QuestionMarkCircleIcon className="h-12 w-12 mx-auto text-primary-500" />
                    <h3 className="mt-4 text-2xl font-bold text-gray-900">Still have questions?</h3>
                    <p className="mt-2 text-lg text-gray-600">
                      Can't find the answer you're looking for? Our team is ready to help you with any questions you may have.
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
