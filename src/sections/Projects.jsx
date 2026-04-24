import React from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

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
        tagline: "Vibrant & Fiery",
        description: "Experience the vibrant heat and deep red color of SOI Spice of India. Sourced from the finest farms, our chilli powder is 100% natural with zero adulteration.",
        bgColor: "#fffbf0",
        image: red_chilli_signature,
        accent: "#a52a2a",
        features: ["Handpicked", "Sun-dried", "High Capsaicin"]
      },
      {
        title: "Turmeric Powder",
        tagline: "Golden & Pure",
        description: "The golden essence of purity. Our turmeric is processed to retain its high curcumin content and natural aroma. A powerful antioxidant for your daily health.",
        bgColor: "#fdf5e6",
        image: turmeric_signature,
        accent: "#d2691e",
        features: ["High Curcumin", "Antiseptic", "Rich Aroma"]
      },
      {
        title: "Coriander Powder",
        tagline: "Fragrant & Earthy",
        description: "Lush, fragrant, and purely natural. SOI Coriander Powder brings the authentic taste of tradition to every dish with its unique cooling properties.",
        bgColor: "#fffaf0",
        image: coriander_signature,
        accent: "#e6b800",
        features: ["Stone-ground", "Aromatic", "Direct Farm Source"]
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
    const unsubscribe = scrollYProgress.on("change", (v) => {
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
      className="relative transition-colors duration-700 ease-in-out font-inter"
      style={{
        height: `${100 * (products?.length || 0)}vh`,
        backgroundColor: activeProduct?.bgColor || "#ffffff",
      }}
    >
      <div className="sticky top-0 min-h-screen flex flex-col items-center justify-center overflow-hidden">
        
        {/* Background Decorative Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
             <motion.h2 
               key={activeIndex}
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 0.03, scale: 1 }}
               className="text-[20vw] font-black uppercase whitespace-nowrap text-brand-primary"
             >
               {activeProduct?.title?.split(' ')[0] || "SOI"}
             </motion.h2>
        </div>

        {/* Section Heading */}
        <div className="absolute top-12 text-center z-30">
          <h2 className="text-brand-primary text-4xl md:text-6xl font-signature mb-4">
            Our Signature Range
          </h2>
          <div className="h-1.5 w-24 bg-brand-primary mx-auto rounded-full opacity-30"></div>
        </div>

        <div className="relative w-full flex-1 flex items-center justify-center">
          {products.map((product, idx) => (
            <div
              key={product.title}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-in-out ${
                activeIndex === idx ? "opacity-100 translate-y-0 z-20" : "opacity-0 translate-y-20 z-0 pointer-events-none"
              }`}
            >
              <div className="max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 lg:gap-24 mt-20 lg:mt-0">
                
                {/* Text Side */}
                <div className="order-2 lg:order-1 text-center lg:text-left">
                  <AnimatePresence mode="wait">
                    {activeIndex === idx && (
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.6, ease: "circOut" }}
                      >
                        <div className="flex items-center gap-4 mb-4 justify-center lg:justify-start">
                           <div className="w-12 h-0.5 bg-brand-primary"></div>
                           <span className="text-brand-primary font-black uppercase tracking-[0.3em] text-xs md:text-sm">
                             {product.tagline}
                           </span>
                        </div>
                        
                        <MH3 className="text-6xl md:text-8xl font-playfair font-black text-brand-text mb-8 leading-[0.9]">
                          {activeProduct?.title?.split(' ').map((word, i) => (
                            <span key={i} className={i === 0 ? "text-brand-primary" : ""}>{word}<br/></span>
                          )) || "Premium Spices"}
                        </MH3>
                        
                        <p className="text-lg md:text-xl text-brand-text/60 mb-10 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed italic">
                          "{product.description}"
                        </p>

                        <div className="flex flex-wrap gap-4 mb-10 justify-center lg:justify-start">
                           {product.features.map(f => (
                             <span key={f} className="px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-brand-text/5 text-xs font-bold text-brand-text uppercase tracking-widest">
                               {f}
                             </span>
                           ))}
                        </div>
                        
                        <Link
                          to="/order"
                          className="group relative inline-flex items-center gap-4 bg-brand-text text-white px-12 py-5 rounded-full font-black uppercase tracking-widest shadow-2xl hover:bg-brand-primary transition-all overflow-hidden"
                        >
                          <span className="relative z-10">Purchase Now</span>
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center relative z-10 group-hover:bg-white/20 transition-all">
                             <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Image Side */}
                <div className="order-1 lg:order-2 flex justify-center perspective-1000">
                  <motion.div
                    className="relative w-full max-w-[450px] aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] group cursor-pointer"
                    initial={{ opacity: 0, rotateY: 15, scale: 0.8 }}
                    animate={activeIndex === idx ? { opacity: 1, rotateY: 0, scale: 1 } : {}}
                    transition={{ duration: 1, ease: "anticipate" }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Glass Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-40">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const target = sceneRef.current;
                if (target) {
                   const scrollPos = (i / products.length) * target.scrollHeight;
                   window.scrollTo({ top: scrollPos, behavior: 'smooth' });
                }
              }}
              className={`group flex items-center gap-4 transition-all duration-300`}
            >
              <div className={`w-3 h-3 rounded-full border-2 border-brand-primary transition-all duration-500 ${
                activeIndex === i ? "bg-brand-primary scale-150 shadow-[0_0_15px_rgba(165,42,42,0.6)]" : "bg-transparent opacity-30"
              }`}></div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                activeIndex === i ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}>
                0{i + 1}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
