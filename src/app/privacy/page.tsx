import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - CarParts',
  description: 'Our privacy policy and data protection practices',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <p className="text-muted-foreground text-lg mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          At CarParts, we collect information you provide directly to us, such as when you create an account, 
          make a purchase, or contact customer service. This may include:
        </p>
        <ul>
          <li>Name and contact information</li>
          <li>Shipping and billing addresses</li>
          <li>Payment information</li>
          <li>Order history</li>
          <li>Email communications and preferences</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Process and fulfill your orders</li>
          <li>Communicate with you about your orders and account</li>
          <li>Provide customer support</li>
          <li>Send you promotional communications (with your consent)</li>
          <li>Improve our services and website functionality</li>
          <li>Prevent fraud and enhance security</li>
        </ul>

        <h2>3. Information Sharing</h2>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share your 
          information with:
        </p>
        <ul>
          <li>Service providers who assist with order fulfillment and shipping</li>
          <li>Payment processors to complete transactions</li>
          <li>Analytics providers to improve our services</li>
          <li>Law enforcement when required by law</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal data 
          against unauthorized access, alteration, disclosure, or destruction. This includes encryption 
          of sensitive information and regular security audits.
        </p>

        <h2>5. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt-out of marketing communications</li>
          <li>Export your data in a portable format</li>
        </ul>

        <h2>6. Cookies</h2>
        <p>
          We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, 
          and personalize content. You can control cookie preferences through your browser settings.
        </p>

        <h2>7. Third-Party Links</h2>
        <p>
          Our website may contain links to third-party sites. We are not responsible for the privacy 
          practices of these external sites and encourage you to review their privacy policies.
        </p>

        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this privacy policy periodically. We will notify you of significant changes via 
          email or through a notice on our website.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          If you have questions about this privacy policy or how we handle your data, please contact us at:
        </p>
        <p className="not-prose">
          <a href="mailto:eltunjalilli@gmail.com" className="text-primary hover:underline font-medium">
            eltunjalilli@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
