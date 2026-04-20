import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import PackageModal, { PackageData } from "./PackageModal";

const packages: (PackageData & { tagline: string; popular: boolean; variant: "outline-gold" | "gold"; features: string[] })[] = [
  {
    id: "basic",
    title: "Basic Relocation Guidance",
    subtitle: "Clarity-focused consultation for a confident and strategic move to Rwanda",
    tagline: "Entry-level strategy package",
    price: 500,
    ctaLabel: "Start Your Journey — $500",
    variant: "outline-gold",
    popular: false,
    features: [
      "Personalized Relocation Consultation (3 sessions)",
      "Customized Relocation Roadmap and Guides",
      "Email Support (30 Days)",
      "Key Insights & Market Orientation",
    ],
    objective: "Designed for individuals, families, and entrepreneurs who need clear direction, expert insight, and a structured plan before relocating to Rwanda.",
    whatYouGet: [
      { title: "Personalized Relocation Consultation — 3 Sessions", desc: "Discovery & Strategy (60min), Practical Planning (60min), Action Plan (60min)" },
      { title: "Customized Relocation Roadmap", desc: "Step-by-step plan, timeline, administrative guidance, priority actions" },
      { title: "Email Support for 30 Days", desc: "Follow-up questions and light guidance during planning" },
      { title: "Key Insights & Market Orientation", desc: "Rwanda business environment, expat opportunities, local ecosystem overview" },
    ],
    forWho: ["Individuals exploring relocation", "Diaspora considering return", "Entrepreneurs evaluating opportunities", "Early-stage investors"],
    outcome: ["A clear relocation strategy", "Structured action plan", "Confidence to move forward", "Reduced risk and uncertainty"],
  },
  {
    id: "comprehensive",
    title: "Comprehensive Strategy",
    subtitle: "Advanced relocation planning with personalized strategy and ongoing advisory",
    tagline: "Most chosen by professionals",
    price: 1200,
    ctaLabel: "Get Started — $1,200",
    variant: "gold",
    popular: true,
    features: [
      "In-Depth Strategic Consultation (5+ Sessions)",
      "Advanced Customized Relocation & Investment Plan",
      "Priority Email & Advisory Support (60 Days)",
      "Partners & Ecosystem Access",
    ],
    objective: "For clients serious about relocating or investing in Rwanda who require in-depth planning, tailored strategy, and continuous guidance.",
    whatYouGet: [
      { title: "In-Depth Strategic Consultation — 5+ Sessions", desc: "Strategic Assessment, Market & Lifestyle Planning, Legal & Administrative Pathways, Investment & Opportunity Mapping, Execution Planning" },
      { title: "Advanced Customized Relocation & Investment Plan", desc: "Detailed roadmap, financial projections, housing recommendations, investment positioning, risk mitigation" },
      { title: "Priority Email & Advisory Support — 60 Days", desc: "Priority responses, ongoing guidance, strategic adjustments" },
      { title: "Partner & Ecosystem Access", desc: "Introductions to local contacts, service providers, business ecosystem, real estate" },
    ],
    forWho: ["Families planning structured transition", "Professionals", "Entrepreneurs launching in Rwanda", "Investors exploring market entry"],
    outcome: ["Fully structured relocation and investment strategy", "Clear execution roadmap", "Ecosystem access", "Strong decision-making confidence"],
  },
  {
    id: "premium",
    title: "Full-Service Coaching",
    subtitle: "End-to-end relocation, execution support, and full integration experience",
    tagline: "Consultation, Coaching and Assistance",
    price: 2000,
    ctaLabel: "Relocate with Full Support — $2,000",
    variant: "outline-gold",
    popular: false,
    features: [
      "Unlimited Strategic & Operational Support",
      "End-to-End Relocation Support",
      "On-Call Assistance",
      "Full Relocation & Integration Plan",
      "Local Ecosystem & Partner Coordination",
      "Post-Move Integration Support",
    ],
    objective: "For clients who want a fully supported, hands-on relocation experience with continuous guidance before, during, and after arrival in Rwanda.",
    whatYouGet: [
      { title: "Unlimited Strategic & Operational Support", desc: "Unlimited sessions, real-time guidance, continuous advisory" },
      { title: "End-to-End Relocation Support", desc: "Housing search guidance, administrative processes, local orientation" },
      { title: "On-Call Assistance", desc: "Direct WhatsApp/phone access, immediate support when needed" },
      { title: "Full Relocation & Integration Plan", desc: "Detailed roadmap, daily/weekly action guidance, personalized integration strategy" },
      { title: "Local Ecosystem & Partner Coordination", desc: "Introductions to real estate professionals, legal services, business partners" },
      { title: "Post-Move Integration Support", desc: "Settling-in assistance, lifestyle optimization, ongoing advisory after arrival" },
    ],
    forWho: ["Families with complex needs", "Premium experience seekers", "High-net-worth individuals", "Investors and business founders"],
    outcome: ["Smooth fully managed relocation", "Faster Rwanda integration", "Access to real opportunities", "Long-term success"],
  },
];

const Pricing = () => {
  const [selected, setSelected] = useState<PackageData | null>(null);
  const [open, setOpen] = useState(false);

  const openPackage = (pkg: PackageData) => { setSelected(pkg); setOpen(true); };

  return (
    <section className="relative py-24 md:py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: "var(--gradient-radial)" }} />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
              key={pkg.id}
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
                <h3 className="font-heading text-2xl font-bold mb-2">{pkg.title}</h3>
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
              <Button variant={pkg.variant} size="lg" className="w-full" onClick={() => openPackage(pkg)}>
                {pkg.id === "basic" ? "Start your Journey" : pkg.id === "comprehensive" ? "Get Started" : "Relocate with Full Support"}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      <PackageModal pkg={selected} open={open} onOpenChange={setOpen} />
    </section>
  );
};

export default Pricing;
