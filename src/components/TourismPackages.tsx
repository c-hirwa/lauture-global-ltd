import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Check, ImageOff, ArrowRight, Sparkles } from "lucide-react";
import tourism from '../assets/1tpackage.jpeg'
import prestige from '../assets/2tpackage.jpeg'

type TourPackage = {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  intro: string[];
  highlights: string[];
  closing: string;
  signature: string;
  featured: boolean;
  /** Add image paths here when photos are ready */
  images: string[];
};

const tourPackages: TourPackage[] = [
  {
    id: "discover-rwanda",
    title: "Discover Rwanda – Nature, Culture & Adventure",
    subtitle: "8-Day Signature Experience",
    tagline: "Signature journey",
    featured: false,
    images: [tourism],
    intro: [
      "Experience the very best of Rwanda with Lauture Global LTD and Galop Trans Express on an unforgettable journey through the Land of a Thousand Hills. Designed for travelers seeking authentic experiences, this carefully curated package combines breathtaking natural landscapes, incredible wildlife, vibrant culture, and warm Rwandan hospitality.",
      "From unforgettable gorilla encounters and exciting safari adventures to the serene beauty of Lake Kivu, Kigali's modern charm, and immersive cultural experiences, every moment is thoughtfully planned to showcase Rwanda's unique spirit. Whether you're traveling solo, as a couple, with family, or in a group, our expert team ensures a seamless, comfortable, and enriching experience from arrival to departure.",
    ],
    highlights: [
      "Gorilla Trekking & Wildlife Encounters",
      "Akagera National Park Safari",
      "Lake Kivu Excursion",
      "Kigali City & Cultural Tour",
      "Authentic Rwandan Cuisine",
      "Professional Local Guides",
      "Comfortable Accommodation",
      "Private Transportation & Airport Transfers",
    ],
    closing:
      "Discover Rwanda is more than a vacation — it's an invitation to connect with nature, embrace a rich cultural heritage, and create lifelong memories in one of Africa's safest and most inspiring destinations.",
    signature:
      "Visit. Explore. Experience Rwanda with Lauture Global and Galop Trans Express.",
  },
  {
    id: "experience-rwanda",
    title: "Experience Rwanda: Luxury & Adventure",
    subtitle: "8-Day Prestige Experience",
    tagline: "Prestige journey",
    featured: true,
    images: [prestige],
    intro: [
      "Indulge in the ultimate Rwandan escape with Experience Rwanda: Luxury & Adventure, an exclusive journey crafted by Lauture Global LTD and Galop Trans Express for discerning travelers seeking elegance, comfort, and unforgettable experiences.",
      "This premium package combines Rwanda's breathtaking natural beauty with world-class hospitality, luxury accommodations, fine dining, and personalized concierge services. From exclusive gorilla trekking and private safaris to sunset cruises on Lake Kivu, wellness retreats, cultural immersion, and VIP city experiences, every detail is carefully curated to deliver an exceptional travel experience.",
      "Whether you're celebrating a special occasion, planning a romantic getaway, organizing a corporate retreat, or simply looking to discover Africa in style, our dedicated team will ensure a seamless and personalized journey from the moment you arrive.",
    ],
    highlights: [
      "Luxury 4 & 5-Star Hotels and Boutique Lodges",
      "Exclusive Gorilla Trekking Experience",
      "Private Akagera Safari & Game Drives",
      "Lake Kivu Luxury Cruise",
      "Fine Dining & Gourmet Experiences",
      "VIP Kigali City Tour & Cultural Encounters",
      "Wellness & Spa Experiences",
      "Private Airport Transfers & Premium Transportation",
      "Dedicated Travel Concierge & Professional Guides",
    ],
    closing:
      "Experience Rwanda: Luxury & Adventure is more than a vacation — it's a sophisticated journey where luxury meets authenticity, creating extraordinary memories in one of Africa's most remarkable destinations.",
    signature:
      "Luxury. Nature. Culture. Excellence. Experience Rwanda with Lauture Global and Galop Trans Express.",
  },
];

const PhotoPlaceholder = ({ label }: { label: string }) => (
  <div className="aspect-[16/10] w-full rounded-xl border border-dashed border-accent/40 bg-muted/40 flex flex-col items-center justify-center gap-2 text-muted-foreground">
    <ImageOff size={22} className="text-accent/70" />
    <span className="text-xs uppercase tracking-widest">{label}</span>
  </div>
);

const TourismPackages = () => {
  const [selected, setSelected] = useState<TourPackage | null>(null);

  return (
    <section id="tourism-packages" className="relative py-24 md:py-32 overflow-hidden grain" style={{ background: "hsl(var(--navy-dark))" }}>
      <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: "var(--gradient-radial)" }} />
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/15 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
            Tourism Packages
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-primary-foreground mb-4">
            Explore Rwanda with <span className="text-gradient-gold italic">Galop Trans Express</span>
          </h2>
          <p className="text-secondary leading-relaxed">
            Two curated 8-day journeys through the Land of a Thousand Hills — from authentic adventure to full-scale luxury.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {tourPackages.map((pkg, idx) => (
            <motion.article
              key={pkg.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={`relative rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 glass ${
                pkg.featured ? "border-2 border-accent premium-shadow" : "hover:border-accent/50"
              }`}
            >
              {pkg.featured && (
                <div className="absolute top-4 right-4 z-10 bg-accent text-accent-foreground px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 gold-glow">
                  <Sparkles size={12} /> Prestige
                </div>
              )}
              <div className="p-4 pb-0">
                {pkg.images.length > 0 ? (
                  <img
                    src={pkg.images[0]}
                    alt={pkg.title}
                    className="aspect-[16/10] w-full object-cover rounded-xl"
                    loading="lazy"
                  />
                ) : (
                  <PhotoPlaceholder label="Photo coming soon" />
                )}
              </div>
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-2">{pkg.subtitle}</p>
                <h3 className="font-heading text-2xl font-bold text-primary-foreground mb-3 leading-snug">{pkg.title}</h3>
                <p className="text-secondary text-sm leading-relaxed mb-6 line-clamp-4">{pkg.intro[0]}</p>
                <ul className="space-y-2.5 mb-8 flex-grow">
                  {pkg.highlights.slice(0, 5).map((h) => (
                    <li key={h} className="flex gap-3 text-sm text-primary-foreground/90 leading-relaxed">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                  {pkg.highlights.length > 5 && (
                    <li className="text-xs text-secondary pl-8">+ {pkg.highlights.length - 5} more inclusions</li>
                  )}
                </ul>
                <Button variant={pkg.featured ? "gold" : "outline-gold"} size="lg" className="w-full" onClick={() => setSelected(pkg)}>
                  View Full Itinerary <ArrowRight size={18} />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <div>
              <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-2">{selected.subtitle}</p>
              <DialogTitle className="font-heading text-3xl font-bold mb-6 leading-snug">{selected.title}</DialogTitle>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {selected.images.length > 0 ? (
                  selected.images.map((src) => (
                    <img key={src} src={src} alt={selected.title} className="aspect-[16/10] w-full object-cover rounded-xl" loading="lazy" />
                  ))
                ) : (
                  <>
                    <PhotoPlaceholder label="Photo placeholder" />
                    <PhotoPlaceholder label="Photo placeholder" />
                  </>
                )}
              </div>

              {selected.intro.map((p) => (
                <p key={p.slice(0, 30)} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
              ))}

              <h4 className="font-heading text-xl font-bold mt-8 mb-4">Package Highlights</h4>
              <ul className="grid sm:grid-cols-2 gap-3 mb-8">
                {selected.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm leading-relaxed">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/15 text-accent flex items-center justify-center mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <p className="text-muted-foreground leading-relaxed mb-4">{selected.closing}</p>
              <p className="font-heading text-lg font-semibold text-gradient-gold mb-8">{selected.signature} ✨</p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="gold" size="lg" asChild className="flex-1">
                  <Link to="/contact">Enquire About This Package <ArrowRight size={18} /></Link>
                </Button>
                <Button variant="outline" size="lg" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default TourismPackages;
