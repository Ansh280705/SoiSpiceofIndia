import React from "react";
import { motion } from "framer-motion";

import red_chilli_signature from "../assets/red_chilli_signature.jpg";
import turmeric_signature from "../assets/turmeric_signature.jpg";
import coriander_signature from "../assets/coriander_signature.jpg";

const stories = [
  {
    heading: "The Fiery Fields of Bediya",
    subheading: "Where Strength Meets Tradition",
    content: "At SOI (Spice of India), we believe the best flavor comes from the source. Our Red Chilli is hand-selected from Bediya, Asia’s second-largest chilli hub. Known for its fierce heat and deep, natural crimson hue, the 'Nimari' chilli of Bediya is a legend among spice lovers. We work closely with local farmers to ensure only the brightest, sun-dried pods make it into our packs. Ground at low temperatures to preserve their natural oils, SOI brings you the true, unadulterated strength of Bediya—pure, pungent, and powerful.",
    image: red_chilli_signature,
    accent: "text-[#800020]",
    bg: "bg-[#fffafa]",
    label: "Bediya Chilli"
  },
  {
    heading: "The Yellow Gold of Erode. The Purity of SOI.",
    subheading: "Southern Sunshine for Superior Immunity",
    content: "Sourced from the rich, red soils of the Kaveri basin, SOI brings you the legendary Erode Turmeric. Protected by a prestigious GI Tag, our 'Yellow Gold' is famous for its deep color and high medicinal strength. Naturally sun-dried and cold-processed to lock in its potent Curcumin and essential oils, SOI is more than a spice—it is a concentrated drop of Southern sunshine, crafted for superior immunity and vibrant flavor.",
    image: turmeric_signature,
    accent: "text-[#B8860B]",
    bg: "bg-[#fffdf2]",
    label: "Erode Haldi"
  },
  {
    heading: "The Lemony Soul of Kumbhraj",
    subheading: "A Fragrant Balance for Every Dish",
    content: "Great cooking begins with the right balance. At SOI, we source our coriander seeds from the legendary fields of Kumbhraj, where the air is thick with the scent of a fresh harvest. Known for its high essential oil content and distinct citrusy notes, our coriander is more than just a base—it’s a flavor enhancer. We use slow-grinding technology to ensure that the delicate oils aren't lost to heat, giving you a 'Dhaniya Powder' that smells like it was freshly ground in your own kitchen.",
    image: coriander_signature,
    accent: "text-[#2E7D32]",
    bg: "bg-[#f7fff7]",
    label: "Kumbhraj Dhaniya"
  }
];

export default function OriginStory() {
  return (
    <section id="our-story" className="py-32 bg-white relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-secondary/5 rounded-full blur-3xl -mr-80 -mt-80"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-3xl -ml-80 -mb-80"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <motion.div 
          className="text-center mb-32"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-6 py-2 bg-brand-bg rounded-full border border-brand-accent/20 mb-6">
            <span className="text-brand-primary font-bold text-sm uppercase tracking-[0.4em]">Our Sourcing Legacy</span>
          </div>
          <h3 className="text-5xl md:text-7xl font-bold text-brand-text leading-tight">
            The Soul of Our <br />
            <span className="text-brand-primary font-signature italic text-6xl md:text-8xl lowercase opacity-90">Harvest</span>
          </h3>
        </motion.div>

        <div className="space-y-40">
          {stories.map((story, i) => (
            <motion.div
              key={i}
              className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-20 lg:gap-32`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              {/* Image Showpiece */}
              <div className="flex-1 w-full max-w-[600px] relative group">
                <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_60px_120px_-30px_rgba(0,0,0,0.25)] border-[2px] border-white/30 backdrop-blur-sm transition-all duration-700 group-hover:scale-[1.03] group-hover:-rotate-1">
                  <img 
                    src={story.image} 
                    alt={story.heading} 
                    className="w-full aspect-[5/6] object-cover"
                  />
                  {/* Glass Label */}
                  <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 transform transition-transform duration-700 delay-100 group-hover:translate-y-2">
                    <p className="text-white font-bold tracking-[0.2em] uppercase text-xs mb-1">Authentic Origin</p>
                    <p className="text-white text-2xl font-bold">{story.label}</p>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className={`absolute -inset-10 ${story.accent.replace('text-', 'bg-')} opacity-5 blur-[80px] rounded-full scale-125 -z-10`}></div>
                <div className={`absolute top-1/2 -z-20 w-[120%] h-[20%] ${story.accent.replace('text-', 'bg-')} opacity-[0.03] rotate-45 transform -translate-y-1/2`}></div>
              </div>

              {/* Editorial Narrative */}
              <div className="flex-1 text-center lg:text-left">
                <motion.div>
                  <p className={`text-xl font-bold mb-4 ${story.accent} tracking-widest uppercase`}>
                    {story.subheading}
                  </p>
                  <h4 className="text-4xl md:text-5xl lg:text-6xl font-black mb-10 text-brand-text leading-[1.1]">
                    {story.heading}
                  </h4>
                  <p className="text-xl text-brand-text/75 leading-[1.8] font-medium mb-12 italic relative">
                    <span className="absolute -left-10 -top-6 text-8xl text-brand-primary opacity-10 font-serif">“</span>
                    {story.content}
                  </p>
                  
                  <div className="flex items-center justify-center lg:justify-start gap-6">
                    <div className={`w-14 h-14 rounded-full ${story.accent.replace('text-', 'bg-')} text-white flex items-center justify-center shadow-lg transform transition-transform hover:scale-110`}>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-brand-text font-bold tracking-widest uppercase text-sm border-b-2 border-brand-primary pb-1">Master Blender's Choice</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
