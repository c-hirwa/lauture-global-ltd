import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import aboutExpo from "@/assets/about-expo.jpg";
import ctaKigali from "@/assets/cta-kigali.jpg";
import serviceVacation from "@/assets/service-vacation.jpg";
import serviceMoving from "@/assets/service-moving.jpg";
import serviceIntegration from "@/assets/service-integration.jpg";
import serviceConsultation from "@/assets/service-consultation.jpg";
import serviceExplore from "@/assets/service-explore.jpg";
import serviceInvestment from "@/assets/service-investment.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  { image: serviceVacation, title: "Personalized Vacation Packages and Relocation Plans" },
  { image: serviceMoving, title: "Moving abroad made easier than ever" },
  { image: serviceIntegration, title: "Local Integration Support" },
  { image: serviceConsultation, title: "Tailored Settlement Consultation, Coaching and Assistance" },
  { image: serviceExplore, title: "Exploring this beautiful country" },
  { image: serviceInvestment, title: "Investment & Business Opportunities", desc: "Guide clients through Rwanda's growing investment landscape, from real estate to business ventures, with expert local insight." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative min-h-screen flex items-center overflow-hidden grain clip-pentagon-bottom">
          <div className="absolute inset-0">
            <img
              src={heroSlide1}
              alt="Land of a Thousand Hills"
              className="w-full h-full object-cover ken-burns"
              width={1920}
              height={1080}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />

          <div className="container relative z-10 py-32">
            <motion.div initial="hidden" animate="visible" className="max-w-3xl">
              <motion.div
                variants={fadeUp}
                custom={0}
                className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6"
              >
                <Sparkles size={14} className="text-accent" />
                <span className="text-primary-foreground text-xs font-medium tracking-widest uppercase">
                  Premium Relocation Experts
                </span>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="font-heading text-5xl md:text-6xl lg:text-7xl font-semibold text-primary-foreground leading-[1.05] mb-6 tracking-tight"
              >
                Explore the Land of A Thousand Hills or{" "}
                <span className="text-gradient-gold italic">Make Rwanda Your New Home!</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={2}
                className="text-primary-foreground/85 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl"
              >
                Expert guidance for your relocation or vacation to Africa's safest, most vibrant destination.
              </motion.p>
              <motion.div variants={fadeUp} custom={3}>
                <Button variant="gold" size="lg" asChild className="px-8">
                  <Link to="/services">
                    Explore Our Services <ArrowRight size={18} />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-10 right-8 z-20 hidden md:flex items-center gap-3 text-primary-foreground/60 text-xs uppercase tracking-widest float">
            <span className="w-12 h-px bg-primary-foreground/40" />
            Scroll
          </div>
        </section>

        {/* ABOUT — diagonal cut top */}
        <section className="bg-background py-32 md:py-40 relative overflow-hidden fade-to-dark">
          <div className="container grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <img
                src={aboutExpo}
                alt="Visit Rwanda expo"
                className="relative rounded-2xl premium-shadow w-full h-auto object-cover"
                loading="lazy"
                width={800}
                height={600}
              />
              <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground rounded-xl px-6 py-4 shadow-xl">
                <div className="font-heading text-3xl font-bold">10+</div>
                <div className="text-xs uppercase tracking-wider font-medium">Years Experience</div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
                About Us
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-6 leading-tight">
                Expert Coaching and Assistance in <span className="text-gradient-gold italic">Rwanda</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Lauture Global LTD is a trusted partner for seamless exploration, investment, and relocation to Kigali, Rwanda. Specializing in consultation, coaching, and tailored assistance, the company delivers personalized strategies designed to ensure a smooth and efficient transition.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                With a deep understanding of the local landscape, its experienced team provides strategic insights and comprehensive support aligned with each client's unique objectives. Whether relocating for professional or personal purposes, Lauture Global LTD is committed to facilitating a successful, efficient, and stress-free relocation experience.
              </p>
              <Button variant="default" size="lg" asChild>
                <Link to="/about">Discover Our Story <ArrowRight size={18} /></Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* SERVICES — dark, diagonal opposite */}
        <section className="relative py-32 md:py-40 overflow-hidden grain" style={{ background: "hsl(226 65% 10%)" }}>
          <div className="absolute inset-0 opacity-50" style={{ background: "var(--gradient-radial)" }} />
          <div className="container relative z-10">
            <motion.div
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="max-w-3xl mb-16"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/15 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
                What We Offer
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-semibold text-primary-foreground mb-4 leading-tight">
                Complete guidance for your <span className="text-gradient-gold italic">journey in Rwanda</span>
              </h2>
              <p className="text-secondary leading-relaxed">
                Experience exceptional opportunities with Lauture Global LTD — your trusted partner for discovering its dynamic landscape or relocating to Rwanda.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s, idx) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative rounded-2xl overflow-hidden glass hover:border-accent/50 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      width={640}
                      height={512}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="w-12 h-0.5 bg-accent mb-4 group-hover:w-20 transition-all duration-500" />
                    <h3 className="font-heading font-semibold text-primary-foreground text-xl leading-snug">
                      {s.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-16">
              <Button variant="gold" size="lg" asChild className="px-8">
                <Link to="/services">View Our Packages <ArrowRight size={18} /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA BANNER — dark with diagonal */}
        <section className="relative py-32 md:py-40 overflow-hidden grain">
          <img
            src={ctaKigali}
            alt="Kigali skyline at night"
            className="absolute inset-0 w-full h-full object-cover ken-burns"
            loading="lazy"
            width={1920}
            height={800}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="container relative z-10 text-center max-w-3xl mx-auto"
          >
            <h2 className="font-heading text-4xl md:text-6xl font-semibold text-primary-foreground mb-6 leading-tight">
              Unlock Your Next <span className="text-gradient-gold italic">Journey</span> in Rwanda
            </h2>
            <p className="text-primary-foreground/85 mb-10 leading-relaxed text-lg">
              Discover Rwanda on your terms — whether you're seeking an unforgettable vacation or planning a seamless relocation. With Lauture Global LTD, our expert team guides you every step of the way.
            </p>
            <Button variant="gold" size="lg" asChild className="px-8">
              <Link to="/contact">Start Your Journey <ArrowRight size={18} /></Link>
            </Button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
