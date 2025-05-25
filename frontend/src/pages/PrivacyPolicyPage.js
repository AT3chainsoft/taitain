import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-500">Last updated: May 1, 2023</p>
        
        <h2>1. Introduction</h2>
        <p>
          At Taitan Staking, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
        </p>
        
        <h2>2. Information We Collect</h2>
        
        <h3>2.1 Personal Information</h3>
        <p>We may collect the following types of personal information:</p>
        <ul>
          <li>Contact information (email address, phone number)</li>
          <li>Account credentials (excluding passwords, which are hashed)</li>
          <li>KYC information where required by law (identity verification documents)</li>
          <li>Blockchain wallet addresses</li>
          <li>Transaction history on our platform</li>
        </ul>
        
        <h3>2.2 Automatically Collected Information</h3>
        <p>When you access our platform, we automatically collect:</p>
        <ul>
          <li>Device information (IP address, browser type, operating system)</li>
          <li>Usage data (pages visited, time spent on platform)</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
        
        <h2>3. How We Use Your Information</h2>
        <p>We use your personal information for the following purposes:</p>
        <ul>
          <li>To provide and maintain our services</li>
          <li>To process transactions and send related information</li>
          <li>To comply with legal obligations, including AML and KYC requirements</li>
          <li>To send service updates and administrative messages</li>
          <li>To personalize user experience and improve our platform</li>
          <li>To detect, prevent, and address technical issues or fraudulent activities</li>
          <li>To communicate with you about new features or offers (if you've opted in)</li>
        </ul>
        
        <h2>4. Information Sharing and Disclosure</h2>
        <p>We may share your information in the following circumstances:</p>
        <ul>
          <li>With service providers who help us operate our platform</li>
          <li>To comply with legal obligations</li>
          <li>To protect our rights, privacy, safety, or property</li>
          <li>In connection with a business transfer (merger, acquisition, etc.)</li>
          <li>With your consent or at your direction</li>
        </ul>
        <p>We do not sell your personal information to third parties.</p>
        
        <h2>5. Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>
        
        <h2>6. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to collect information about your browsing activities. You can manage your cookie preferences through your browser settings. For more details, please see our <a href="/cookie-policy" className="text-primary-600 hover:text-primary-800">Cookie Policy</a>.
        </p>
        
        <h2>7. Your Data Protection Rights</h2>
        <p>Depending on your location, you may have the following rights:</p>
        <ul>
          <li>Right to access - request copies of your personal data</li>
          <li>Right to rectification - request correction of inaccurate data</li>
          <li>Right to erasure - request deletion of your personal data</li>
          <li>Right to restrict processing - request limiting how we use your data</li>
          <li>Right to data portability - request transfer of your data</li>
          <li>Right to object - object to our processing of your data</li>
        </ul>
        
        <h2>8. Children's Privacy</h2>
        <p>
          Our platform is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you believe we have collected information from a child under 18, please contact us immediately.
        </p>
        
        <h2>9. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We take measures to ensure adequate protection for international transfers of personal data.
        </p>
        
        <h2>10. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>
        
        <h2>11. Contact Us</h2>
        <p>
          If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
        </p>
        <p>
          Email: privacy@taitanstaking.com<br />
          Address: Taitan Staking Headquarters, 123 Blockchain Avenue, Crypto City, CC 12345
        </p>
        
        <h2>12. Regulatory Information</h2>
        <p>
          For EU residents: The data controller for your information is Taitan Staking Ltd. If you are unsatisfied with our response to your privacy concerns, you have the right to complain to your local data protection authority.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
