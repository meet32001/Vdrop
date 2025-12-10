import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">Last Updated: December 9, 2025</p>
          </div>
          
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                At Vdrop ("we," "us," or "our"), we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services, in compliance with applicable Canadian privacy laws, including the Personal Information Protection and Electronic Documents Act (PIPEDA).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information that you voluntarily provide to us when you register for an account, book a pickup, or contact customer support. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Personal Identification Information:</strong> Name, email address, phone number.</li>
                <li><strong>Pickup & Delivery Information:</strong> Physical address, pickup instructions, and access codes if applicable.</li>
                <li><strong>Payment Information:</strong> Credit card details and billing address (processed securely by our third-party payment processor; we do not store full credit card numbers).</li>
                <li><strong>Usage Data:</strong> Information about your device, browser, and how you interact with our website (collected via cookies).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>To provide, operate, and maintain our Service (e.g., executing pickups).</li>
                <li>To process your transactions and manage your orders.</li>
                <li>To communicate with you, including sending order confirmations, updates, and support messages.</li>
                <li>To improve our website, services, and user experience.</li>
                <li>To detect and prevent fraud or abuse of our services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Disclosure of Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell your personal information. We may share your information with third-party service providers who perform services on our behalf, such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                <li><strong>Payment Processors:</strong> To facilitate payments.</li>
                <li><strong>Mapping Services:</strong> To route our drivers efficiently.</li>
                <li><strong>Email Service Providers:</strong> To send transactional emails.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We may also disclose information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Data Retention and Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We implement appropriate technical and organizational security measures to protect your personal information from unauthorized access, loss, or misuse.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or delete the personal information we hold about you. To exercise these rights, please contact us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have substantial questions about this Privacy Policy or our data practices, please contact our Privacy Officer at:
                <br /><br />
                <strong>Email:</strong> <a href="mailto:privacy@vdrop.com" className="text-accent hover:underline">privacy@vdrop.com</a><br />
                <strong>Address:</strong> London, Ontario, Canada
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
