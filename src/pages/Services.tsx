import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserCircle } from "lucide-react";
import { SERVICES } from "@/data/services";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";
import TourismPackages from "@/components/TourismPackages";


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
          {SERVICES.map((s) => (
            <div
              key={s.id}
              id={s.id}
              className="scroll-mt-28 bg-card rounded-2xl p-8 border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] hover:border-accent/40 transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mb-5">
                <s.icon className="text-accent" size={26} strokeWidth={1.75} />
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Pricing />

      <TourismPackages />

      <section className="py-20 bg-background">
        <div className="container max-w-3xl text-center">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Next Steps</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Choose a package above and complete the intake form. Once submitted, you'll create a client portal account where you can book your consultation and track your relocation journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="gold" size="lg" asChild>
              <a href="#pricing">
                Choose a package <ArrowRight size={18} />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/login">
                <UserCircle size={18} /> Client portal
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 relative overflow-hidden">
        <div className="container text-center relative z-10">
          <h2
            className="font-heading text-3xl font-bold text-primary-foreground mb-4"
          >
            Need a Custom Solution?
          </h2>
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
