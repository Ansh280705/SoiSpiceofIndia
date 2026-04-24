import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMessageSquare, FiTrash2, FiSearch, FiStar, FiUser, 
  FiPackage, FiCornerDownRight, FiCheckCircle, FiActivity 
} from "react-icons/fi";
import { useApp } from "../context/AppContext";

export default function AdminReviews() {
  const { reviews, deleteReview, replyToReview, addToast } = useApp();
  const [search, setSearch] = useState("");
  const [replyTexts, setReplyTexts] = useState({}); // { reviewId: text }

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

  const handleReply = async (id) => {
    const text = replyTexts[id];
    if (!text?.trim()) return;
    await replyToReview(id, text);
    setReplyTexts(prev => ({ ...prev, [id]: "" }));
  };

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
            Guest Book Management
          </motion.h2>
          <div className="h-1 w-24 bg-brand-primary rounded-full" />
          <p className="text-brand-text/40 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <FiActivity className="text-brand-primary" /> {reviews.length} total entries in the registry
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="relative group">
        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-brand-primary transition-colors text-xl" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by customer, content, or product..."
          className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white border border-brand-text/5 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/20 outline-none transition-all shadow-sm font-medium"
        />
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-32 text-center bg-white border border-dashed border-brand-text/10 rounded-[3rem]"
            >
              <FiMessageSquare className="mx-auto text-6xl text-brand-text/5 mb-4" />
              <p className="text-brand-text/20 font-black uppercase tracking-widest">No matching entries found</p>
            </motion.div>
          ) : (
            filtered.map((r, i) => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-white border border-brand-text/5 rounded-[3rem] p-8 md:p-12 shadow-sm hover:shadow-2xl transition-all duration-700"
              >
                <div className="flex flex-col lg:flex-row gap-10">
                   {/* Customer & Comment Section */}
                   <div className="flex-1 space-y-6">
                      <div className="flex flex-wrap items-center gap-6">
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-brand-text text-white rounded-2xl flex items-center justify-center font-black shadow-xl">
                               {r.customerName.charAt(0)}
                            </div>
                            <div>
                               <h4 className="text-xl font-playfair font-black text-brand-text">{r.customerName}</h4>
                               <div className="flex text-amber-500 text-xs mt-0.5">
                                  {[...Array(5)].map((_, i) => <FiStar key={i} className={i < r.rating ? "fill-current" : "text-brand-text/10"} />)}
                               </div>
                            </div>
                         </div>
                         <div className="bg-brand-bg text-brand-text/40 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-brand-text/5">
                            <FiPackage size={14} className="text-brand-primary" />
                            {r.product?.name || "Artisan Spice"}
                         </div>
                      </div>

                      <p className="text-brand-text/60 text-lg italic leading-relaxed font-medium pl-6 border-l-4 border-brand-primary/20 bg-[#faf9f6]/50 py-4 rounded-r-2xl">
                        "{r.comment}"
                      </p>

                      <p className="text-[10px] font-black uppercase tracking-widest text-brand-text/20">
                         Authored on {new Date(r.createdAt).toLocaleString()}
                      </p>
                   </div>

                   {/* Admin Reply Section */}
                   <div className="lg:w-[400px] flex flex-col gap-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary mb-2 flex items-center gap-2">
                         <FiCornerDownRight /> Official Response
                      </p>
                      
                      {r.adminReply ? (
                        <div className="bg-brand-text text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden group/reply">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                           <p className="relative z-10 text-sm font-medium italic opacity-90 leading-relaxed">"{r.adminReply}"</p>
                           <button 
                             onClick={() => setReplyTexts(prev => ({ ...prev, [r.id]: r.adminReply }))}
                             className="mt-4 text-[10px] font-black uppercase tracking-widest text-brand-secondary hover:underline relative z-10"
                           >
                              Edit Response
                           </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                           <textarea
                             value={replyTexts[r.id] || ""}
                             onChange={e => setReplyTexts(prev => ({ ...prev, [r.id]: e.target.value }))}
                             placeholder="Compose a thoughtful response..."
                             className="w-full bg-[#faf9f6] border border-brand-text/5 rounded-[2rem] p-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all resize-none"
                             rows={3}
                           />
                           <button
                             onClick={() => handleReply(r.id)}
                             disabled={!replyTexts[r.id]?.trim()}
                             className="w-full bg-brand-text text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-primary transition-all shadow-xl disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                           >
                             <FiCheckCircle /> Publish Response
                           </button>
                        </div>
                      )}
                   </div>
                </div>

                <button
                  onClick={() => handleDelete(r.id)}
                  className="absolute top-8 right-8 p-4 rounded-2xl text-brand-text/10 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                >
                  <FiTrash2 size={20} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

