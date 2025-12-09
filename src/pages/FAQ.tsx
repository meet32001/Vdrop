import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about Vdrop's door-to-door return service.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium">
                What exactly is Vdrop?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Vdrop is a premium return service that picks up your returns from your doorstep and handles the rest. We drive your package to the courier (UPS, FedEx, Canada Post, etc.) so you don't have to. We can even print your label and pack your items for you.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium">
                Do I need to print the shipping label?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Not if you choose our <strong className="text-foreground">Premium</strong> plan! Just upload the label PDF when you book, and our driver will bring the printed label with them. For the <strong className="text-foreground">Standard</strong> plan, you'll need to print and attach the label yourself before pickup.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium">
                Do I need to pack the box?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                With our <strong className="text-foreground">Premium</strong> plan, we handle the packing too! We'll bring the box, bubble wrap, and tape. Just hand us the item. For the <strong className="text-foreground">Standard</strong> plan, please have your item packed and sealed in a box, ready to go.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium">
                Where is Vdrop available?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We are currently serving <strong className="text-foreground">London, Ontario</strong>. We are expanding rapidly to Kitchener, Waterloo, and the GTA. Sign up for our newsletter to be notified when we launch in your city!
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium">
                How do I know my package is safe?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Trust is our top priority. Every Vdrop driver is vetted, and we provide real-time tracking updates. You'll receive a <strong className="text-foreground">photo confirmation</strong> as soon as your package is dropped off at the courier, proving it's safely in their hands.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium">
                How much does it cost?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Our <strong className="text-foreground">Standard</strong> pickup is just <strong className="text-foreground">$7</strong>. If you need us to print the label and pack the item (<strong className="text-foreground">Premium</strong>), it's <strong className="text-foreground">$15</strong>. No hidden fees, no subscriptions required.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium">
                What if I'm not home?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                No problem! You can leave your package in a <strong className="text-foreground">safe spot</strong> (like your porch or concierge), and our driver will pick it up. Just add a note or photo of the location when you book your pickup.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium">
                Which couriers do you support?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We work with verified drop-off locations for all major carriers including <strong className="text-foreground">Canada Post</strong>, <strong className="text-foreground">UPS</strong>, <strong className="text-foreground">FedEx</strong>, <strong className="text-foreground">Purolator</strong>, and <strong className="text-foreground">Canpar</strong>.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium">
                Can I return multiple packages?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! You can add multiple packages to a single pickup request. Each additional package is significantly discounted. Just select <strong className="text-foreground">"Add Another Package"</strong> during booking.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-10" className="border rounded-lg px-4 bg-card">
              <AccordionTrigger className="text-left font-medium">
                Is there a weight limit?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We can handle most standard packages up to <strong className="text-foreground">50 lbs</strong>. If you have an oversized item or something heavier (like furniture or fitness equipment), please contact our support team first to ensure we can accommodate it.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
