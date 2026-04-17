import { motion } from "framer-motion";
import { Target, Eye, Heart } from "lucide-react";
import aboutImg from "@/assets/about-team.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionBlend from "@/components/SectionBlend";

const DARK = "hsl(226 65% 10%)";
const LIGHT = "hsl(var(--background))";
const MUTED = "hsl(var(--muted))";

const values = [
  { icon: Target, title: "Excellence", desc: "We deliver premium, detail-oriented services that exceed expectations." },
  { icon: Eye, title: "Transparency", desc: "Honest communication and clear processes at every step." },
  { icon: Heart, title: "Care", desc: "We treat every client like family, ensuring comfort and confidence." },
];

const About = () => (
  <>
    <Navbar />
    <main className="pt-16">
      {/* Hero */}
      <section className="relative bg-primary py-28 overflow-hidden grain">
        <div className="container text-center relative z-10">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">About Us</p>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-primary-foreground mb-4">Who We Are</h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            Founded in Kigali, Lauture Global LTD is a trusted consultancy helping individuals and businesses navigate relocation and travel across East Africa.
          </p>
        </div>
        <SectionBlend from="hsl(var(--primary))" to={LIGHT} direction="tr" height={180} />
      </section>

      {/* Story */}
      <section className="relative py-28 overflow-hidden bg-background">
        <div className="container grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <img src={aboutImg} alt="Lauture Global team" className="rounded-2xl shadow-[var(--shadow-elevated)]" loading="lazy" width={1200} height={800} />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-4">Our <span className="text-gradient-gold italic">Story</span></h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Lauture Global LTD was born from a passion for connecting people with the beauty and opportunity that Rwanda offers. Our founders, having experienced the challenges of international relocation firsthand, set out to create a seamless, end-to-end consulting service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we serve clients from over 12 countries, guiding them through every aspect of relocation — from visas and housing to cultural integration and vacation planning. Our deep local expertise and global mindset make us the preferred partner for anyone looking to make Rwanda their home or destination.
            </p>
          </motion.div>
        </div>
        <SectionBlend from={LIGHT} to={MUTED} direction="tl" height={180} />
      </section>

      {/* Values */}
      <section className="relative bg-muted py-28 overflow-hidden">
        <div className="container">
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-center mb-12">Our Core <span className="text-gradient-gold italic">Values</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-card rounded-2xl p-8 text-center shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
                <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="text-accent" size={28} />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <SectionBlend from={MUTED} to={LIGHT} direction="tr" height={180} />
      </section>
    </main>
    <Footer />
  </>
);

export default About;
