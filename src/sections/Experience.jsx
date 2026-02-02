import React from "react";
import { motion } from "framer-motion";
import quality_lab from "../assets/quality_lab.png";

export default function Experience() {
  const steps = [
    {
      title: "Ethical Global Sourcing",
      desc: "Our Master Blenders traverse the globe to hand-select only the most vibrant and aromatic whole spices from their native soils.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      color: "text-[#a52a2a]",
      bg: "bg-[#a52a2a]/5"
    },
    {
      title: "Cryogenic Cold-Grinding",
      desc: "We utilize state-of-the-art cold-grinding technology at sub-zero temperatures to preserve delicate essential oils and volatile flavors.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      ),
      color: "text-[#e6b800]",
      bg: "bg-[#e6b800]/10"
    },
    {
      title: "Triple-Spectrum Testing",
      desc: "Every batch is subjected to ISO-standard testing for purity, microbial safety, and curcumin potency in our NABL-accredited facility.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      ),
      color: "text-[#D32F2F]",
      bg: "bg-[#D32F2F]/5"
    },
  ];

  return (
    <section id="quality" className="py-32 bg-brand-bg relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#a52a2a" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          {/* Text Content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2 className="text-brand-primary font-bold text-lg uppercase tracking-[0.3em] mb-6 flex items-center">
                <span className="w-12 h-[1px] bg-brand-primary mr-4"></span>
                The SOI Standard
              </h2>
              <h3 className="text-5xl md:text-6xl font-bold mb-10 text-brand-text leading-[1.1]">
                Uncompromising <br />
                <span className="text-brand-primary italic">Purity & Perfection</span>
              </h3>
              
              <div className="space-y-12">
                {steps.map((step, i) => (
                  <motion.div 
                    key={i} 
                    className="flex gap-8 group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    viewport={{ once: true }}
                  >
                    <div className={`w-20 h-20 shrink-0 ${step.bg} rounded-3xl flex items-center justify-center ${step.color} shadow-sm group-hover:scale-110 transition-transform duration-500 border border-white/50 backdrop-blur-sm`}>
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-brand-text mb-3 tracking-tight group-hover:text-brand-primary transition-colors duration-300">
                        {step.title}
                      </h4>
                      <p className="text-lg text-brand-text/70 leading-relaxed font-medium max-w-md">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Image Content */}
          <motion.div
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.95, x: 50 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {/* Soft Glow Background */}
            <div className="absolute inset-0 bg-brand-primary/20 blur-[120px] rounded-full scale-75 opacity-30"></div>

            <div className="relative rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(45,45,45,0.3)] border-[16px] border-white group">
              <img 
                src={quality_lab} 
                alt="Quality Testing Lab" 
                className="w-full aspect-[9/10] object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              
              {/* Image Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            {/* Aesthetic Badge */}
            <motion.div 
              className="absolute -bottom-10 -left-10 bg-brand-primary text-white p-10 rounded-[2.5rem] shadow-[0_20px_40px_rgba(165,42,42,0.4)] z-20"
              initial={{ rotate: -5 }}
              whileInView={{ rotate: 3 }}
              transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl font-black mb-2 tracking-tighter">99.9%</div>
              <div className="text-[10px] font-black uppercase tracking-[0.25em] leading-tight opacity-90">
                Purity <br /> Guaranteed
              </div>
              {/* Small accent dot */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-secondary animate-ping"></div>
            </motion.div>

            {/* Floating Detail Elements */}
            <div className="absolute top-1/2 -right-8 w-16 h-16 bg-brand-secondary rounded-2xl shadow-xl flex items-center justify-center text-brand-text text-2xl -rotate-12 animate-bounce-slow">
              ✨
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
