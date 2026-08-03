import { motion } from "framer-motion";
import { Download, BookOpen, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
const magazineCover = { url: "/assets/lauture-global-magazine-cover.jpg" };
const magazinePdf = { url: "/assets/lauture-global-magazine.pdf" };

interface MagazineSectionProps {
  compact?: boolean;
}

const MagazineSection = ({ compact = false }: MagazineSectionProps) => {
  return (
    <section className="bg-background py-24 md:py-32 relative overflow-hidden">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
            Premium Magazine
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-4 leading-tight">
            Rwanda <span className="text-gradient-gold italic">2027</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            The ultimate luxury travel, investment & relocation guide — curated by Lauture Global LTD in partnership with Galop Trans Express.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl bg-card border border-border overflow-hidden premium-shadow"
        >
          <div className={`grid ${compact ? "lg:grid-cols-5" : "lg:grid-cols-2"} gap-0`}>
            {/* Cover */}
            <div className={`relative ${compact ? "lg:col-span-2" : ""} bg-primary overflow-hidden group`}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent z-10" />
              <img
                src={magazineCover.url}
                alt="Rwanda 2027 Magazine Cover"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold tracking-wide uppercase">
                <Crown size={12} />
                Premium Edition
              </div>
            </div>

            {/* Details */}
            <div className={`p-8 md:p-12 flex flex-col justify-center ${compact ? "lg:col-span-3" : ""}`}>
              <div className="flex items-center gap-2 text-accent text-sm font-medium tracking-wide uppercase mb-4">
                <BookOpen size={16} />
                13 Pages • Digital Magazine
              </div>
              <h3 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-4">
                The Ultimate Luxury Travel, Investment & Relocation Guide
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Discover everything Rwanda has to offer for the discerning traveler, investor, and future resident. Inside you'll find insider insights on luxury stays, investment opportunities, relocation essentials, and the cultural richness that makes Rwanda one of Africa's most remarkable destinations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="px-8">
                  <a href={magazinePdf.url} target="_blank" rel="noopener noreferrer" download>
                    <Download size={18} /> Download Magazine
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild className="px-8">
                  <a href={magazinePdf.url} target="_blank" rel="noopener noreferrer">
                    Read Online
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MagazineSection;
