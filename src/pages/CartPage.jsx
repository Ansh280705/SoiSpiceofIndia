import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, addToast } = useApp(); // Need to update context to handle cart globally

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const DELIVERY_FEE = 30;
  const total = cart.length > 0 ? subtotal + DELIVERY_FEE : 0;

  return (
    <div className="bg-[#faf9f6] min-h-screen font-inter">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
           <div>
              <h1 className="text-5xl md:text-7xl font-playfair font-black text-brand-text">Your Basket</h1>
              <p className="text-brand-text/50 mt-4 font-medium italic">"Premium spices, curated just for you."</p>
           </div>
           <Link to="/order" className="flex items-center gap-2 text-brand-primary font-bold hover:gap-4 transition-all">
              <FiArrowLeft /> Continue Shopping
           </Link>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl border border-brand-text/5">
             <div className="w-24 h-24 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-8 text-brand-text/20">
                <FiShoppingCart size={48} />
             </div>
             <h2 className="text-3xl font-bold text-brand-text mb-4">Your basket is empty</h2>
             <p className="text-brand-text/40 mb-10 max-w-md mx-auto">Looks like you haven't added any premium SOI spices yet. Explore our range and start your flavor journey.</p>
             <Link to="/order" className="bg-brand-primary text-white px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-2xl transition-all inline-block">
                Explore Products
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Cart Items */}
            <div className="lg:col-span-8 space-y-6">
               <div className="bg-white rounded-[3rem] shadow-xl border border-brand-text/5 overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="w-full">
                        <thead className="bg-brand-bg/50 border-b border-brand-text/5">
                           <tr>
                              <th className="text-left px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40">Product</th>
                              <th className="text-center px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40">Quantity</th>
                              <th className="text-right px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/40">Total</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-text/5">
                           <AnimatePresence>
                              {cart.map((item) => (
                                <motion.tr 
                                  key={item.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: 20 }}
                                  className="group hover:bg-brand-bg/20 transition-colors"
                                >
                                   <td className="px-8 py-8">
                                      <div className="flex items-center gap-6">
                                         <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                         </div>
                                         <div>
                                            <h3 className="font-bold text-brand-text text-lg">{item.name}</h3>
                                            <p className="text-xs font-black text-brand-primary uppercase mt-1 tracking-widest">{item.weight}</p>
                                            <button 
                                              onClick={() => removeFromCart(item.id)}
                                              className="mt-3 flex items-center gap-1 text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest"
                                            >
                                               <FiTrash2 /> Remove
                                            </button>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="px-6 py-8">
                                      <div className="flex items-center justify-center gap-4">
                                         <button 
                                           onClick={() => updateCartQuantity(item.id, -1)}
                                           className="w-10 h-10 rounded-xl bg-brand-bg flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                                         >
                                            <FiMinus />
                                         </button>
                                         <span className="text-lg font-black w-8 text-center">{item.quantity}</span>
                                         <button 
                                           onClick={() => updateCartQuantity(item.id, 1)}
                                           className="w-10 h-10 rounded-xl bg-brand-bg flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                                         >
                                            <FiPlus />
                                         </button>
                                      </div>
                                   </td>
                                   <td className="px-8 py-8 text-right">
                                      <p className="text-xl font-black text-brand-text">₹{item.price * item.quantity}</p>
                                      <p className="text-xs text-brand-text/30 font-medium mt-1">₹{item.price} / unit</p>
                                   </td>
                                </motion.tr>
                              ))}
                           </AnimatePresence>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-4 sticky top-32">
               <div className="bg-white rounded-[3rem] shadow-2xl border border-brand-text/5 overflow-hidden">
                  <div className="bg-brand-text p-8 text-white">
                     <h2 className="text-xl font-black uppercase tracking-widest">Order Summary</h2>
                  </div>
                  <div className="p-10 space-y-6">
                     <div className="flex justify-between text-sm font-bold text-brand-text/50 uppercase tracking-widest">
                        <span>Items Subtotal</span>
                        <span>₹{subtotal}</span>
                     </div>
                     <div className="flex justify-between text-sm font-bold text-brand-text/50 uppercase tracking-widest">
                        <span>Delivery Fee</span>
                        <span>₹{DELIVERY_FEE}</span>
                     </div>
                     <div className="h-px bg-brand-text/5 w-full"></div>
                     <div className="flex justify-between items-end">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-text/30">Total Amount</p>
                           <p className="text-5xl font-black text-brand-primary tracking-tighter">₹{total}</p>
                        </div>
                     </div>
                     
                     <Link 
                       to="/checkout" 
                       className="w-full bg-brand-primary text-white py-6 rounded-2xl font-black text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-4 group"
                     >
                        Proceed to Checkout <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
                     </Link>
                     
                     <p className="text-[10px] text-center font-black uppercase tracking-[0.2em] text-brand-text/20">
                        Secure 256-bit SSL encrypted payment
                     </p>
                  </div>
               </div>
               
               <div className="mt-8 flex items-center justify-center gap-8 opacity-30 grayscale contrast-125">
                  <img src="/fssai_logo.png" className="h-8" alt="FSSAI" />
                  <img src="/iso_logo.png" className="h-8" alt="ISO" />
               </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
