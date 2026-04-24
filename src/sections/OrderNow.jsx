import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiPlus, FiMinus, FiShoppingCart, FiSearch, FiArrowRight, 
  FiStar, FiPackage, FiMessageSquare, FiX, FiCheck, FiChevronRight 
} from "react-icons/fi";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";

// Fallback Assets
import chilliImg from "../assets/red_chilli_signature.jpg";
import turmericImg from "../assets/turmeric_signature.jpg";
import corianderImg from "../assets/coriander_signature.jpg";

const ASSET_MAP = {
  red_chilli_signature: chilliImg,
  turmeric_signature: turmericImg,
  coriander_signature: corianderImg,
};

const WEIGHTS = ["50g", "100g", "250g"];
const CATEGORIES = ["All", "Pure Spices", "Blended Spices", "Exotic Herbs", "Aromatic Seeds"];

const getProductImage = (product) => {
  if (product.image) return product.image; // Base64 or URL from DB
  if (product.imageKey && ASSET_MAP[product.imageKey]) return ASSET_MAP[product.imageKey];
  return "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800"; // High-quality spice placeholder
};

function ProductDetailModal({ product, onClose }) {
  const { addToCart, addReview, cart } = useApp();
  const [selectedWeight, setSelectedWeight] = useState("100g");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "", customerName: "" });

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment || !reviewForm.customerName) return;
    await addReview(product.id, reviewForm);
    setReviewForm({ rating: 5, comment: "", customerName: "" });
    setShowReviewForm(false);
  };

  const displayImage = getProductImage(product);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="relative w-full max-w-6xl bg-white rounded-[3.5rem] shadow-2xl z-10 flex flex-col md:flex-row max-h-[92vh] overflow-y-auto md:overflow-hidden custom-scrollbar"
      >
        {/* Mobile Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 z-[210] w-12 h-12 bg-white/80 backdrop-blur-md shadow-xl rounded-full flex items-center justify-center text-brand-text md:hidden">
           <FiX size={24} />
        </button>

        {/* Left: Image Section - Now sticky on desktop, scrollable on mobile */}
        <div className="w-full md:w-1/2 bg-[#faf9f6] relative min-h-[400px] md:h-auto overflow-hidden">
           {/* Desktop Close Button */}
           <button onClick={onClose} className="absolute top-8 left-8 z-20 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full hidden md:flex items-center justify-center text-brand-text transition-all backdrop-blur-sm">
              <FiX size={24} />
           </button>

           <div className="h-full w-full flex items-center justify-center p-8 md:p-16">
              <motion.img 
                layoutId={`img-${product.id}`}
                src={displayImage} 
                alt={product.name} 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileInView={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-full h-full object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)]"
              />
           </div>

           {/* Artisan Image Badges */}
           <div className="absolute bottom-10 left-10 flex flex-col gap-3">
              <span className="bg-white/90 backdrop-blur-md text-brand-text px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl border border-brand-text/5 w-fit">
                 {product.category}
              </span>
           </div>
        </div>

        {/* Right: Details Section */}
        <div className="w-full md:w-1/2 p-8 md:p-20 md:overflow-y-auto custom-scrollbar flex flex-col">
           <div className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                 <div className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-1.5 rounded-xl text-xs font-black shadow-lg">
                    {(product.rating || 5.0).toFixed(1)} <FiStar size={14} className="fill-current" />
                 </div>
                 <div className="flex items-center gap-4 text-brand-text/30 font-bold text-xs uppercase tracking-widest">
                    <span>{product.reviews?.length || 0} Reviews</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-text/10"></span>
                    <span>{product.orderCount >= 1000 ? `${(product.orderCount / 1000).toFixed(1)}k+` : product.orderCount} Ordered</span>

                 </div>
              </div>
              
              <p className="text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] mb-3">Authentic Artisan Collection</p>
              <h1 className="text-5xl md:text-7xl font-playfair font-black text-brand-text mb-6 leading-[1.1]">{product.name}</h1>
              <p className="text-brand-text/50 leading-relaxed font-medium text-lg italic border-l-4 border-brand-primary/20 pl-6">
                "{product.description}"
              </p>
           </div>

           {/* Weight Selection - Scrollable on mobile if needed */}
           <div className="mb-12">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-text/20 mb-6">Explore Variants</p>
              <div className="flex flex-wrap gap-4">
                 {WEIGHTS.map(w => (
                   <button
                     key={w}
                     onClick={() => setSelectedWeight(w)}
                     className={`px-8 py-5 rounded-[2rem] font-black text-sm transition-all border-2 flex flex-col items-center gap-1 ${
                       selectedWeight === w 
                        ? "bg-brand-text text-white border-brand-text shadow-2xl scale-105" 
                        : "bg-white text-brand-text/40 border-brand-text/5 hover:border-brand-primary/20"
                     }`}
                   >
                      <span>{w}</span>
                      <span className={`text-[10px] opacity-60 ${selectedWeight === w ? "text-brand-secondary" : ""}`}>₹{product.prices[w]}</span>
                   </button>
                 ))}
              </div>
           </div>

           {/* Actions */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
              <button 
                onClick={() => addToCart(product, selectedWeight)}
                className="bg-[#faf9f6] text-brand-text py-6 rounded-[2.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-brand-text hover:text-white transition-all shadow-inner border border-brand-text/5 group"
              >
                 <FiShoppingCart className="group-hover:rotate-12 transition-transform" /> Add to Basket
              </button>
              <Link 
                to="/checkout"
                onClick={() => {
                   addToCart(product, selectedWeight);
                }}
                className="bg-brand-primary text-white py-6 rounded-[2.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-[#A50000] transition-all shadow-[0_20px_40px_rgba(165,42,42,0.3)] group"
              >
                 Instant Checkout <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
           </div>

           {/* Reviews Section */}
           <div className="border-t border-brand-text/5 pt-12">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-2xl font-playfair font-black text-brand-text flex items-center gap-4">
                    Guest Book <FiMessageSquare className="text-brand-primary" />
                 </h3>
                 <button 
                   onClick={() => setShowReviewForm(!showReviewForm)}
                   className="bg-brand-primary/10 text-brand-primary px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all"
                 >
                    {showReviewForm ? "Close Form" : "Write Review"}
                 </button>
              </div>

              <AnimatePresence>
                {showReviewForm && (
                  <motion.form 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleReviewSubmit}
                    className="bg-[#faf9f6] p-8 rounded-[2.5rem] mb-10 space-y-6 overflow-hidden border border-brand-text/5"
                  >
                     <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="flex-1 w-full">
                           <input 
                             required 
                             placeholder="Full Name" 
                             value={reviewForm.customerName}
                             onChange={e => setReviewForm(p => ({ ...p, customerName: e.target.value }))}
                             className="w-full bg-white px-6 py-4 rounded-2xl border border-brand-text/5 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 font-bold"
                           />
                        </div>
                        <div className="flex gap-2">
                           {[1, 2, 3, 4, 5].map(s => (
                             <button 
                               key={s} 
                               type="button"
                               onClick={() => setReviewForm(p => ({ ...p, rating: s }))}
                               className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${reviewForm.rating >= s ? "bg-amber-500 text-white shadow-lg" : "bg-white text-brand-text/10 border border-brand-text/5"}`}
                             >
                                <FiStar className={reviewForm.rating >= s ? "fill-current" : ""} />
                             </button>
                           ))}
                        </div>
                     </div>
                     <textarea 
                       required
                       placeholder="Share your experience with this artisan spice..."
                       rows={4}
                       value={reviewForm.comment}
                       onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                       className="w-full bg-white px-6 py-4 rounded-2xl border border-brand-text/5 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 font-medium resize-none"
                     />
                     <button type="submit" className="w-full bg-brand-text text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-brand-primary transition-all shadow-xl">
                        Publish Review
                     </button>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="space-y-8 pb-10">
                 {product.reviews?.length > 0 ? (
                   product.reviews.map((r, i) => (
                     <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="group"
                      >
                        <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-brand-text text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-xl">
                                 {r.customerName.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-black text-brand-text text-sm">{r.customerName}</p>
                                 <div className="flex text-amber-500 text-xs mt-0.5">
                                    {[...Array(5)].map((_, i) => <FiStar key={i} className={i < r.rating ? "fill-current" : "text-brand-text/10"} />)}
                                 </div>
                              </div>
                           </div>
                           <span className="text-[10px] font-black text-brand-text/20 uppercase tracking-[0.2em]">
                              {new Date(r.createdAt).toLocaleDateString()}
                           </span>
                        </div>
                        <p className="text-brand-text/50 text-base leading-relaxed ml-16 italic font-medium">
                          "{r.comment}"
                        </p>

                        {r.adminReply && (
                          <div className="mt-6 ml-16 bg-brand-text text-white p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                             <div className="flex items-center gap-3 mb-3">
                                <FiCornerDownRight className="text-brand-secondary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-secondary">Official Response from SOI</span>
                             </div>
                             <p className="relative z-10 text-sm font-medium italic opacity-90 leading-relaxed">
                                "{r.adminReply}"
                             </p>
                          </div>
                        )}
                     </motion.div>

                   ))
                 ) : (
                   <div className="py-16 text-center">
                      <FiMessageSquare size={48} className="mx-auto text-brand-text/5 mb-4" />
                      <p className="italic text-brand-text/30 font-medium tracking-wide">Be the first to leave a mark in our guest book.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}


export default function OrderNow() {
  const { products, cart, addToCart } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [detailProduct, setDetailProduct] = useState(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, activeCategory]);

  return (
    <section className="py-12 bg-[#faf9f6] relative overflow-hidden font-inter min-h-screen">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-brand-primary text-5xl md:text-7xl font-signature mb-4"
          >
            Artisan Collections
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 120 }}
            viewport={{ once: true }}
            className="h-1.5 bg-brand-primary rounded-full mb-6"
          ></motion.div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="relative flex-1 group">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-text/30 group-focus-within:text-brand-primary transition-colors text-xl" />
            <input 
              type="text"
              placeholder="Search for your favorite spice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-8 py-5 rounded-[2rem] bg-white border border-brand-text/5 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/20 outline-none transition-all shadow-sm font-medium"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-4 rounded-full font-bold text-sm whitespace-nowrap transition-all border ${
                  activeCategory === cat 
                    ? "bg-brand-text text-white border-brand-text shadow-lg" 
                    : "bg-white text-brand-text/50 border-brand-text/5 hover:border-brand-primary/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-10">
          {filteredProducts.map((product) => {
            const displayImage = getProductImage(product);
            return (
              <motion.div
                key={product.id}
                layout
                onClick={() => setDetailProduct(product)}
                className="group cursor-pointer bg-white rounded-[1.5rem] md:rounded-[3rem] overflow-hidden border border-brand-text/5 shadow-sm hover:shadow-2xl transition-all duration-700"
              >
                <div className="relative h-40 md:h-72 overflow-hidden bg-brand-bg/20">
                  <motion.img 
                    layoutId={`img-${product.id}`}
                    src={displayImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-3 left-3 md:top-6 md:left-6 flex flex-col gap-1 md:gap-2">
                     <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-lg text-[8px] md:text-xs font-bold shadow-lg">
                        {(product.rating || 5.0).toFixed(1)} <FiStar size={8} className="fill-current md:w-[10px]" />
                     </div>
                     <span className="bg-white/80 backdrop-blur-md text-brand-text text-[7px] md:text-[9px] font-black uppercase tracking-widest px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-brand-text/5">
                        {product.orderCount >= 1000 ? `${(product.orderCount / 1000).toFixed(1)}k+` : product.orderCount} Ordered
                     </span>

                  </div>
                </div>
                
                <div className="p-4 md:p-10">
                  <h3 className="text-sm md:text-2xl font-black text-brand-text mb-1 md:mb-3 group-hover:text-brand-primary transition-colors truncate">
                    {product.name}
                  </h3>
                  <p className="hidden md:block text-brand-text/40 text-sm mb-8 line-clamp-2 font-medium leading-relaxed italic">
                    "{product.description}"
                  </p>
                  
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-brand-primary mb-0.5 md:mb-1">Starting From</p>
                        <p className="text-base md:text-3xl font-black text-brand-text">₹{product.prices["50g"]}</p>
                     </div>
                     <button className="w-8 h-8 md:w-14 md:h-14 bg-brand-bg text-brand-text rounded-full flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all shadow-inner">
                        <FiArrowRight size={16} className="md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
                     </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Floating Go To Cart Button */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-3rem)] max-w-lg"
          >
            <Link 
              to="/cart"
              className="bg-brand-text text-white p-6 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-between group hover:bg-brand-primary transition-all duration-500"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-tr from-brand-secondary/20 to-transparent"></div>
                   <FiShoppingCart className="text-2xl text-brand-secondary relative z-10" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Basket Summary</p>
                   <p className="text-2xl font-black">{cart.reduce((a, b) => a + b.quantity, 0)} Items Added</p>
                </div>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white transition-all">
                 <FiArrowRight className="text-3xl group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <AnimatePresence>
         {detailProduct && (
           <ProductDetailModal 
             product={detailProduct} 
             onClose={() => setDetailProduct(null)} 
           />
         )}
      </AnimatePresence>
    </section>
  );
}
