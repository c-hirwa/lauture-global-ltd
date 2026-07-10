import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Partner {
  name: string;
  category: string;
}

interface PartnerGroup {
  group: string;
  icon: React.ElementType;
  items: Partner[];
}

const partnerGroups: PartnerGroup[] = [
  {
    group: "Kigali",
    icon: MapPin,
    items: [
      { name: "Kigali Marriott Hotel", category: "Hotel" },
      { name: "Akira Hotel", category: "Hotel" },
      { name: "Zaria Court Hotel", category: "Hotel" },
    ],
  },
  {
    group: "Kibuye (Karongi)",
    icon: MapPin,
    items: [
      { name: "Chateau Le Marara", category: "Lodge" },
      { name: "Umurobyi Lodge", category: "Lodge" },
    ],
  },
  {
    group: "Gisenyi (Rubavu)",
    icon: MapPin,
    items: [
      { name: "Musanto Hotel", category: "Hotel" },
      { name: "Araucaria Residence", category: "Residence" },
      { name: "Tam Tam Restaurant", category: "Restaurant" },
    ],
  },
  {
    group: "Tourism and Travel Partners",
    icon: Compass,
    items: [
      { name: "Love Rwanda", category: "Tour Operator" },
      { name: "INAM World", category: "Travel Agency" },
      { name: "Safaris Car Sharing", category: "Car Sharing" },
    ],
  },
];

const logoGradients = [
  "bg-gradient-to-br from-primary/80 to-secondary/80",
  "bg-gradient-to-br from-secondary/80 to-accent/80",
  "bg-gradient-to-br from-accent/80 to-primary/80",
  "bg-gradient-to-br from-primary/70 to-accent/70",
];

function getInitials(name: string) {
  const words = name.split(" ").filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const PartnersSection = () => {
  return (
    <section className="relative overflow-hidden bg-background py-32 md:py-40 fade-from-dark">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
            OUR PARTNERS
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-4 leading-tight">
            Our Strategic Partners
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            A growing network of hospitality, tourism, and travel partners across Rwanda
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-12">
          {partnerGroups.map((group, groupIdx) => {
            const GroupIcon = group.icon;
            return (
              <motion.div
                key={group.group}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: groupIdx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <h3 className="font-heading text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <GroupIcon size={22} className="text-accent" />
                  {group.group}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {group.items.map((partner, idx) => (
                    <motion.div
                      key={partner.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className="group flex items-center gap-4 rounded-2xl p-5 bg-card border border-border hover:border-accent/60 transition-all duration-500 hover:-translate-y-2 premium-shadow"
                    >
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-primary-foreground font-heading font-bold text-lg shadow-sm ${logoGradients[groupIdx % logoGradients.length]}`}
                        aria-hidden="true"
                      >
                        {getInitials(partner.name)}
                      </div>
                      <div>
                        <h4 className="font-heading font-semibold text-foreground leading-snug">
                          {partner.name}
                        </h4>
                        <p className="text-accent text-sm font-medium">{partner.category}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mt-20"
        >
          <p className="text-muted-foreground text-lg mb-6">Interested in partnering with us?</p>
          <Button variant="gold" size="lg" asChild className="px-8">
            <Link to="/contact">
              Contact Us <ArrowRight size={18} />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersSection;
