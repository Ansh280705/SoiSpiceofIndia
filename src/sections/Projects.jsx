import React from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";

import anugraha_range from "../assets/anugraha_hero.jpg";
import red_chilli_signature from "../assets/red_chilli_signature.jpg";
import turmeric_signature from "../assets/turmeric_signature.jpg";
import coriander_signature from "../assets/coriander_signature.jpg";

const MH3 = motion.h3;

const useIsMobile = (query = "(max-width: 639px)") => {
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener?.("change", handler) || mql.addListener(handler);
    setIsMobile(mql.matches);
    return () =>
      mql.removeEventListener?.("change", handler) ||
      mql.removeListener(handler);
  }, [query]);

  return isMobile;
};

export default function Projects() {
  const isMobile = useIsMobile();

  const products = React.useMemo(
    () => [
      {
        title: "Red Chilli Powder",
        description: "Experience the vibrant heat and deep red color of SOI Spice of India. 100% natural, ethically sourced chillies with absolutely zero adulteration.",
        bgColor: "#fffbf0",
        image: red_chilli_signature,
        accent: "#a52a2a",
      },
      {
        title: "Turmeric Powder",
        description: "The golden essence of purity. Our turmeric is processed to retain its high curcumin content and natural aroma. No added colors or fillers.",
        bgColor: "#fdf5e6",
        image: turmeric_signature,
        accent: "#d2691e",
      },
      {
        title: "Coriander Powder",
        description: "Lush, fragrant, and purely natural. SOI Spice of India Coriander Powder brings the authentic taste of tradition to every dish with zero milwat.",
        bgColor: "#fffaf0",
        image: coriander_signature,
        accent: "#e6b800",
      },
    ],
    [],
  );

  const sceneRef = React.useRef(null);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start start", "end end"],
  });

  const thresholds = products.map((_, i) => (i + 1) / products.length);
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((v) => {
      const idx = thresholds.findIndex((t) => v <= t);
      setActiveIndex(idx === -1 ? thresholds.length - 1 : idx);
    });
    return () => unsubscribe();
  }, [scrollYProgress, thresholds]);

  const activeProduct = products[activeIndex];

  return (
    <section
      id="products"
      ref={sceneRef}
      className="relative transition-colors duration-500"
      style={{
        height: `${100 * products.length}vh`,
        backgroundColor: activeProduct.bgColor,
      }}
    >
      <div className="sticky top-0 min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Section Heading */}
        <div className="absolute top-4 md:top-12 text-center z-30">
          <h2 className="text-brand-primary text-4xl md:text-5xl font-signature mb-2">
            Signature Range
          </h2>
          <div className="h-1 w-20 bg-brand-primary mx-auto rounded-full"></div>
        </div>

        <div className="relative w-full flex-1 flex items-center justify-center">
          {products.map((product, idx) => (
            <div
              key={product.title}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                activeIndex === idx ? "opacity-100 scale-100 z-20" : "opacity-0 scale-95 z-0 pointer-events-none"
              }`}
            >
              <div className="max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 mt-32 lg:mt-12">
                
                {/* Text Side */}
                <div className="order-2 lg:order-1 text-center lg:text-left">
                  <AnimatePresence mode="wait">
                    {activeIndex === idx && (
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.5 }}
                      >
                        <MH3 className="text-5xl md:text-7xl font-bold text-brand-primary mb-6">
                          {product.title}
                        </MH3>
                        <p className="text-xl text-brand-text/70 mb-8 max-w-lg mx-auto lg:mx-0 font-medium">
                          {product.description}
                        </p>
                        <motion.a
                          href="#contact"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-block bg-brand-primary text-white px-10 py-4 rounded-full font-bold shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                        >
                          View Range
                        </motion.a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Image Side */}
                <div className="order-1 lg:order-2 flex justify-center">
                  <motion.div
                    className="relative w-full max-w-[500px] h-[350px] md:h-[500px] rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(165,42,42,0.4)] border-4 border-white"
                    initial={{ opacity: 0, rotate: 5, scale: 0.9 }}
                    animate={activeIndex === idx ? { opacity: 1, rotate: 0, scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">
          {products.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border-2 border-brand-primary transition-all duration-300 ${
                activeIndex === i ? "bg-brand-primary h-10" : "bg-transparent"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
}
