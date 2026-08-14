import { motion } from "framer-motion";
import { Download, BookOpen, Crown, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const resources = [
  {
    id: "magazine",
    eyebrow: "Premium Magazine",
    badge: "Premium Edition",
    badgeIcon: Crown,
    title: "Rwanda 2027",
    subtitle: "The Ultimate Luxury Travel, Investment & Relocation Guide",
    description:
      "Discover everything Rwanda has to offer for the discerning traveler, investor, and future resident. Inside you'll find insider insights on luxury stays, investment opportunities, relocation essentials, and the cultural richness that makes Rwanda one of Africa's most remarkable destinations.",
    meta: "13 Pages • Digital Magazine",
    metaIcon: BookOpen,
    cover: "/assets/lauture-global-magazine-cover.jpg",
    pdf: "/assets/lauture-global-magazine.pdf",
    featured: true,
  },
  {
    id: "10-reasons",
    eyebrow: "Brochure",
    title: "10 Reasons to Explore Rwanda",
    subtitle: "Why Rwanda should be your next destination",
    description:
      "A concise, visual overview of the top reasons to visit, invest, and explore Rwanda — from safety and cleanliness to breathtaking landscapes and fast-growing business opportunities.",
    meta: "Brochure • PDF",
    metaIcon: FileText,
    cover: "/assets/Lauture_Global_Rwanda_Brochure.jpg",
    pdf: "/assets/Lauture_Global_Rwanda_Brochure_Final.pdf",
    featured: false,
  },
  {
    id: "packages",
    eyebrow: "Brochure",
    title: "Packages Trifold Brochure",
    subtitle: "Relocation & tourism packages at a glance",
    description:
      "Download our full trifold brochure to compare our relocation, strategy, and concierge packages — plus our signature tourism experiences — all in one beautifully designed handout.",
    meta: "Trifold • PDF",
    metaIcon: FileText,
    cover: "/assets/Blue and White Modern Travel Trifold.jpg",
    pdf: "/assets/Lauture Global_Packages Trifold Brochure.pdf",
    featured: false,
  },
];

const DocumentCard = ({ resource }: { resource: (typeof resources)[0] }) => {
  const MetaIcon = resource.metaIcon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl bg-card border border-border overflow-hidden premium-shadow group flex flex-col"
    >
      <div className="relative h-64 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent z-10" />
        <img
          src={resource.cover}
          alt={resource.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-8 md:p-10 flex flex-col flex-grow justify-center">
        <span className="inline-block self-start px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
          {resource.eyebrow}
        </span>
        <div className="flex items-center gap-2 text-accent text-sm font-medium tracking-wide uppercase mb-3">
          <MetaIcon size={16} />
          {resource.meta}
        </div>
        <h3 className="font-heading text-2xl font-semibold text-foreground mb-3">
          {resource.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
          {resource.description}
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg" className="px-6">
            <a href={resource.pdf} target="_blank" rel="noopener noreferrer" download>
              <Download size={18} /> Download
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild className="px-6">
            <a href={resource.pdf} target="_blank" rel="noopener noreferrer">
              Read Online
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const MagazineSection = () => {
  const featured = resources.find((r) => r.featured);
  const others = resources.filter((r) => !r.featured);

  if (!featured) return null;

  const FeaturedBadgeIcon = featured.badgeIcon;
  const FeaturedMetaIcon = featured.metaIcon;

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
            Premium Downloads
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-4 leading-tight">
            Rwanda <span className="text-gradient-gold italic">2027</span> & More
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Curated brochures, magazines, and guides to help you explore, invest, and plan your journey in Rwanda.
          </p>
        </motion.div>

        {/* Featured magazine */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl bg-card border border-border overflow-hidden premium-shadow mb-12"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="relative bg-primary overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent z-10" />
              <img
                src={featured.cover}
                alt={`${featured.title} Cover`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-semibold tracking-wide uppercase">
                <FeaturedBadgeIcon size={12} />
                {featured.badge}
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-accent text-sm font-medium tracking-wide uppercase mb-4">
                <FeaturedMetaIcon size={16} />
                {featured.meta}
              </div>
              <h3 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-4">
                {featured.subtitle}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {featured.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="px-8">
                  <a href={featured.pdf} target="_blank" rel="noopener noreferrer" download>
                    <Download size={18} /> Download Magazine
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild className="px-8">
                  <a href={featured.pdf} target="_blank" rel="noopener noreferrer">
                    Read Online
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional downloads */}
        <div className="grid md:grid-cols-2 gap-8">
          {others.map((resource) => (
            <DocumentCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MagazineSection;
