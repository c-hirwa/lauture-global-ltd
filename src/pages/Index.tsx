import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Home, Plane, Shield } from "lucide-react";
import heroImg from "@/assets/hero-kigali.jpg";
import vacationImg from "@/assets/vacation-rwanda.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};

const stats = [
  { value: "500+", label: "Clients Relocated" },
  { value: "8+", label: "Years Experience" },
  { value: "12", label: "Countries Served" },
  { value: "98%", label: "Client Satisfaction" },
];

const services = [
  { icon: Home, title: "Relocation Services", desc: "End-to-end support for individuals and families moving to Rwanda." },
  { icon: Plane, title: "Vacation Consulting", desc: "Curated travel experiences across East Africa's most stunning destinations." },
  { icon: Globe, title: "Business Setup", desc: "Guidance on permits, registration, and settling into Rwanda's business landscape." },
  { icon: Shield, title: "Legal & Visa Support", desc: "Navigate immigration with expert assistance on visas and documentation." },
];

const Index = () => (
  <>
    <Navbar />
    <main>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <img src={heroImg} alt="Kigali skyline at golden hour" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="container relative z-10 py-32">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.p variants={fadeUp} custom={0} className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">
              Rwanda's Premier Consulting Partner
            </motion.p>
            <motion.h1 variants={fadeUp} custom={1} className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Your Gateway to <span className="text-accent">Rwanda</span> — Relocate, Explore, Thrive
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
              Whether you're moving to Rwanda or planning the vacation of a lifetime, Lauture Global LTD makes every step seamless.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Button variant="gold" size="lg" asChild>
                <Link to="/contact">Start Your Journey <ArrowRight size={18} /></Link>
              </Button>
              <Button variant="outline-light" size="lg" asChild>
                <Link to="/services">Our Services</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-accent/10 py-16">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-heading text-3xl md:text-4xl font-bold text-primary">{s.value}</p>
              <p className="text-muted-foreground text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services preview */}
      <section className="py-20">
        <div className="container">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-4">What We Offer</h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">Comprehensive services tailored to your relocation and travel needs in East Africa.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div key={s.title} className="bg-card rounded-lg p-6 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow border border-border">
                <div className="w-12 h-12 rounded-lg bg-accent/15 flex items-center justify-center mb-4">
                  <s.icon className="text-accent" size={24} />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button variant="gold" asChild>
              <Link to="/services">View All Services <ArrowRight size={16} /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <img src={vacationImg} alt="Lake Kivu Rwanda" className="absolute inset-0 w-full h-full object-cover" loading="lazy" width={1200} height={800} />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="container relative z-10 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to Discover Rwanda?</h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">Let our team of experts plan your perfect relocation or unforgettable vacation experience.</p>
          <Button variant="gold" size="lg" asChild>
            <Link to="/contact">Get in Touch <ArrowRight size={18} /></Link>
          </Button>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default Index;
