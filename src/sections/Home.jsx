import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

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
      className="w-full h-screen relative overflow-hidden flex items-center justify-center bg-black"
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          className="absolute inset-0 z-0 bg-black"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <picture className="w-full h-full">
            <source media="(max-width: 768px)" srcSet={slides[currentSlide].mobileImage || slides[currentSlide].image} />
            <img 
              src={slides[currentSlide].image} 
              alt="Hero Background"
              className="w-full h-full object-cover object-[center_35%] md:object-center"
            />
          </picture>
          {/* Main Overlay - Lightened for 'Real' Colors */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]"></div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide + "tag"}
            className="mb-4 text-brand-secondary text-sm md:text-2xl font-bold tracking-[0.2em] uppercase italic bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.8 }}
          >
            {slides[currentSlide].tagline}
          </motion.div>
        </AnimatePresence>

        <motion.h1
          className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white leading-[1.05] tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Real Spices <br />
          <span className="bg-gradient-to-r from-brand-secondary via-brand-accent to-brand-primary bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(165,42,42,0.6)]">Real Purity</span>
        </motion.h1>

        <motion.div
          className="mt-8 text-base md:text-3xl text-brand-secondary font-bold h-10 flex items-center justify-center bg-white/5 backdrop-blur-md px-6 rounded-2xl border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <span className="text-white/80 mr-2 font-medium">Experience</span>
          <span className="text-brand-secondary drop-shadow-[0_0_10px_rgba(230,184,0,0.4)]">{roles[index].substring(0, subIndex)}</span>
          <span className="inline-block w-[3px] ml-1 bg-brand-primary animate-pulse h-[1em] align-middle"></span>
        </motion.div>

        <motion.p
          className="mt-8 text-lg md:text-xl text-brand-bg/95 max-w-3xl mx-auto font-medium leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          {/* At <span className="text-brand-secondary font-bold">SOI Spice of India</span>, we offer the world's best spices, 
          sourced 100% naturally from trusted farms. No additives, no colors, and absolutely 
          <span className="text-brand-primary font-bold"> zero adulteration (No Milwat)</span>. 
          Just the raw, vibrant power of nature in every pinch. */}
        </motion.p>

        <motion.div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <a
            href="#products"
            className="px-10 py-4 rounded-full font-bold text-lg text-white bg-brand-primary shadow-[0_15px_30px_-10px_rgba(165,42,42,0.5)] hover:bg-brand-primary/90 hover:scale-105 transition-all w-full sm:w-auto uppercase tracking-widest"
          >
            Explore Purity
          </a>

          <a
            href="#recipes"
            className="px-10 py-4 rounded-full text-lg font-bold text-brand-text bg-white/90 backdrop-blur-sm hover:bg-white shadow-2xl hover:scale-105 transition-all w-full sm:w-auto border-2 border-transparent hover:border-brand-primary/20"
          >
            Organic Recipes
          </a>
        </motion.div>
      </div>

      {/* Aesthetic Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand-bg to-transparent z-10"></div>
    </section>
  );
}
