import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">Last Updated: December 9, 2025</p>
          </div>
          
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Vdrop's services, including our website and package pickup/delivery services, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                Vdrop provides a concierge return service ("Service") that facilitates the pickup of parcels from a user's designated location and delivery to specified shipping carriers (e.g., UPS, FedEx, Canada Post). We act as an intermediary to transport your pre-labeled packages to the carrier.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>You must provide accurate pickup and contact information.</li>
                <li>All packages must be securely packed and sealed prior to pickup.</li>
                <li>You typically must affix a valid, pre-paid shipping label to each package unless using our "Print-less" service where applicable.</li>
                <li>You agree not to request transport for prohibited, hazardous, or illegal items.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Pickup and Delivery</h2>
              <p className="text-muted-foreground leading-relaxed">
                We will make reasonable efforts to pick up your package during the selected time window. However, timeframes are estimates and not guarantees. Vdrop reserves the right to refuse service for any package that appears damaged, improperly detailed, or dangerous.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Once a package is handed over to the designated shipping carrier (e.g., UPS store, Canada Post office), Vdrop's responsibility ends. We are not liable for delays, loss, or damage caused by the shipping carrier.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Fees and Payment</h2>
              <p className="text-muted-foreground leading-relaxed">
                Fees for Vdrop services are displayed at the time of booking. You agree to pay all applicable fees. Payments are processed securely via our third-party payment provider. All sales are final once a pickup has been successfully completed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, Vdrop shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues. Our total liability for any claim arising out of these terms or our services shall not exceed the amount paid by you to Vdrop for the specific service giving rise to the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Modifications to Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                Vdrop reserves the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. We plan to continuously improve our platform and may update these Terms from time to time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us at <a href="mailto:hello@vdrop.com" className="text-accent hover:underline">hello@vdrop.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
