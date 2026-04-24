import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiTrash2, FiSearch, FiStar, FiUser, FiPackage } from "react-icons/fi";
import { useApp } from "../context/AppContext";

export default function AdminReviews() {
  const { reviews, deleteReview, addToast } = useApp();
  const [search, setSearch] = useState("");

  const filtered = reviews.filter(r => 
    r.customerName.toLowerCase().includes(search.toLowerCase()) ||
    r.comment.toLowerCase().includes(search.toLowerCase()) ||
    (r.product?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-white font-bold text-2xl">Customer Reviews</h2>
          <p className="text-white/30 text-sm">{reviews.length} total reviews</p>
        </div>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search reviews by customer, content, or product..."
          className="w-full pl-11 pr-5 py-4 bg-[#161616] border border-white/5 rounded-2xl text-white placeholder:text-white/20 font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="bg-[#161616] rounded-2xl p-16 text-center border border-white/5">
             <FiMessageSquare className="mx-auto text-4xl text-white/10 mb-3" />
             <p className="text-white/30 font-medium italic">No reviews found matching your search</p>
          </div>
        ) : (
          filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-[#161616] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:border-brand-primary/20 transition-all"
            >
               <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
                        <FiUser className="text-brand-primary" />
                        <span className="text-white font-bold">{r.customerName}</span>
                     </div>
                     <div className="flex text-amber-500 text-xs">
                        {[...Array(5)].map((_, i) => <FiStar key={i} className={i < r.rating ? "fill-current" : "text-white/10"} />)}
                     </div>
                     <span className="text-white/20 text-xs font-mono uppercase">ID: {r.id.slice(-6)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-white/40 text-xs font-medium">
                     <FiPackage size={14} />
                     <span>Product: <span className="text-white/60">{r.product?.name || "Deleted Product"}</span></span>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed italic bg-white/5 p-4 rounded-xl border border-white/5">
                    "{r.comment}"
                  </p>
                  
                  <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                    Posted on {new Date(r.createdAt).toLocaleString()}
                  </p>
               </div>

               <button
                 onClick={() => handleDelete(r.id)}
                 className="p-4 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all self-end md:self-center opacity-0 group-hover:opacity-100"
               >
                 <FiTrash2 />
               </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
