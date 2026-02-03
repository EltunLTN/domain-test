import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions - CarParts',
  description: 'Terms of service and conditions of use',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
        
        <p className="text-muted-foreground text-lg mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using CarParts ({"\"the Website\""}), you accept and agree to be bound by these Terms 
          and Conditions. If you do not agree to these terms, please do not use our services.
        </p>

        <h2>2. Use of Website</h2>
        <p>
          You agree to use the Website only for lawful purposes and in a way that does not infringe the 
          rights of others or restrict their use of the Website. Prohibited behavior includes:
        </p>
        <ul>
          <li>Transmitting unlawful, threatening, or offensive content</li>
          <li>Attempting to gain unauthorized access to our systems</li>
          <li>Using automated systems to scrape or collect data</li>
          <li>Impersonating others or providing false information</li>
        </ul>

        <h2>3. Product Information</h2>
        <p>
          We strive to ensure that product descriptions, images, and pricing information are accurate. 
          However, we do not warrant that product descriptions or other content is error-free, complete, 
          or current. We reserve the right to correct errors and update information without prior notice.
        </p>

        <h2>4. Pricing and Availability</h2>
        <p>
          All prices are listed in USD and are subject to change without notice. We reserve the right to 
          limit quantities and discontinue products. In the event of a pricing error, we will contact you 
          before processing your order.
        </p>

        <h2>5. Orders and Payment</h2>
        <p>
          By placing an order, you warrant that you are legally capable of entering into binding contracts. 
          All orders are subject to acceptance and availability. We accept major credit cards and secure 
          online payment methods.
        </p>

        <h2>6. Shipping and Delivery</h2>
        <p>
          We ship to addresses within the United States. Delivery times are estimates and not guaranteed. 
          Risk of loss and title for items pass to you upon delivery to the carrier. We are not responsible 
          for delays caused by shipping carriers or circumstances beyond our control.
        </p>

        <h2>7. Returns and Refunds</h2>
        <p>
          We accept returns within 30 days of delivery for most items in unused, resalable condition. 
          Original packaging and all accessories must be included. Refunds will be processed to the 
          original payment method within 5-10 business days of receiving the return.
        </p>
        <p>Non-returnable items include:</p>
        <ul>
          <li>Installed or used parts</li>
          <li>Electrical components that have been installed</li>
          <li>Fluids and chemicals</li>
          <li>Custom-ordered parts</li>
        </ul>

        <h2>8. Warranties</h2>
        <p>
          Parts are covered by manufacturer warranties. Warranty terms vary by product and manufacturer. 
          We are not responsible for consequential damages resulting from part failure or installation.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, CarParts shall not be liable for any indirect, incidental, 
          special, or consequential damages arising from your use of the Website or purchase of products.
        </p>

        <h2>10. Intellectual Property</h2>
        <p>
          All content on this Website, including text, graphics, logos, images, and software, is the 
          property of CarParts or its licensors and is protected by copyright and trademark laws.
        </p>

        <h2>11. Modifications to Terms</h2>
        <p>
          We reserve the right to modify these Terms and Conditions at any time. Your continued use of 
          the Website after changes constitutes acceptance of the modified terms.
        </p>

        <h2>12. Governing Law</h2>
        <p>
          These Terms and Conditions are governed by the laws of the State of Michigan, without regard to 
          conflict of law principles.
        </p>

        <h2>13. Contact Information</h2>
        <p>
          For questions about these Terms and Conditions, please contact us at:
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
