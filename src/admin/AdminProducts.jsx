import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiSearch, FiPackage, FiImage, FiUpload
} from "react-icons/fi";
import { useApp } from "../context/AppContext";

const CATEGORIES = ["Pure Spices", "Blended Spices", "Exotic Herbs", "Aromatic Seeds"];
const WEIGHTS = ["50g", "100g", "250g"];
const EMPTY_FORM = { name: "", description: "", category: "Pure Spices", image: "", prices: { "50g": "", "100g": "", "250g": "" } };

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(
    product
      ? { name: product.name, description: product.description, category: product.category || "Pure Spices", image: product.image || "", prices: { ...product.prices } }
      : { ...EMPTY_FORM, prices: { "50g": "", "100g": "", "250g": "" } }
  );
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.description.trim()) e.description = "Required";
    WEIGHTS.forEach(w => {
      if (!form.prices[w] || isNaN(Number(form.prices[w])) || Number(form.prices[w]) <= 0)
        e[`price_${w}`] = "Required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size too large. Please select an image under 2MB.");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, image: reader.result }));
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      ...form,
      prices: { "50g": Number(form.prices["50g"]), "100g": Number(form.prices["100g"]), "250g": Number(form.prices["250g"]) }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-bold text-xl">{product ? "Edit Product" : "Add New Product"}</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <FiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Image Upload Preview */}
          <div className="relative h-48 bg-white/5 rounded-2xl overflow-hidden group border border-dashed border-white/10 hover:border-brand-primary/30 transition-all">
             {form.image ? (
               <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                  <FiImage size={40} className="mb-2" />
                  <p className="text-xs font-bold uppercase tracking-widest">No Image Selected</p>
               </div>
             )}
             
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all"
             >
                <div className="bg-white text-black px-6 py-2 rounded-full font-bold text-xs flex items-center gap-2">
                   <FiUpload /> {uploading ? "Uploading..." : "Upload Photo"}
                </div>
             </div>
             <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Product Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Garam Masala"
                  className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-white/20 font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all ${errors.name ? "border-red-500/50" : "border-white/10"}`}
                />
             </div>
             <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                >
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#1a1a1a]">{c}</option>)}
                </select>
             </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Description *</label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3}
              placeholder="Describe the spice..."
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-white/20 font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all resize-none ${errors.description ? "border-red-500/50" : "border-white/10"}`}
            />
          </div>

          {/* Prices */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Price per Weight (₹) *</label>
            <div className="grid grid-cols-3 gap-3">
              {WEIGHTS.map(w => (
                <div key={w}>
                  <label className="block text-xs text-white/30 font-medium mb-1 text-center">{w}</label>
                  <input
                    type="number"
                    min="1"
                    value={form.prices[w]}
                    onChange={e => setForm(p => ({ ...p, prices: { ...p.prices, [w]: e.target.value } }))}
                    placeholder="₹0"
                    className={`w-full px-3 py-2.5 bg-white/5 border rounded-xl text-white placeholder:text-white/20 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-center ${errors[`price_${w}`] ? "border-red-500/50" : "border-white/10"}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-4 border border-white/10 text-white/50 rounded-xl font-semibold hover:text-white transition-all">
              Cancel
            </button>
            <button type="submit" disabled={uploading} className="flex-1 py-4 bg-brand-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-all">
              <FiCheck /> {product ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function DeleteConfirmModal({ product, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-3xl p-8 text-center z-10 shadow-2xl"
      >
        <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiTrash2 size={28} />
        </div>
        <h3 className="text-white font-bold text-xl mb-2">Delete Product?</h3>
        <p className="text-white/40 text-sm mb-8">Are you sure you want to remove <span className="text-white font-bold">{product.name}</span>? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 border border-white/10 text-white/50 rounded-xl font-semibold hover:text-white transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all">
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [search, setSearch] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct_, setDeleteProduct_] = useState(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-white font-bold text-2xl">Products</h2>
          <p className="text-white/30 text-sm">{products.length} spices in database</p>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-brand-primary/90 transition-all"
        >
          <FiPlus /> Add New Spice
        </button>
      </div>

      {/* Filters */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search spices by name or category..."
          className="w-full pl-11 pr-5 py-4 bg-[#161616] border border-white/5 rounded-2xl text-white placeholder:text-white/20 font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group bg-[#161616] border border-white/5 rounded-3xl overflow-hidden hover:border-brand-primary/30 transition-all duration-500 shadow-xl"
          >
            <div className="relative h-48 overflow-hidden bg-white/5">
              {p.image ? (
                <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/10">
                   <FiPackage size={48} />
                </div>
              )}
              <div className="absolute top-4 left-4">
                 <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10">
                    {p.category}
                 </span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-white font-bold text-lg mb-1 truncate">{p.name}</h3>
              <p className="text-white/30 text-xs line-clamp-2 mb-4 h-8">{p.description}</p>
              
              <div className="flex justify-between items-end">
                 <div>
                    <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest mb-1">Price Range</p>
                    <p className="text-white font-black text-lg">₹{p.prices["50g"]} <span className="text-white/20 text-xs font-medium"> - </span> ₹{p.prices["250g"]}</p>
                 </div>
                 <div className="flex gap-2">
                    <button
                      onClick={() => setEditProduct(p)}
                      className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteProduct_(p)}
                      className="p-2.5 rounded-xl bg-white/5 text-red-400/40 hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                      <FiTrash2 size={16} />
                    </button>
                 </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {addModal && (
          <ProductModal
            onClose={() => setAddModal(false)}
            onSave={(form) => {
              addProduct(form);
              setAddModal(false);
            }}
          />
        )}
        {editProduct && (
          <ProductModal
            product={editProduct}
            onClose={() => setEditProduct(null)}
            onSave={(form) => {
              updateProduct(editProduct.id, form);
              setEditProduct(null);
            }}
          />
        )}
        {deleteProduct_ && (
          <DeleteConfirmModal
            product={deleteProduct_}
            onClose={() => setDeleteProduct_(null)}
            onConfirm={() => {
              deleteProduct(deleteProduct_.id);
              setDeleteProduct_(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
