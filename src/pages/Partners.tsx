import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Building2, Hotel, Compass, Home, Briefcase, Users, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { partnerGroups } from "@/data/partners";

const groupIcons: Record<string, React.ElementType> = {
  "Preferred Hotels and Lodges (Kigali)": Hotel,
  "Preferred Hotels and Lodges (Karongi / Lake Kivu)": Hotel,
  "Tourism and Experience Partners": Compass,
  "Real Estate and Relocation Partners": Home,
  "Business and Investment Partners": Briefcase,
  "Culture and Community Partners": Users,
};

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

const Partners = () => {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* HERO */}
        <section className="relative bg-primary text-primary-foreground py-24 md:py-32 overflow-hidden grain">
          <div className="absolute inset-0 opacity-30" style={{ background: "var(--gradient-radial)" }} />
          <div className="container relative z-10 max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/15 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
              Our Partners
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-semibold leading-tight mb-6">
              Our Strategic <span className="text-gradient-gold italic">Partners</span>
            </h1>
            <p className="text-primary-foreground/85 text-lg leading-relaxed">
              Lauture Global is building a growing network of trusted hospitality, tourism, real estate, business, and community partners across Rwanda to provide our clients with reliable and high-quality services.
            </p>
          </div>
        </section>

        {/* GROUPS */}
        <section className="bg-background py-24 md:py-32">
          <div className="container space-y-20">
            {partnerGroups.map((group, groupIdx) => {
              const Icon = groupIcons[group.group] ?? Building2;
              return (
                <motion.div
                  key={group.group}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 className="font-heading text-2xl md:text-3xl font-semibold text-accent mb-8 flex items-center gap-3">
                    <Icon size={26} className="text-accent" />
                    {group.group}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.items.map((partner, idx) => (
                      <motion.article
                        key={partner.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="group flex flex-col rounded-2xl overflow-hidden bg-card border border-border hover:border-accent/60 transition-all duration-500 hover:-translate-y-2 premium-shadow"
                      >
                        <div className="relative h-48 bg-muted overflow-hidden flex items-center justify-center">
                          {partner.image ? (
                            <img
                              src={partner.image}
                              alt={partner.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <ImageIcon size={32} />
                              <span className="text-xs uppercase tracking-widest">Photo unavailable</span>
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-primary-foreground font-heading font-bold text-base shadow-sm ${logoGradients[groupIdx % logoGradients.length]}`}
                              aria-hidden="true"
                            >
                              {getInitials(partner.name)}
                            </div>
                            <div>
                              <h3 className="font-heading font-semibold text-foreground leading-snug">
                                {partner.name}
                              </h3>
                              <p className="text-accent text-xs font-medium">{partner.category}</p>
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
                            {partner.description}
                          </p>
                          {partner.website ? (
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                            >
                              Visit Website <ExternalLink size={14} />
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">Website not listed</span>
                          )}
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-secondary/40 py-24 md:py-28 border-t border-border">
          <div className="container text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Interested in partnering with us?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Join our growing network of trusted partners across Rwanda and help us deliver exceptional experiences for our clients.
            </p>
            <Button variant="gold" size="lg" asChild className="px-8">
              <Link to="/contact">
                Contact Us <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Partners;
