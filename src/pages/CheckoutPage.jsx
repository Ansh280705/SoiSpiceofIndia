import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMapPin, FiUser, FiPhone, FiMail, FiChevronRight, FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";

export default function CheckoutPage() {
  const { cart, addToast } = useApp();
  const navigate = useNavigate();
  
  const [info, setInfo] = useState({
    name: "", email: "", phone: "", 
    address: "", city: "", state: "", pincode: "",
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/order");
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    setInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const required = ["name", "email", "phone", "address", "city", "state", "pincode"];
    if (required.some(f => !info[f])) {
      addToast("Please fill in all required fields", "error");
      return;
    }
    // Save to session or state for payment page
    sessionStorage.setItem("checkout_info", JSON.stringify(info));
    navigate("/payment");
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        
        <div className="flex items-center justify-between mb-12">
           <Link to="/cart" className="flex items-center gap-2 text-brand-text/40 font-bold hover:text-brand-primary transition-all">
              <FiArrowLeft /> Back to Basket
           </Link>
           <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/20">
              <span>Selection</span>
              <div className="w-8 h-px bg-brand-text/10"></div>
              <span>Basket</span>
              <div className="w-8 h-px bg-brand-text/10"></div>
              <span className="text-brand-primary">Shipping</span>
           </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-10 md:p-14 shadow-xl border border-brand-text/5"
        >
          <div className="mb-12">
             <h1 className="text-4xl md:text-6xl font-playfair font-black text-brand-text">Shipping Details</h1>
             <p className="text-brand-text/40 mt-2">Where should we send your premium SOI spices?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-text/40 ml-1">Full Name</label>
                  <input required name="name" value={info.name} onChange={handleChange} className="w-full p-5 rounded-2xl bg-brand-bg/30 border-transparent focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none font-semibold" placeholder="John Doe" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-text/40 ml-1">Email Address</label>
                  <input required type="email" name="email" value={info.email} onChange={handleChange} className="w-full p-5 rounded-2xl bg-brand-bg/30 border-transparent focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none font-semibold" placeholder="john@example.com" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-text/40 ml-1">Phone Number</label>
                  <input required type="tel" name="phone" value={info.phone} onChange={handleChange} className="w-full p-5 rounded-2xl bg-brand-bg/30 border-transparent focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none font-semibold" placeholder="+91 00000 00000" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-brand-text/40 ml-1">Pincode</label>
                  <input required name="pincode" value={info.pincode} onChange={handleChange} className="w-full p-5 rounded-2xl bg-brand-bg/30 border-transparent focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none font-semibold" placeholder="400001" />
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-brand-text/40 ml-1">Complete Address</label>
               <textarea required rows={3} name="address" value={info.address} onChange={handleChange} className="w-full p-5 rounded-2xl bg-brand-bg/30 border-transparent focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none font-semibold resize-none" placeholder="House No, Street, Area..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <input required name="city" value={info.city} onChange={handleChange} className="w-full p-5 rounded-2xl bg-brand-bg/30 border-transparent focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none font-semibold" placeholder="City" />
               <input required name="state" value={info.state} onChange={handleChange} className="w-full p-5 rounded-2xl bg-brand-bg/30 border-transparent focus:bg-white focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none font-semibold" placeholder="State" />
            </div>

            <button type="submit" className="w-full bg-brand-primary text-white py-6 rounded-3xl font-black text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-4 group">
               Proceed to Payment <FiChevronRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
