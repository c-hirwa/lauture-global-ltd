import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Plane, Globe, Shield, Building, Map, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  { icon: Home, title: "Residential Relocation", desc: "From finding the perfect home to settling in, we handle every detail of your move to Rwanda. Our team scouts properties, negotiates leases, and ensures a smooth transition." },
  { icon: Plane, title: "Vacation Planning", desc: "Discover Rwanda's gorilla treks, Lake Kivu retreats, and vibrant Kigali nightlife with curated itineraries designed around your interests and budget." },
  { icon: Globe, title: "Business Consulting", desc: "Starting a business in Rwanda? We guide you through company registration, permits, and local partnerships to get you operational quickly." },
  { icon: Shield, title: "Visa & Immigration", desc: "Navigate Rwanda's immigration system with confidence. We assist with work permits, residency visas, and all required documentation." },
  { icon: Building, title: "Corporate Relocation", desc: "Comprehensive packages for companies moving employees to Rwanda — including housing, schooling, and cultural orientation programs." },
  { icon: Map, title: "Cultural Integration", desc: "Language classes, local networking events, and guided community introductions to help you feel at home in Rwanda." },
];

const Services = () => (
  <>
    <Navbar />
    <main className="pt-16">
      <section className="bg-primary py-20">
        <div className="container text-center">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Our Services</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">What We Do</h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            Comprehensive relocation and vacation consulting services tailored to your unique needs.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => (
            <div key={s.title} className="bg-card rounded-lg p-8 border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
              <div className="w-14 h-14 rounded-lg bg-secondary/15 flex items-center justify-center mb-5">
                <s.icon className="text-secondary" size={28} />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary py-16">
        <div className="container text-center">
          <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-4">Need a Custom Solution?</h2>
          <p className="text-primary-foreground/70 max-w-lg mx-auto mb-8">Every journey is unique. Let's discuss a personalized plan that fits your goals.</p>
          <Button variant="gold" size="lg" asChild>
            <Link to="/contact">Contact Us <ArrowRight size={18} /></Link>
          </Button>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default Services;
