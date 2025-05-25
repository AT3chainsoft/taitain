import React from 'react';
import { ShieldCheckIcon, LockClosedIcon, ServerIcon, DocumentTextIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const SecurityPage = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Security at Taitan Staking
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            We prioritize the security of your assets and personal data above all else.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                      <ShieldCheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    Asset Security
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    All user assets are secured through multi-signature wallets, with the majority of funds stored in cold storage. We regularly conduct security audits and employ industry-leading security protocols.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                      <LockClosedIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    Account Protection
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    We use military-grade encryption for all user data and communications. Two-factor authentication (2FA) is available and strongly recommended for all accounts to add an extra layer of security.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                      <ServerIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    Infrastructure Security
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    Our platform runs on distributed, redundant servers with 24/7 monitoring. We implement robust DDoS protection and maintain multiple failover systems to ensure service reliability.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                      <DocumentTextIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    Smart Contract Audits
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    All smart contracts used by Taitan Staking undergo rigorous security audits by reputable third-party security firms. Audit reports are published for transparency and community review.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                <div className="-mt-6">
                  <div>
                    <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                      <UserGroupIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                    Security Team
                  </h3>
                  <p className="mt-5 text-base text-gray-500">
                    Our dedicated security team consists of industry experts with extensive experience in blockchain security, cryptography, and secure systems design. We continuously monitor for potential threats.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gray-50 rounded-lg overflow-hidden shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Security Best Practices</h3>
            <div className="mt-5 prose prose-indigo text-gray-500">
              <ul>
                <li>Enable two-factor authentication (2FA) on your account</li>
                <li>Use a strong, unique password that you don't use elsewhere</li>
                <li>Be vigilant about phishing attempts - we will never ask for your private keys</li>
                <li>Keep your recovery phrases and private keys secure</li>
                <li>Always verify the URL is titanstaking.com before logging in</li>
                <li>Keep your devices and software up-to-date with security patches</li>
                <li>Use a secure and private internet connection when accessing your account</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-primary-50 rounded-lg overflow-hidden shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Bug Bounty Program</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                We maintain an active bug bounty program to encourage responsible disclosure of security vulnerabilities.
                If you discover a potential security issue, please report it to our security team.
              </p>
            </div>
            <div className="mt-5">
              <a
                href="mailto:security@titanstaking.com"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                Contact Security Team
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
