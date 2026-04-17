import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const packages = [
  {
    name: "Basic Guidance and Assistance",
    tagline: "Entry-level strategy package",
    price: 500,
    cta: "Start your Journey",
    variant: "outline-gold" as const,
    popular: false,
    features: [
      "Personalized Relocation Consultation and Coaching (3 sessions)",
      "Customized Relocation Roadmap and Guides",
      "Email Support (30 Days)",
      "Key Insights & Market Orientation",
    ],
  },
  {
    name: "Comprehensive Strategy and Assistance",
    tagline: "Most chosen by professionals",
    price: 1200,
    cta: "Get Started",
    variant: "gold" as const,
    popular: true,
    features: [
      "In-Depth Strategic Consultation (5+ Sessions)",
      "Advanced Customized Relocation & Investment Plan",
      "Priority Email & Advisory Support (60 Days)",
      "Partners & Ecosystem Access",
    ],
  },
  {
    name: "Full Premium Service",
    tagline: "Consultation, Coaching and Assistance",
    price: 2000,
    cta: "Relocate with Full Support",
    variant: "outline-gold" as const,
    popular: false,
    features: [
      "Unlimited Strategic & Operational Support",
      "End-to-End Relocation Support",
      "On-Call Assistance",
      "Full Relocation & Integration Plan",
      "Local Ecosystem & Partner Coordination",
      "Post-Move Integration Support",
    ],
  },
];

const Pricing = () => (
  <section className="relative py-24 bg-background overflow-hidden">
    <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: "var(--gradient-radial)" }} />
    <div className="container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-16"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
          Our Packages
        </span>
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
          Choose Your <span className="text-gradient-gold">Journey</span>
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Tailored support for every stage of your Rwanda story — from first visit to full integration.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 items-stretch">
        {packages.map((pkg, idx) => (
          <motion.div
            key={pkg.name}
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={`relative rounded-2xl p-8 flex flex-col transition-all duration-500 hover:-translate-y-2 ${
              pkg.popular
                ? "bg-primary text-primary-foreground premium-shadow scale-105 border-2 border-accent"
                : "bg-card text-card-foreground border border-border hover:border-accent/40 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)]"
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 gold-glow">
                <Sparkles size={14} /> Most Popular
              </div>
            )}
            <div className="mb-6">
              <h3 className="font-heading text-2xl font-bold mb-2">{pkg.name}</h3>
              <p className={`text-sm ${pkg.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                {pkg.tagline}
              </p>
            </div>
            <div className="mb-8">
              <span className="font-heading text-5xl font-bold">${pkg.price.toLocaleString()}</span>
              <span className={`text-sm ml-2 ${pkg.popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                /package
              </span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              {pkg.features.map((f) => (
                <li key={f} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                      pkg.popular ? "bg-accent text-accent-foreground" : "bg-accent/15 text-accent"
                    }`}
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button variant={pkg.variant} size="lg" className="w-full" asChild>
              <Link to="/contact">{pkg.cta}</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;
