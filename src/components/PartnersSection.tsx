import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  sanityClient,
  urlFor,
  PARTNERS_QUERY,
  PARTNER_GROUPS,
  type Partner,
} from "@/lib/sanity";

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
      className="relative py-32 md:py-40 overflow-hidden grain"
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
          className="max-w-3xl mx-auto text-center mb-16"
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

        <div className="space-y-16">
          {grouped.map((group, gi) => (
            <div key={group.value}>
              {gi > 0 && (
                <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent mb-12" />
              )}
              <h3 className="font-heading text-accent font-bold text-lg md:text-xl tracking-wide uppercase mb-8">
                {group.label}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {group.items.map((p, i) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="group rounded-2xl p-6 border border-accent/20 bg-primary/40 backdrop-blur-sm hover:border-accent hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_hsl(var(--accent)/0.5)] transition-all duration-300"
                  >
                    <div className="aspect-square rounded-xl bg-primary-foreground/5 border border-accent/10 mb-4 overflow-hidden flex items-center justify-center">
                      {p.logo ? (
                        <img
                          src={urlFor(p.logo).width(400).height(400).fit("crop").url()}
                          alt={`${p.name} logo`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <Building2 className="text-accent/40" size={48} />
                      )}
                    </div>
                    <h4 className="font-heading font-bold text-primary-foreground text-lg leading-snug">
                      {p.name}
                    </h4>
                    {p.category && (
                      <p className="text-secondary text-sm mt-1">{p.category}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <p className="font-heading text-primary-foreground text-2xl md:text-3xl mb-6">
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
