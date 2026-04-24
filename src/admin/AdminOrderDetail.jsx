import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiArrowLeft, FiShoppingBag, FiUser, FiMapPin, FiPhone, 
  FiMail, FiClock, FiCheckCircle, FiPackage, FiTruck, FiCheck 
} from "react-icons/fi";
import { useApp } from "../context/AppContext";

const STATUS_STEPS = [
  { id: "Pending", icon: FiClock, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "Confirmed", icon: FiCheckCircle, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "Shipped", icon: FiTruck, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "Delivered", icon: FiCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" }
];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, addToast } = useApp();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const found = orders.find(o => o.id === id);
    if (found) setOrder(found);
  }, [id, orders]);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-white/20 text-lg mb-6">Order not found or loading...</p>
          <button 
            onClick={() => navigate("/admin/dashboard")}
            className="px-8 py-3 bg-white/5 text-white rounded-2xl font-bold border border-white/10 hover:bg-white/10 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = (status) => {
    updateOrderStatus(order.id, status);
    addToast(`Status updated to ${status}`, "success");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-inter pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-all"
          >
            <FiArrowLeft />
          </button>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-white/40">Order Details</h1>
            <p className="font-mono text-xs font-bold text-brand-primary">{order.id}</p>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter border ${
          order.status === "Delivered" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
          order.status === "Pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
          "bg-blue-500/10 text-blue-400 border-blue-500/20"
        }`}>
          {order.status}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 md:px-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Order Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Status Timeline */}
          <section className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
              Order Lifecycle <div className="h-px flex-1 bg-white/5" />
            </h3>
            <div className="flex flex-col md:flex-row justify-between gap-6 relative">
              {/* Desktop Connecting Line */}
              <div className="absolute top-5 left-0 w-full h-0.5 bg-white/5 hidden md:block" />
              
              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = STATUS_STEPS.findIndex(s => s.id === order.status) >= idx;
                const isActive = order.status === step.id;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStatusUpdate(step.id)}
                    className="relative z-10 flex md:flex-col items-center gap-4 md:text-center group transition-all"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isCompleted ? "bg-brand-primary text-white" : "bg-white/5 text-white/20"
                    } ${isActive ? "ring-4 ring-brand-primary/20 scale-110" : ""}`}>
                      <step.icon />
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-widest ${isCompleted ? "text-white" : "text-white/20"}`}>
                        {step.id}
                      </p>
                      {isActive && <p className="text-[10px] text-brand-primary font-black mt-1">Current State</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Items List */}
          <section className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] overflow-hidden">
             <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-bold">Shopping Basket</h3>
                <span className="text-white/40 text-sm font-medium">{(order.cart || []).length} Items</span>
             </div>
             <div className="divide-y divide-white/5">
                {(order.cart || []).map((item, i) => (
                  <div key={i} className="p-6 md:p-8 flex items-center gap-6 group hover:bg-white/[0.01] transition-colors">
                     <div className="w-20 h-20 md:w-24 md:h-24 bg-white/5 rounded-3xl overflow-hidden flex-shrink-0 border border-white/5">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/10">
                            <FiPackage size={32} />
                          </div>
                        )}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-brand-primary text-[10px] font-black uppercase tracking-widest mb-1">{item.category || "Authentic Spice"}</p>
                        <h4 className="text-white font-bold text-lg md:text-xl truncate mb-1">{item.name}</h4>
                        <p className="text-white/40 text-sm font-medium">Variant: {item.weight} • Qty: {item.quantity}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-white font-black text-xl">₹{item.price * item.quantity}</p>
                        <p className="text-white/30 text-xs font-medium">₹{item.price} / unit</p>
                     </div>
                  </div>
                ))}
             </div>
             <div className="p-8 bg-brand-primary/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                   <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">Total Payable</p>
                   <p className="text-brand-primary text-4xl font-black">₹{order.totalPrice}</p>
                </div>
                <div className="flex gap-4">
                   <div className="bg-[#1a1a1a] px-6 py-3 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Payment Status</p>
                      <p className="text-xs font-black text-white">Paid via Online</p>
                   </div>
                </div>
             </div>
          </section>
        </div>

        {/* Right Column: Customer & Shipping */}
        <div className="space-y-8">
           
           {/* Customer Card */}
           <section className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                 Customer <FiUser className="text-brand-primary" />
              </h3>
              <div className="space-y-5">
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                       <FiUser />
                    </div>
                    <div>
                       <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Full Name</p>
                       <p className="text-white font-bold">{order.customerInfo?.name || order.customerName}</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                       <FiMail />
                    </div>
                    <div className="min-w-0">
                       <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Email Address</p>
                       <p className="text-white font-bold truncate">{order.customerInfo?.email || order.email}</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                       <FiPhone />
                    </div>
                    <div>
                       <p className="text-xs text-white/30 font-bold uppercase tracking-widest">Phone Number</p>
                       <p className="text-white font-bold">{order.customerInfo?.phone || order.phone}</p>
                    </div>
                 </div>
              </div>
           </section>

           {/* Shipping Card */}
           <section className="bg-[#0f0f0f] border border-white/5 rounded-[2.5rem] p-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                 Shipping Address <FiMapPin className="text-brand-primary" />
              </h3>
              <div className="bg-white/5 rounded-3xl p-6 relative overflow-hidden group">
                 <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                    <FiMapPin size={100} />
                 </div>
                 <p className="text-white font-bold text-lg leading-relaxed mb-4">
                    {order.customerInfo?.address || order.address}
                 </p>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">City</p>
                       <p className="text-white font-black">{order.customerInfo?.city || order.city}</p>
                    </div>
                    <div>
                       <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Pincode</p>
                       <p className="text-white font-black">{order.customerInfo?.pincode || order.pincode}</p>
                    </div>
                    <div className="col-span-2">
                       <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">State</p>
                       <p className="text-white font-black">{order.customerInfo?.state || order.state}</p>
                    </div>
                 </div>
              </div>
           </section>

           {/* Order Info */}
           <section className="bg-brand-primary/10 border border-brand-primary/20 rounded-[2.5rem] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                 <FiShoppingBag className="text-brand-primary/20" size={40} />
              </div>
              <p className="text-[10px] text-brand-primary font-black uppercase tracking-widest mb-4">Order Metatdata</p>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-white/40 text-xs font-bold">Placed On</span>
                    <span className="text-white text-xs font-bold">{new Date(order.createdAt).toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-white/40 text-xs font-bold">Order Number</span>
                    <span className="text-white text-xs font-bold">{order.orderNumber || "SOI-XXXXXX"}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-white/40 text-xs font-bold">System ID</span>
                    <span className="text-white font-mono text-[10px] opacity-50">{order.id}</span>
                 </div>
              </div>
           </section>

        </div>
      </main>
    </div>
  );
}
