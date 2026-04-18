import { Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import marieImg from "@/assets/founder-marie.jpg";
import jorisImg from "@/assets/founder-joris.jpg";
import vladimirImg from "@/assets/founder-vladimir.jpg";

const founders = [
  {
    name: "Marie Vianie Lundi Lauture",
    role: "Founder & CEO",
    image: marieImg,
    bio: "The visionary behind Lauture Global LTD, Marie Vianie leads the firm's strategic direction with a deep commitment to connecting global citizens with Rwanda's extraordinary opportunities. Her leadership shapes every relocation journey we craft.",
    email: "marie@lautureglobal.com",
  },
  {
    name: "Joris Lauture",
    role: "Executive Board Advisor — Sales, Marketing & Operations",
    image: jorisImg,
    bio: "Joris brings sharp commercial insight and operational excellence to Lauture Global. He oversees client experience, partnerships, and the seamless execution of every package, ensuring world-class service from first contact to full integration.",
    email: "joris@lautureglobal.com",
  },
  {
    name: "Vladimir Jean-Baptiste",
    role: "Executive Board Advisor — Chief Financial Officer",
    image: vladimirImg,
    bio: "Vladimir leads the firm's financial strategy and investment advisory with decades of cross-border financial expertise. He guides clients through Rwanda's investment landscape with clarity, rigor, and long-term vision.",
    email: "vladimir@lautureglobal.com",
  },
];

const Founders = () => (
  <>
    <Navbar />
    <main className="pt-16">
      <section className="bg-primary py-28 relative fade-to-light">
        <div className="container text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-accent font-semibold text-sm tracking-[0.3em] uppercase mb-4"
          >
            Leadership
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-5"
          >
            Meet Our Founders
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-primary-foreground/70 max-w-2xl mx-auto text-lg"
          >
            The visionaries behind Lauture Global LTD — dedicated to making Rwanda accessible to the world.
          </motion.p>
        </div>
      </section>

      <section className="py-28 bg-background">
        <div className="container grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {founders.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="group bg-card rounded-lg overflow-hidden border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-500"
            >
              <div className="relative overflow-hidden aspect-[4/5]">
                <img
                  src={f.image}
                  alt={`Portrait of ${f.name}`}
                  width={768}
                  height={896}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
              </div>
              <div className="p-8">
                <h3 className="font-heading font-bold text-2xl mb-2">{f.name}</h3>
                <p className="text-accent font-medium text-sm mb-4 tracking-wide">{f.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{f.bio}</p>
                <div className="flex gap-3">
                  <a
                    href={`mailto:${f.email}`}
                    aria-label={`Email ${f.name}`}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
                  >
                    <Mail size={18} />
                  </a>
                  <a
                    href="#"
                    aria-label={`${f.name} on LinkedIn`}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
                  >
                    <Linkedin size={18} />
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
