import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCreditCard, FiArrowLeft, FiShield } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";
import Footer from "../sections/Footer";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

export default function PaymentPage() {
  const { cart, addOrder, addToast, clearCart } = useApp();
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState(null);

  useEffect(() => {
    const info = sessionStorage.getItem("checkout_info");
    if (!info || cart.length === 0) {
      navigate("/checkout");
      return;
    }
    setCustomerInfo(JSON.parse(info));
  }, [cart, navigate]);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const DELIVERY_FEE = 30;
  const totalPrice = subtotal + DELIVERY_FEE;

  const handlePayment = () => {
    if (!RAZORPAY_KEY_ID) {
      addToast("Razorpay not configured. Simulating success...", "info");
      completeOrder(`SIM_${Date.now()}`);
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: totalPrice * 100,
      currency: "INR",
      name: "Spice of India",
      description: "Spice Order Payment",
      handler: function (response) {
        completeOrder(response.razorpay_payment_id);
      },
      prefill: {
        name: customerInfo?.name,
        email: customerInfo?.email,
        contact: customerInfo?.phone,
      },
      theme: { color: "#a52a2a" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const completeOrder = (paymentId) => {
    addOrder({
      cart,
      customerInfo,
      subtotal,
      totalPrice,
      paymentUid: paymentId,
    });
    clearCart();
    sessionStorage.removeItem("checkout_info");
    navigate("/order-success");
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
        
        <div className="flex items-center justify-between mb-12">
           <Link to="/checkout" className="flex items-center gap-2 text-brand-text/40 font-bold hover:text-brand-primary transition-all">
              <FiArrowLeft /> Back to Shipping
           </Link>
           <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-brand-text/20">
              <span>Shipping</span>
              <div className="w-8 h-px bg-brand-text/10"></div>
              <span className="text-brand-primary">Payment</span>
              <div className="w-8 h-px bg-brand-text/10"></div>
              <span>Success</span>
           </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl border border-brand-text/5 max-w-2xl mx-auto"
        >
          <div className="w-24 h-24 bg-brand-bg rounded-full flex items-center justify-center mx-auto mb-8 text-brand-primary">
             <FiCreditCard size={48} />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-playfair font-black text-brand-text mb-4">Secure Payment</h1>
          <p className="text-brand-text/40 mb-12">You are about to pay <span className="text-brand-primary font-black">₹{totalPrice}</span> for your order.</p>

          <div className="bg-brand-bg/50 rounded-3xl p-8 mb-12 space-y-4">
             <div className="flex justify-between text-xs font-black uppercase tracking-widest text-brand-text/40">
                <span>Items Subtotal</span>
                <span>₹{subtotal}</span>
             </div>
             <div className="flex justify-between text-xs font-black uppercase tracking-widest text-brand-text/40">
                <span>Delivery Fee</span>
                <span>₹{DELIVERY_FEE}</span>
             </div>
             <div className="h-px bg-brand-text/10 w-full"></div>
             <div className="flex justify-between items-center">
                <span className="text-sm font-black uppercase tracking-widest text-brand-text">Total Payable</span>
                <span className="text-3xl font-black text-brand-primary">₹{totalPrice}</span>
             </div>
          </div>

          <button 
            onClick={handlePayment}
            className="w-full bg-brand-primary text-white py-6 rounded-2xl font-black text-xl shadow-xl hover:shadow-2xl transition-all mb-6"
          >
             Pay Now via Razorpay
          </button>

          <div className="flex items-center justify-center gap-3 text-brand-text/30">
             <FiShield />
             <p className="text-[10px] font-black uppercase tracking-[0.2em]">256-bit SSL Encrypted Payment</p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
