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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-6xl bg-white rounded-[3rem] shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh]"
      >
        <button onClick={onClose} className="absolute top-8 right-8 z-20 w-12 h-12 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center text-brand-text transition-all">
           <FiX size={24} />
        </button>

        {/* Left: Image Section */}
        <div className="md:w-1/2 bg-brand-bg/30 relative flex items-center justify-center p-12">
           <motion.img 
             layoutId={`img-${product.id}`}
             src={displayImage} 
             alt={product.name} 
             className="w-full h-full object-contain drop-shadow-2xl"
           />
           <div className="absolute bottom-10 left-10 flex gap-2">
              <span className="bg-white/80 backdrop-blur-md text-brand-text px-4 py-2 rounded-full text-xs font-bold shadow-sm border border-brand-text/5">
                 {product.category}
              </span>
           </div>
        </div>

        {/* Right: Details Section */}
        <div className="md:w-1/2 p-10 md:p-16 overflow-y-auto custom-scrollbar flex flex-col">
           <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                 <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    {(product.rating || 5.0).toFixed(1)} <FiStar size={14} className="fill-current" />
                 </div>
                 <span className="text-brand-text/40 font-medium text-sm">{product.reviews?.length || 0} Reviews</span>
                 <span className="w-1.5 h-1.5 rounded-full bg-brand-text/10"></span>
                 <span className="text-brand-text/40 font-medium text-sm">{product.orderCount || 0} Orders</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-playfair font-black text-brand-text mb-4 leading-tight">{product.name}</h1>
              <p className="text-brand-text/60 leading-relaxed font-medium text-lg">
                {product.description}
              </p>
           </div>

           {/* Weight Selection */}
           <div className="mb-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-text/30 mb-4">Select Weight Variant</p>
              <div className="flex flex-wrap gap-4">
                 {WEIGHTS.map(w => (
                   <button
                     key={w}
                     onClick={() => setSelectedWeight(w)}
                     className={`px-8 py-4 rounded-2xl font-bold transition-all border-2 ${
                       selectedWeight === w 
                        ? "bg-brand-text text-white border-brand-text shadow-xl scale-105" 
                        : "bg-white text-brand-text/50 border-brand-text/5 hover:border-brand-primary/20"
                     }`}
                   >
                      {w} — ₹{product.prices[w]}
                   </button>
                 ))}
              </div>
           </div>

           {/* Actions */}
           <div className="grid grid-cols-2 gap-6 mb-12">
              <button 
                onClick={() => addToCart(product, selectedWeight)}
                className="bg-brand-bg text-brand-text py-6 rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:bg-brand-text hover:text-white transition-all shadow-sm"
              >
                 <FiShoppingCart /> Add to Basket
              </button>
              <Link 
                to="/checkout"
                onClick={() => {
                   addToCart(product, selectedWeight);
                }}
                className="bg-brand-primary text-white py-6 rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#A50000] transition-all shadow-xl shadow-brand-primary/20"
              >
                 Buy Now <FiChevronRight />
              </Link>
           </div>

           {/* Reviews Section */}
           <div className="border-t border-brand-text/5 pt-10">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-brand-text flex items-center gap-3">
                    Customer Reviews <FiMessageSquare className="text-brand-primary" />
                 </h3>
                 <button 
                   onClick={() => setShowReviewForm(!showReviewForm)}
                   className="text-brand-primary font-bold text-sm hover:underline"
                 >
                    {showReviewForm ? "Cancel" : "Write a Review"}
                 </button>
              </div>

              {showReviewForm && (
                <motion.form 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  onSubmit={handleReviewSubmit}
                  className="bg-brand-bg/30 p-6 rounded-3xl mb-8 space-y-4"
                >
                   <div className="flex items-center gap-4">
                      <div className="flex-1">
                         <input 
                           required 
                           placeholder="Your Name" 
                           value={reviewForm.customerName}
                           onChange={e => setReviewForm(p => ({ ...p, customerName: e.target.value }))}
                           className="w-full bg-white px-4 py-3 rounded-xl border border-brand-text/5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                         />
                      </div>
                      <div className="flex gap-1">
                         {[1, 2, 3, 4, 5].map(s => (
                           <button 
                             key={s} 
                             type="button"
                             onClick={() => setReviewForm(p => ({ ...p, rating: s }))}
                             className={`p-1 transition-colors ${reviewForm.rating >= s ? "text-amber-500" : "text-brand-text/10"}`}
                           >
                              <FiStar className="fill-current" />
                           </button>
                         ))}
                      </div>
                   </div>
                   <textarea 
                     required
                     placeholder="Share your experience with this spice..."
                     rows={3}
                     value={reviewForm.comment}
                     onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                     className="w-full bg-white px-4 py-3 rounded-xl border border-brand-text/5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none"
                   />
                   <button type="submit" className="w-full bg-brand-text text-white py-4 rounded-xl font-bold hover:bg-brand-primary transition-all">
                      Post Review
                   </button>
                </motion.form>
              )}

              <div className="space-y-6">
                 {product.reviews?.length > 0 ? (
                   product.reviews.map((r, i) => (
                     <div key={i} className="group">
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-brand-text text-white rounded-full flex items-center justify-center font-bold text-xs">
                                 {r.customerName.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-bold text-brand-text text-sm">{r.customerName}</p>
                                 <div className="flex text-amber-500 text-[10px]">
                                    {[...Array(5)].map((_, i) => <FiStar key={i} className={i < r.rating ? "fill-current" : "text-brand-text/10"} />)}
                                 </div>
                              </div>
                           </div>
                           <span className="text-[10px] font-bold text-brand-text/30 uppercase tracking-widest">
                              {new Date(r.createdAt).toLocaleDateString()}
                           </span>
                        </div>
                        <p className="text-brand-text/60 text-sm leading-relaxed ml-13 italic">
                          "{r.comment}"
                        </p>
                     </div>
                   ))
                 ) : (
                   <div className="py-10 text-center opacity-30">
                      <p className="italic">No reviews yet. Be the first to share!</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((product) => {
            const displayImage = getProductImage(product);
            return (
              <motion.div
                key={product.id}
                layout
                onClick={() => setDetailProduct(product)}
                className="group cursor-pointer bg-white rounded-[3rem] overflow-hidden border border-brand-text/5 shadow-sm hover:shadow-2xl transition-all duration-700"
              >
                <div className="relative h-72 overflow-hidden bg-brand-bg/20">
                  <motion.img 
                    layoutId={`img-${product.id}`}
                    src={displayImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                     <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-lg">
                        {(product.rating || 5.0).toFixed(1)} <FiStar size={10} className="fill-current" />
                     </div>
                     <span className="bg-white/80 backdrop-blur-md text-brand-text text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-brand-text/5">
                        {product.orderCount || 0} Orders
                     </span>
                  </div>
                </div>
                
                <div className="p-10">
                  <h3 className="text-2xl font-black text-brand-text mb-3 group-hover:text-brand-primary transition-colors">{product.name}</h3>
                  <p className="text-brand-text/40 text-sm mb-8 line-clamp-2 font-medium leading-relaxed italic">
                    "{product.description}"
                  </p>
                  
                  <div className="flex justify-between items-end">
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary mb-1">Starting From</p>
                        <p className="text-3xl font-black text-brand-text">₹{product.prices["50g"]}</p>
                     </div>
                     <button className="w-14 h-14 bg-brand-bg text-brand-text rounded-full flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all shadow-inner">
                        <FiArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
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
