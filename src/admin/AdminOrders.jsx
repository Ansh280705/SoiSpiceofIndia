import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiShoppingBag, FiSearch, FiChevronDown, FiEye, FiCalendar, 
  FiUser, FiArrowRight, FiPackage, FiActivity 
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered"];

const STATUS_STYLES = {
  Pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

export default function AdminOrders() {
  const { orders, updateOrderStatus, addToast } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const handleStatusChange = (e, id) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    updateOrderStatus(id, newStatus);
    addToast(`Order updated to ${newStatus}`, "success");
  };

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.customerInfo?.name || o.customerName || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-12 min-h-screen bg-[#faf9f6] -m-10 p-10 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-2">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-brand-primary text-5xl md:text-6xl font-signature"
          >
            Order Registry
          </motion.h2>
          <div className="h-1 w-24 bg-brand-primary rounded-full" />
          <p className="text-brand-text/40 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <FiActivity className="text-brand-primary" /> Managing {orders.length} active transactions
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white border border-brand-text/5 px-8 py-4 rounded-[2rem] shadow-sm">
              <p className="text-[10px] text-brand-text/30 font-black uppercase tracking-widest mb-1">Total Revenue</p>
              <p className="text-3xl font-black text-brand-text">₹{orders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0).toLocaleString()}</p>
           </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative flex-1 group">
          <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-brand-primary transition-colors text-xl" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, Name or Phone..."
            className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white border border-brand-text/5 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/20 outline-none transition-all shadow-sm font-medium"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["All", ...STATUSES].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-8 py-4 rounded-full font-bold text-sm whitespace-nowrap transition-all border ${
                filterStatus === s 
                  ? "bg-brand-text text-white border-brand-text shadow-lg" 
                  : "bg-white text-brand-text/50 border-brand-text/5 hover:border-brand-primary/20"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Artisan Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="col-span-full py-32 text-center bg-white border border-dashed border-brand-text/10 rounded-[3rem]"
            >
              <FiShoppingBag className="mx-auto text-6xl text-brand-text/5 mb-4" />
              <p className="text-brand-text/20 font-black uppercase tracking-widest">No matching orders found</p>
            </motion.div>
          ) : (
            filtered.map((order, i) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/admin/orders/${order.id}`)}
                className="group relative bg-white rounded-[3.5rem] overflow-hidden border border-brand-text/5 shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer"
              >
                {/* Header Image/Icon Section */}
                <div className="relative h-64 bg-brand-bg/20 flex items-center justify-center p-12 overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/5 to-transparent"></div>
                   
                   {/* Product Preview Stack */}
                   <div className="relative flex -space-x-12">
                      {(order.cart || []).slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-24 h-24 rounded-[2rem] bg-white border-4 border-[#faf9f6] overflow-hidden shadow-2xl transform transition-transform group-hover:scale-110 group-hover:rotate-3" style={{ zIndex: 10 - idx }}>
                           {item.image ? (
                             <img src={item.image} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-brand-text/10">
                                <FiPackage size={32} />
                             </div>
                           )}
                        </div>
                      ))}
                      {(order.cart || []).length > 3 && (
                        <div className="w-24 h-24 rounded-[2rem] bg-white/80 backdrop-blur-md border-4 border-[#faf9f6] flex items-center justify-center text-sm font-black text-brand-text z-0">
                           +{(order.cart || []).length - 3}
                        </div>
                      )}
                   </div>

                   {/* Status Badge */}
                   <div className="absolute top-8 right-8">
                      <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${STATUS_STYLES[order.status]}`}>
                         {order.status}
                      </div>
                   </div>
                   
                   {/* Date Badge */}
                   <div className="absolute top-8 left-8">
                      <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-brand-text/40 border border-brand-text/5">
                         {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                   </div>
                </div>

                {/* Content Section */}
                <div className="p-10 pt-8">
                   <div className="mb-8">
                      <p className="text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">Order Info</p>
                      <h3 className="text-3xl font-playfair font-black text-brand-text mb-2 group-hover:text-brand-primary transition-colors">
                         {order.customerInfo?.name || order.customerName || "Anonymous User"}
                      </h3>
                      <p className="text-brand-text/40 text-sm font-medium italic line-clamp-2">
                        "{(order.cart || []).map(item => item.name).join(", ")}"
                      </p>
                   </div>

                   <div className="flex items-center justify-between pt-8 border-t border-brand-text/5">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary mb-1">Total Value</p>
                         <p className="text-3xl font-black text-brand-text">₹{order.totalPrice.toLocaleString()}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                         <select
                           onClick={(e) => e.stopPropagation()}
                           onChange={(e) => handleStatusChange(e, order.id)}
                           value={order.status}
                           className="bg-brand-bg text-brand-text/60 border border-brand-text/5 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all cursor-pointer hover:bg-white"
                         >
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                         <button className="w-14 h-14 bg-brand-bg text-brand-text rounded-full flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all shadow-inner border border-brand-text/5">
                            <FiArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                         </button>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


