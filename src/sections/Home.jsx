import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

import hero_bg from "../assets/hero_bg.png";
import hero_slider_3 from "../assets/hero_slider_3.png";
import hero_mobile from "../assets/hero_mobile.jpg";

const SLIDE_DURATION = 6000;

const slides = [
  { 
    image: hero_bg, 
    mobileImage: hero_mobile,
    tagline: "Zero Adulteration. Real Taste." 
  },
  { 
    image: hero_slider_3, 
    mobileImage: hero_bg,
    tagline: "The World's Finest Organic Spices." 
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  const roles = useMemo(
    () => ["100% Organic", "Zero Adulteration", "Farm to Kitchen", "Naturally Pure"],
    [],
  );

  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[index];
    let delayTimeout;

    const timeout = setTimeout(
      () => {
        if (!deleting && subIndex < current.length) {
          setSubIndex((v) => v + 1);
        } else if (!deleting && subIndex === current.length) {
          delayTimeout = setTimeout(() => setDeleting(true), 1400);
        } else if (deleting && subIndex > 0) {
          setSubIndex((v) => v - 1);
        } else if (deleting && subIndex === 0) {
          setDeleting(false);
          setIndex((v) => (v + 1) % roles.length);
        }
      },
      deleting ? 40 : 60,
    );

    return () => {
      clearTimeout(timeout);
      clearTimeout(delayTimeout);
    };
  }, [subIndex, index, deleting, roles]);

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="w-full h-screen relative overflow-hidden flex items-center justify-center bg-black"
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          className="absolute inset-0 z-0 bg-black"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: mousePos.x,
            y: mousePos.y
          }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ 
            opacity: { duration: 1.5, ease: "easeInOut" },
            scale: { duration: 1.5, ease: "easeInOut" },
            x: { type: "spring", stiffness: 50, damping: 20 },
            y: { type: "spring", stiffness: 50, damping: 20 }
          }}
        >
          <picture className="w-full h-full">
            <source media="(max-width: 768px)" srcSet={slides[currentSlide].mobileImage || slides[currentSlide].image} />
            <img 
              src={slides[currentSlide].image} 
              alt="Hero Background"
              className="w-full h-full object-cover scale-110 md:object-center"
            />
          </picture>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
          {/* Subtle gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-brand-bg/40"></div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide + "tag"}
            className="mb-6 text-brand-secondary text-sm md:text-xl font-bold tracking-[0.3em] uppercase italic bg-white/10 px-6 py-2 rounded-full backdrop-blur-md border border-white/10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.8 }}
          >
            {slides[currentSlide].tagline}
          </motion.div>
        </AnimatePresence>

        <motion.h1
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white leading-[1] tracking-tighter"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-block overflow-hidden">
            <motion.span 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="inline-block"
            >
              Real Spices
            </motion.span>
          </span>
          <br />
          <span className="inline-block overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="inline-block bg-gradient-to-r from-brand-secondary via-brand-accent to-brand-primary bg-clip-text text-transparent drop-shadow-[0_10px_30px_rgba(165,42,42,0.4)]"
            >
              Real Purity
            </motion.span>
          </span>
        </motion.h1>

        <motion.div
          className="mt-10 text-base md:text-2xl text-brand-secondary font-bold h-12 flex items-center justify-center bg-white/5 backdrop-blur-xl px-8 rounded-full border border-white/20 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <span className="text-white/70 mr-3 font-medium uppercase tracking-widest text-xs md:text-sm">Experience</span>
          <span className="text-brand-secondary drop-shadow-[0_0_15px_rgba(230,184,0,0.5)]">{roles[index].substring(0, subIndex)}</span>
          <span className="inline-block w-[2px] ml-1 bg-brand-primary animate-pulse h-[0.8em] align-middle"></span>
        </motion.div>

        <motion.div
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <Link
            to="/order"
            className="group relative px-12 py-5 overflow-hidden rounded-full font-black text-sm uppercase tracking-[0.2em] text-white bg-brand-primary shadow-[0_20px_50px_-10px_rgba(165,42,42,0.6)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <span className="relative z-10">Order Now</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </Link>

          <a
            href="#products"
            className="group px-12 py-5 rounded-full text-sm font-black uppercase tracking-[0.2em] text-white border border-white/30 backdrop-blur-sm hover:bg-white hover:text-brand-primary transition-all hover:scale-105 active:scale-95"
          >
            View Range
          </a>
        </motion.div>
      </div>

      {/* Decorative side elements */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 z-20">
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
        <div className="text-white/20 vertical-text text-xs font-bold tracking-[0.5em] uppercase whitespace-nowrap" style={{ writingMode: 'vertical-rl' }}>
          Established 2014
        </div>
        <div className="w-px h-20 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
      </div>

      <div className="absolute right-10 bottom-20 hidden lg:block z-20">
         <div className="flex items-center gap-4 text-white/40">
            <span className="text-xs font-bold tracking-widest uppercase">Scroll to Explore</span>
            <div className="w-12 h-px bg-white/20"></div>
         </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-brand-bg via-brand-bg/50 to-transparent z-10"></div>
    </section>
  );
}
