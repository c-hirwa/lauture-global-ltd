import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import aboutExpo from "@/assets/about-expo.jpg";
import ctaKigali from "@/assets/cta-kigali.jpg";
import serviceVacation from "@/assets/service-vacation.jpg";
import serviceMoving from "@/assets/service-moving.jpg";
import serviceIntegration from "@/assets/service-integration.jpg";
import serviceConsultation from "@/assets/service-consultation.jpg";
import serviceExplore from "@/assets/service-explore.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";

const slides = [
  {
    image: heroSlide1,
    headline: "Explore the Land of A Thousand Hills or Make Rwanda Your New Home!",
    subtext: "Expert guidance for your relocation or vacation to Africa's safest, most vibrant destination.",
  },
  {
    image: heroSlide2,
    headline: "Your Trusted Partner for a Seamless Transition to Rwanda",
    subtext: "From vacation planning to full relocation — we handle every detail so you don't have to.",
  },
];

const services = [
  { image: serviceVacation, title: "Personalized Vacation Packages and Relocation Plans" },
  { image: serviceMoving, title: "Moving abroad made easier than ever" },
  { image: serviceIntegration, title: "Local Integration Support" },
  { image: serviceConsultation, title: "Tailored Settlement Consultation, Coaching and Assistance" },
  { image: serviceExplore, title: "Exploring this beautiful country" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Slider */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {slides.map((slide, idx) => (
            <img
              key={idx}
              src={slide.image}
              alt={slide.headline}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                idx === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              width={1920}
              height={1080}
              {...(idx === 0 ? {} : { loading: "lazy" as const })}
            />
          ))}
          <div className="absolute inset-0 bg-primary/70" />
          <div className="container relative z-10 py-32">
            <motion.div initial="hidden" animate="visible" key={currentSlide} className="max-w-2xl">
              <motion.h1
                variants={fadeUp}
                custom={0}
                className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
              >
                {slides[currentSlide].headline}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                custom={1}
                className="text-primary-foreground/80 text-lg mb-8 leading-relaxed"
              >
                {slides[currentSlide].subtext}
              </motion.p>
              <motion.div variants={fadeUp} custom={2}>
                <Button variant="outline-light" size="lg" asChild>
                  <Link to="/services">Explore Our Services</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
          {/* Slide indicators — bottom left */}
          <div className="absolute bottom-8 left-8 z-20 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentSlide ? "bg-accent w-8" : "bg-primary-foreground/50"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* About Snapshot */}
        <section className="bg-background py-20">
          <div className="container grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src={aboutExpo}
                alt="Visit Rwanda expo"
                className="rounded-lg shadow-[var(--shadow-elevated)] w-full h-auto object-cover"
                loading="lazy"
                width={800}
                height={600}
              />
            </div>
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Expert Coaching and Assistance in Rwanda
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Lauture Global LTD is a trusted partner for seamless exploration, investment, and relocation to Kigali, Rwanda. Specializing in consultation, coaching, and tailored assistance, the company delivers personalized strategies designed to ensure a smooth and efficient transition.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                With a deep understanding of the local landscape, its experienced team provides strategic insights and comprehensive support aligned with each client's unique objectives. Whether relocating for professional or personal purposes, Lauture Global LTD is committed to facilitating a successful, efficient, and stress-free relocation experience.
              </p>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-20" style={{ background: "hsl(228 60% 11%)" }}>
          <div className="container">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground text-center mb-4">
              Complete guidance for your journey in Rwanda
            </h2>
            <p className="text-secondary text-center max-w-2xl mx-auto mb-12">
              Experience exceptional opportunities with Lauture Global LTD — your trusted partner for discovering its dynamic landscape or relocating to Rwanda.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <div key={s.title} className="rounded-lg overflow-hidden group">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      width={640}
                      height={512}
                    />
                  </div>
                  <div className="p-5 bg-primary-foreground/5">
                    <div className="w-12 h-0.5 bg-accent mb-3" />
                    <h3 className="font-heading font-semibold text-primary-foreground text-lg leading-snug">
                      {s.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button variant="gold" size="lg" asChild>
                <Link to="/services">View Our Packages <ArrowRight size={18} /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="relative py-24 overflow-hidden">
          <img
            src={ctaKigali}
            alt="Kigali skyline at night"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            width={1920}
            height={800}
          />
          <div className="absolute inset-0 bg-primary/80" />
          <div className="container relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Unlock Your Next Journey in Rwanda
            </h2>
            <p className="text-primary-foreground/80 mb-8 leading-relaxed">
              Discover Rwanda on your terms — whether you're seeking an unforgettable vacation or planning a seamless relocation. With Lauture Global LTD, our expert team guides you every step of the way.
            </p>
            <Button variant="gold" size="lg" asChild>
              <Link to="/contact">Start Your Journey <ArrowRight size={18} /></Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
