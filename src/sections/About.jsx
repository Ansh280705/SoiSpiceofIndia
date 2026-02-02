import { motion } from "framer-motion";
import about_spices from "../assets/about_spices.png";

export default function About() {
  const stats = [
    { label: "Heritage", value: "10+ Years" },
    { label: "Purity", value: "100% Assurance" },
    { label: "Varieties", value: "10+ Products" },
  ];

  return (
    <section
      id="about"
      className="min-h-screen w-full flex items-center justify-center relative bg-brand-bg text-brand-text overflow-hidden"
    >
      {/* Decorative Ornaments */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-secondary/5 rounded-full -ml-40 -mb-40 blur-3xl animate-pulse delay-700"></div>

      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 md:px-10 lg:px-12 py-24 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Image Side */}
        <motion.div
          className="relative w-full lg:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(165,42,42,0.3)] border-8 border-white">
            <img 
              src={about_spices} 
              alt="Authentic Spices" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
          {/* Accent Box */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-primary rounded-3xl -z-10 hidden md:block"></div>
        </motion.div>

        {/* Text Side */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-brand-primary font-bold text-xl uppercase tracking-widest mb-4 italic">
              Our Journey of Taste
            </h2>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Crafting Flavors that <br />
              <span className="text-brand-primary">Linger for Generations</span>
            </h3>

            <p className="text-lg text-brand-text/80 leading-relaxed mb-8 max-w-2xl">
              SOI Spice of India has been the guardian of authentic Indian flavors for over 
              one decade. We source the finest whole spices directly from the 
              farmers, processing them with state-of-the-art 'Stay Fresh' 
              technology to ensure that every pinch you use is as vibrant and 
              aromatic as nature intended.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-brand-primary"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-3xl font-bold text-brand-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-brand-text/60 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#quality"
                className="bg-brand-primary text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-brand-primary/90 transition-all text-center"
              >
                The SOI Edge
              </a>
              <a
                href="#products"
                className="border-2 border-brand-primary text-brand-primary px-8 py-4 rounded-full font-bold hover:bg-brand-primary hover:text-white transition-all text-center"
              >
                Explore Range
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
