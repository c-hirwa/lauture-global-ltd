import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { partnerGroups } from "@/data/partners";

const logoGradients = [
  "bg-gradient-to-br from-primary/80 to-secondary/80",
  "bg-gradient-to-br from-secondary/80 to-accent/80",
  "bg-gradient-to-br from-accent/80 to-primary/80",
  "bg-gradient-to-br from-primary/70 to-accent/70",
];

function getInitials(name: string) {
  const words = name.split(" ").filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

const previewPartners = partnerGroups.flatMap((g, gi) =>
  g.items.slice(0, 2).map((p) => ({ ...p, groupIndex: gi, gradient: logoGradients[gi % logoGradients.length] }))
);

const PartnersSection = () => {
  return (
    <section className="relative overflow-hidden bg-background py-28 md:py-32 fade-from-dark">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mb-14 text-center mx-auto"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
            Our Partners
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-4 leading-tight">
            Our Strategic Partners
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            A trusted network of hospitality, tourism, real estate, business, and community partners across Rwanda — carefully selected to deliver reliable, high-quality experiences for our clients.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {previewPartners.map((partner, idx) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl p-5 bg-card border border-border hover:border-accent/60 transition-all duration-500 hover:-translate-y-1 premium-shadow text-center"
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-primary-foreground font-heading font-bold text-lg shadow-sm ${partner.gradient}`}
                aria-hidden="true"
              >
                {getInitials(partner.name)}
              </div>
              <div>
                <h4 className="font-heading font-semibold text-foreground text-sm leading-snug">
                  {partner.name}
                </h4>
                <p className="text-accent text-xs font-medium mt-0.5">{partner.category}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mt-14"
        >
          <Button variant="gold" size="lg" asChild className="px-8">
            <Link to="/partners">
              View All Partners <ArrowRight size={18} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;
