import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  sanityClient,
  PARTNERS_QUERY,
  PARTNER_GROUPS,
  type Partner,
} from "@/lib/sanity";

const GoldDot = () => (
  <span className="mx-3 text-accent select-none">·</span>
);

const PartnersSection = () => {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    sanityClient
      .fetch<Partner[]>(PARTNERS_QUERY)
      .then(setPartners)
      .catch((err) => console.error("Failed to fetch partners", err));
  }, []);

  const grouped = PARTNER_GROUPS.map((g) => ({
    ...g,
    items: partners.filter((p) => p.group === g.value),
  })).filter((g) => g.items.length > 0);

  return (
    <section
      className="relative py-20 md:py-28 overflow-hidden grain"
      style={{ background: "hsl(226 65% 10%)" }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{ background: "var(--gradient-radial)" }}
      />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mx-auto text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/15 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
            Our Partners
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-primary-foreground mb-4 leading-tight">
            Our Strategic Partners
          </h2>
          <p className="text-secondary leading-relaxed text-lg">
            A growing network of hospitality, tourism, and travel partners across Rwanda
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-10">
          {grouped.map((group, gi) => (
            <motion.div
              key={group.value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: gi * 0.1 }}
            >
              <h3 className="font-heading text-accent font-bold text-xs tracking-[0.15em] uppercase mb-3">
                {group.label}
              </h3>
              <div className="h-px bg-accent/30 mb-4" />
              <p className="text-primary-foreground font-medium text-sm md:text-base leading-relaxed">
                {group.items.map((p, i) => (
                  <span key={p._id}>
                    {p.name}
                    {i < group.items.length - 1 && <GoldDot />}
                  </span>
                ))}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="font-heading text-primary-foreground text-xl md:text-2xl mb-5">
            Interested in partnering with us?
          </p>
          <Button variant="sky" size="lg" asChild className="px-8">
            <Link to="/contact">
              Get in Touch <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
