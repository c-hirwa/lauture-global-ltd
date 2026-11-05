import { Link } from "react-router-dom";
import {
  ArrowRight,
  BedDouble,
  Building2,
  Compass,
  HandHeart,
  Landmark,
  Plane,
  TrendingUp,
  Trees,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { partnerGroups, type Partner } from "@/data/partners";

// Partners without a logo get a consistent, on-brand category icon instead of initials.
const categoryIcons: Record<string, LucideIcon> = {
  Hotel: BedDouble,
  Hospitality: BedDouble,
  Resort: Trees,
  Lodge: Trees,
  "Real Estate": Building2,
  "Investment Partner": TrendingUp,
  "Tour Agency": Compass,
  "Tour Operator": Compass,
  "Travel Agency": Plane,
  "Cultural Center": Landmark,
  "Community Partner": HandHeart,
};

const allPartners: Partner[] = partnerGroups.flatMap((g) => g.items);

const PartnerCard = ({ partner }: { partner: Partner }) => {
  const Icon = categoryIcons[partner.category] ?? Building2;
  return (
  <div className="group flex items-center gap-4 rounded-2xl px-6 py-4 bg-card border border-border hover:border-accent/60 transition-all duration-500 premium-shadow shrink-0 w-72">
    {partner.image ? (
      <img
        src={partner.image}
        alt={partner.name}
        className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0"
        loading="lazy"
      />
    ) : (
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary text-accent shadow-sm shrink-0"
        aria-hidden="true"
      >
        <Icon size={22} strokeWidth={1.75} />
      </div>
    )}
    <div className="min-w-0">
      <h4 className="font-heading font-semibold text-foreground text-sm leading-snug truncate">
        {partner.name}
      </h4>
      <p className="text-accent text-xs font-medium mt-0.5">{partner.category}</p>
    </div>
  </div>
  );
};

const PartnersSection = () => {
  return (
    <section className="relative overflow-hidden bg-background py-28 md:py-32">
      <div className="container relative z-10">
        <div
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
        </div>
      </div>

      {/* Infinite marquee — right to left */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />
        <div className="overflow-hidden">
          <div className="marquee-track flex gap-5 w-max">
            {[...allPartners, ...allPartners].map((partner, idx) => (
              <PartnerCard key={`${partner.name}-${idx}`} partner={partner} />
            ))}
          </div>
        </div>
      </div>

      <div className="container relative z-10">
        <div
          className="text-center mt-14"
        >
          <Button variant="gold" size="lg" asChild className="px-8">
            <Link to="/partners">
              View All Partners <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
