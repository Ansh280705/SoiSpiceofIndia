import React from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";

export default function OrderSuccessPage() {
  return (
    <div className="bg-[#faf9f6] min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 md:p-20 rounded-[4rem] shadow-2xl border border-brand-primary/10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent"></div>
          
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-5xl mx-auto mb-10 shadow-inner">
            <FiCheckCircle />
          </div>

          <h1 className="text-4xl md:text-6xl font-playfair font-black text-brand-text mb-6">Order Placed!</h1>
          <p className="text-xl text-brand-text/60 mb-12 leading-relaxed max-w-xl mx-auto italic">
            "Your journey into authentic Indian flavors has begun. We've received your order and our master blenders are already at work."
          </p>
          
          <div className="bg-brand-bg/50 rounded-3xl p-8 mb-12 flex flex-col md:flex-row gap-8 justify-around items-center">
             <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-text/40 mb-1">Status</p>
                <p className="text-2xl font-black text-green-600">Confirmed</p>
             </div>
             <div className="w-px h-12 bg-brand-text/10 hidden md:block"></div>
             <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-text/40 mb-1">Delivery</p>
                <p className="text-xl font-black text-brand-text">3-5 Business Days</p>
             </div>
          </div>

          <Link 
            to="/"
            className="group bg-brand-text text-white px-14 py-5 rounded-full font-bold text-xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-4 mx-auto w-fit"
          >
            Back to Home <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
