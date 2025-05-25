import React from 'react';

const CookiePolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-500">Last updated: May 1, 2023</p>
        
        <h2>1. What Are Cookies</h2>
        <p>
          Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners. Cookies help us improve your experience on our platform.
        </p>
        
        <h2>2. How We Use Cookies</h2>
        <p>We use cookies for the following purposes:</p>
        
        <h3>2.1. Necessary Cookies</h3>
        <p>
          These cookies are essential for the operation of our website. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies.
        </p>
        
        <h3>2.2. Preference Cookies</h3>
        <p>
          These cookies enable our website to remember information that changes the way the website behaves or looks, such as your preferred language or the region you are in.
        </p>
        
        <h3>2.3. Analytical Cookies</h3>
        <p>
          These cookies help us understand how visitors interact with our website. They provide us with information about areas visited, time spent on the website, and any issues encountered, such as error messages. This helps us improve the performance of our website.
        </p>
        
        <h3>2.4. Marketing Cookies</h3>
        <p>
          These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third-party advertisers.
        </p>
        
        <h2>3. Types of Cookies We Use</h2>
        
        <h3>3.1. Session Cookies</h3>
        <p>
          These are temporary cookies that expire when you close your browser. They enable our website to remember your actions during a browsing session.
        </p>
        
        <h3>3.2. Persistent Cookies</h3>
        <p>
          These cookies remain on your device for a set period of time or until you delete them. They enable our website to remember your preferences or actions across multiple visits.
        </p>
        
        <h3>3.3. First-Party Cookies</h3>
        <p>
          These cookies are set by our website and can only be read by our website.
        </p>
        
        <h3>3.4. Third-Party Cookies</h3>
        <p>
          These cookies are set by our partners and service providers. Examples include analytics cookies and marketing cookies.
        </p>
        
        <h2>4. Specific Cookies We Use</h2>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Cookie Name</th>
              <th className="text-left p-2">Type</th>
              <th className="text-left p-2">Purpose</th>
              <th className="text-left p-2">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-2">session</td>
              <td className="p-2">Necessary</td>
              <td className="p-2">Maintains your session</td>
              <td className="p-2">Session</td>
            </tr>
            <tr className="border-t bg-gray-50">
              <td className="p-2">_ga</td>
              <td className="p-2">Analytical</td>
              <td className="p-2">Google Analytics - Distinguishes users</td>
              <td className="p-2">2 years</td>
            </tr>
            <tr className="border-t">
              <td className="p-2">_gid</td>
              <td className="p-2">Analytical</td>
              <td className="p-2">Google Analytics - Distinguishes users</td>
              <td className="p-2">24 hours</td>
            </tr>
            <tr className="border-t bg-gray-50">
              <td className="p-2">_gat</td>
              <td className="p-2">Analytical</td>
              <td className="p-2">Google Analytics - Throttles request rate</td>
              <td className="p-2">1 minute</td>
            </tr>
            <tr className="border-t">
              <td className="p-2">language</td>
              <td className="p-2">Preference</td>
              <td className="p-2">Stores language preference</td>
              <td className="p-2">1 year</td>
            </tr>
            <tr className="border-t bg-gray-50">
              <td className="p-2">theme</td>
              <td className="p-2">Preference</td>
              <td className="p-2">Stores theme preference (light/dark)</td>
              <td className="p-2">1 year</td>
            </tr>
          </tbody>
        </table>
        
        <h2>5. Managing Cookies</h2>
        <p>
          Most web browsers allow you to manage your cookie preferences. You can:
        </p>
        <ul>
          <li>Delete cookies from your device</li>
          <li>Block cookies by activating the setting on your browser that allows you to refuse the setting of all or some cookies</li>
          <li>Set your browser to notify you when you receive a cookie</li>
        </ul>
        <p>
          Please note that if you choose to block all cookies, you may not be able to access all or parts of our website. Also, blocking all cookies will not necessarily remove existing cookies from your device.
        </p>
        
        <h3>Browser-Specific Instructions</h3>
        <p>Here are links to cookie management instructions for common browsers:</p>
        <ul>
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">Safari</a></li>
          <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">Microsoft Edge</a></li>
        </ul>
        
        <h2>6. Changes to Our Cookie Policy</h2>
        <p>
          We may update our Cookie Policy from time to time. Any changes will be posted on this page, and the "Last updated" date will be modified. We encourage you to periodically review this Cookie Policy to stay informed about our use of cookies.
        </p>
        
        <h2>7. Contact Us</h2>
        <p>
          If you have any questions or concerns about our use of cookies, please contact us at:
        </p>
        <p>
          Email: privacy@taitanstaking.com<br />
          Address: Taitan Staking Headquarters, 123 Blockchain Avenue, Crypto City, CC 12345
        </p>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
