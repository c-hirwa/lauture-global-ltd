import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-lauture.png";
import { CONTACT } from "@/lib/contact";

const services = [
  "Basic Guidance",
  "Comprehensive Strategy & Assistance",
  "Full Premium Service",
];

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/partners", label: "Partners" },
  { to: "/resources", label: "Resources" },
  { to: "/founders", label: "Founders" },
  { to: "/contact", label: "Contact" },
];

const TikTokIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} width={size} height={size} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-6.9a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/lautureglobal", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/lautureglobal", icon: Instagram },
  { label: "TikTok", href: "https://www.tiktok.com/@lauture.global", icon: TikTokIcon },
];

const linkClass =
  "text-primary-foreground/70 hover:text-accent transition-colors inline-flex items-center gap-2 group";

const Footer = () => (
  <footer className="border-t-4 border-accent bg-primary text-primary-foreground">
    <div className="container py-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
      {/* Brand */}
      <div className="sm:col-span-2 lg:col-span-1">
        <Link to="/" aria-label="Lauture Global — home" className="inline-block mb-5">
          <img src={logo} alt="Lauture Global" className="h-11 w-auto" width={1584} height={672} loading="lazy" />
        </Link>
        <p className="text-sm text-primary-foreground/70 leading-relaxed max-w-sm mb-6">
          Kigali-based experts helping you explore, relocate to and invest in Rwanda — with one team guiding you
          from the first conversation to feeling at home.
        </p>
        <Button variant="gold" size="sm" asChild>
          <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </Button>
      </div>

      {/* Quick Links */}
      <div>
        <h3 className="font-heading text-lg font-bold text-accent mb-5">Quick Links</h3>
        <ul className="space-y-3 text-sm">
          {quickLinks.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className={linkClass}>
                <span className="w-0 h-px bg-accent transition-all duration-300 group-hover:w-4" />
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Packages */}
      <div>
        <h3 className="font-heading text-lg font-bold text-accent mb-5">Packages</h3>
        <ul className="space-y-3 text-sm">
          {services.map((s) => (
            <li key={s}>
              <Link to="/services#pricing" className={linkClass}>
                <span className="w-0 h-px bg-accent transition-all duration-300 group-hover:w-4" />
                {s}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="font-heading text-lg font-bold text-accent mb-5">Contact</h3>
        <ul className="space-y-4 text-sm mb-6">
          <li className="flex gap-3 text-primary-foreground/70">
            <MapPin size={18} className="flex-shrink-0 text-accent mt-0.5" />
            <span className="leading-relaxed">
              {CONTACT.address[0]}
              <br />
              {CONTACT.address[1]}
            </span>
          </li>
          <li>
            <a href={`mailto:${CONTACT.email}`} className="flex gap-3 text-primary-foreground/70 hover:text-accent transition-colors">
              <Mail size={18} className="flex-shrink-0 text-accent" />
              {CONTACT.email}
            </a>
          </li>
          <li>
            <a href={CONTACT.phoneHref} className="flex gap-3 text-primary-foreground/70 hover:text-accent transition-colors">
              <Phone size={18} className="flex-shrink-0 text-accent" />
              {CONTACT.phoneDisplay}
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Lauture Global on ${social.label}`}
                className="w-9 h-9 rounded-full border border-primary-foreground/20 flex items-center justify-center text-primary-foreground/70 hover:text-accent hover:border-accent transition-colors"
              >
                <Icon size={16} />
              </a>
            );
          })}
        </div>
      </div>
    </div>

    <div className="border-t border-primary-foreground/10">
      {/* Extra right/bottom padding keeps the floating chat button off this text. */}
      <div className="container py-5 pb-24 md:pb-5 md:pr-28 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-primary-foreground/50">
        <p>© {new Date().getFullYear()} Lauture Global LTD. All rights reserved.</p>
        <p>Kigali, Rwanda</p>
      </div>
    </div>
  </footer>
);

export default Footer;
