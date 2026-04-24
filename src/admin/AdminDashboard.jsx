import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiPackage, FiShoppingBag, FiUsers, FiSettings, FiLogOut, FiBarChart2, 
  FiArrowLeft, FiGrid, FiBell, FiMessageSquare 
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminReviews from "./AdminReviews";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const navigate = useNavigate();

  const menuItems = [
    { id: "products", name: "Products", icon: FiPackage },
    { id: "orders", name: "Orders", icon: FiShoppingBag },
    { id: "reviews", name: "Reviews", icon: FiMessageSquare },
    { id: "settings", name: "Settings", icon: FiSettings },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("soi_admin_auth");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col md:flex-row font-inter">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[#0f0f0f] border-r border-white/5 p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-12">
           <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(165,42,42,0.3)]">
              <FiGrid className="text-white text-xl" />
           </div>
           <h1 className="font-playfair text-xl font-bold tracking-tight">SOI Admin</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === item.id 
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="pt-8 mt-auto border-t border-white/5">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all"
           >
              <FiLogOut size={20} /> Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 bg-[#0f0f0f]/50 backdrop-blur-md border-b border-white/5 px-10 flex items-center justify-between sticky top-0 z-30">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/")}
                className="p-2 rounded-lg bg-white/5 text-white/30 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-bold"
              >
                 <FiArrowLeft /> Public Site
              </button>
              <div className="w-px h-4 bg-white/10" />
              <p className="text-white/20 text-xs font-black uppercase tracking-widest">
                 {activeTab} Management
              </p>
           </div>
           
           <div className="flex items-center gap-6">
              <button className="text-white/30 hover:text-white relative p-1 transition-colors">
                 <FiBell size={20} />
                 <span className="absolute top-0 right-0 w-2 h-2 bg-brand-primary rounded-full border-2 border-[#0f0f0f]"></span>
              </button>
              <div className="flex items-center gap-3 bg-white/5 pl-2 pr-4 py-1.5 rounded-full border border-white/10">
                 <div className="w-8 h-8 bg-brand-secondary/20 rounded-full flex items-center justify-center text-brand-secondary font-black text-xs">A</div>
                 <span className="text-xs font-bold text-white/60">Admin</span>
              </div>
           </div>
        </header>

        {/* Content Area */}
        <div className="p-10">
          <AnimatePresence mode="wait">
             {activeTab === "products" && (
               <motion.div key="products" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <AdminProducts />
               </motion.div>
             )}
             {activeTab === "orders" && (
               <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <AdminOrders />
               </motion.div>
             )}
             {activeTab === "reviews" && (
               <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <AdminReviews />
               </motion.div>
             )}
             {activeTab === "settings" && (
               <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="py-20 text-center opacity-30">
                  <FiSettings size={48} className="mx-auto mb-4" />
                  <p className="italic">System settings coming soon</p>
               </motion.div>
             )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
