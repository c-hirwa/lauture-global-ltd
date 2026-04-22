import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { guides, type Guide } from "@/data/guides";
import GuideModal from "@/components/GuideModal";

interface GuidesSectionProps {
  showAll?: boolean;
  showCta?: boolean;
  eyebrow?: string;
  heading?: React.ReactNode;
  subheading?: string;
}

const GuidesSection = ({
  showAll = false,
  showCta = true,
  eyebrow = "Resources & Guides",
  heading,
  subheading = "Curated guides to help you settle, invest, and thrive in Rwanda — written from years of in-country experience.",
}: GuidesSectionProps) => {
  const [active, setActive] = useState<Guide | null>(null);
  const items = showAll ? guides : guides.slice(0, 3);

  return (
    <section className="bg-background py-32 md:py-40 relative overflow-hidden">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
            {eyebrow}
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-4 leading-tight">
            {heading ?? (
              <>
                Practical knowledge for your <span className="text-gradient-gold italic">Rwandan journey</span>
              </>
            )}
          </h2>
          <p className="text-muted-foreground leading-relaxed">{subheading}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((g, idx) => {
            const Icon = g.icon;
            return (
              <motion.button
                key={g.slug}
                onClick={() => setActive(g)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group text-left rounded-2xl p-8 bg-card border border-border hover:border-accent/60 transition-all duration-500 hover:-translate-y-2 premium-shadow"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-500">
                  <Icon size={26} />
                </div>
                <div className="w-10 h-0.5 bg-accent mb-4 group-hover:w-20 transition-all duration-500" />
                <h3 className="font-heading font-semibold text-foreground text-xl leading-snug mb-2">
                  {g.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{g.tagline}</p>
                <span className="inline-flex items-center gap-2 text-accent text-sm font-medium">
                  Read guide <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            );
          })}
        </div>

        {showCta && (
          <div className="text-center mt-16">
            <Button variant="default" size="lg" asChild className="px-8">
              <Link to="/resources">
                <BookOpen size={18} /> Browse All Guides <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        )}
      </div>

      <GuideModal guide={active} open={!!active} onOpenChange={(o) => !o && setActive(null)} />
    </section>
  );
};

export default GuidesSection;
