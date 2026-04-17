import { Linkedin, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionBlend from "@/components/SectionBlend";
import { motion } from "framer-motion";

const LIGHT = "hsl(var(--background))";

const founders = [
  {
    name: "Jean-Pierre Lauture",
    role: "Co-Founder & CEO",
    bio: "With over a decade of experience in international business development, Jean-Pierre leads Lauture Global's strategic vision. His passion for connecting global talent with Rwanda's opportunities drives the company's mission.",
    linkedin: "#",
    email: "jp@lautureglobal.com",
  },
  {
    name: "Amina Uwimana",
    role: "Co-Founder & COO",
    bio: "Amina brings deep expertise in operations and client relations. Having guided hundreds of families through successful relocations, she ensures every client receives personalized, world-class service.",
    linkedin: "#",
    email: "amina@lautureglobal.com",
  },
];

const Founders = () => (
  <>
    <Navbar />
    <main className="pt-16">
      <section className="relative bg-primary py-28 overflow-hidden grain">
        <div className="container text-center relative z-10">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Leadership</p>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-primary-foreground mb-4">Meet Our <span className="text-gradient-gold italic">Founders</span></h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            The visionaries behind Lauture Global LTD, dedicated to making Rwanda accessible to the world.
          </p>
        </div>
        <SectionBlend from="hsl(var(--primary))" to={LIGHT} direction="tr" height={180} />
      </section>

      <section className="relative py-28 bg-background overflow-hidden">
        <div className="container grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {founders.map((f, idx) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="bg-card rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)] transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary to-secondary/40 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-accent/20 border-4 border-accent flex items-center justify-center">
                  <span className="font-heading text-3xl font-bold text-accent">
                    {f.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-heading font-bold text-xl mb-1">{f.name}</h3>
                <p className="text-accent font-medium text-sm mb-4">{f.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{f.bio}</p>
                <div className="flex gap-3">
                  <a href={`mailto:${f.email}`} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent/15 transition-colors">
                    <Mail size={18} className="text-muted-foreground" />
                  </a>
                  <a href={f.linkedin} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent/15 transition-colors">
                    <Linkedin size={18} className="text-muted-foreground" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default Founders;
