import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingBag, FiSearch, FiChevronDown, FiEye, FiX } from "react-icons/fi";
import { useApp } from "../context/AppContext";

const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered"];

const STATUS_STYLES = {
  Pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

function OrderDetailModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-3xl shadow-2xl z-10 max-h-[85vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-xl">{order.id}</h3>
            <p className="text-white/40 text-xs mt-0.5">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          {/* Status */}
          <div>
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-2">Status</p>
            <span className={`px-3 py-1.5 rounded-full text-sm font-bold border ${STATUS_STYLES[order.status]}`}>{order.status}</span>
          </div>

          {/* Customer */}
          <div>
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-3">Customer Details</p>
            <div className="bg-white/5 rounded-2xl p-4 space-y-2">
              <p className="text-white font-semibold">{order.customerInfo?.name}</p>
              <p className="text-white/50 text-sm">{order.customerInfo?.email}</p>
              <p className="text-white/50 text-sm">{order.customerInfo?.phone}</p>
              <p className="text-white/50 text-sm">{order.customerInfo?.address}, {order.customerInfo?.city}, {order.customerInfo?.state} - {order.customerInfo?.pincode}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-3">Order Items</p>
            <div className="space-y-3">
              {(order.cart || []).map((item, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10">
                        <FiShoppingBag size={20} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{item.name}</p>
                    <p className="text-white/40 text-xs">{item.weight} × {item.quantity}</p>
                  </div>
                  <p className="text-white font-bold text-sm">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-2xl p-4 flex justify-between items-center">
            <span className="text-white font-bold">Grand Total</span>
            <span className="text-brand-primary font-black text-xl">₹{order.totalPrice}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminOrders() {
  const { orders, updateOrderStatus, addToast } = useApp();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewOrder, setViewOrder] = useState(null);

  const handleStatusChange = (id, newStatus) => {
    updateOrderStatus(id, newStatus);
    addToast(`Order ${id} updated to ${newStatus}`, "info");
  };

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.customerInfo?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-white font-bold text-2xl">Orders</h2>
        <p className="text-white/30 text-sm">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or customer name..."
            className="w-full pl-11 pr-5 py-3.5 bg-[#161616] border border-white/5 rounded-2xl text-white placeholder:text-white/20 font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="appearance-none pl-4 pr-10 py-3.5 bg-[#161616] border border-white/5 rounded-2xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/30 transition-all"
          >
            <option value="All" className="bg-[#1a1a1a]">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s} className="bg-[#1a1a1a]">{s}</option>)}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>
      </div>

      {/* Status Tabs (mobile friendly) */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["All", ...STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterStatus === s
                ? "bg-brand-primary text-white"
                : "bg-[#161616] text-white/40 hover:text-white border border-white/5"
            }`}
          >
            {s} {s === "All" ? `(${orders.length})` : `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-white/30 font-bold uppercase tracking-widest text-xs px-6 py-4">Order ID</th>
                <th className="text-left text-white/30 font-bold uppercase tracking-widest text-xs px-4 py-4 hidden sm:table-cell">Customer</th>
                <th className="text-left text-white/30 font-bold uppercase tracking-widest text-xs px-4 py-4 hidden lg:table-cell">Date</th>
                <th className="text-left text-white/30 font-bold uppercase tracking-widest text-xs px-4 py-4">Total</th>
                <th className="text-left text-white/30 font-bold uppercase tracking-widest text-xs px-4 py-4">Status</th>
                <th className="text-right text-white/30 font-bold uppercase tracking-widest text-xs px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-white/20">
                    <FiShoppingBag className="mx-auto text-4xl mb-3" />
                    <p className="font-medium">{search || filterStatus !== "All" ? "No orders match your filters" : "No orders yet"}</p>
                  </td>
                </tr>
              ) : (
                filtered.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-white font-mono text-xs font-semibold">{order.id}</p>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <p className="text-white font-medium">{order.customerInfo?.name}</p>
                      <p className="text-white/30 text-xs">{order.customerInfo?.phone}</p>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <p className="text-white/50 text-xs">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-white font-bold">₹{order.totalPrice}</p>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={order.status}
                        onChange={e => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border appearance-none focus:outline-none cursor-pointer ${STATUS_STYLES[order.status]} bg-transparent`}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s} className="bg-[#1a1a1a] text-white">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setViewOrder(order)}
                          className="p-2.5 rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-all"
                          title="View Details"
                        >
                          <FiEye />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {viewOrder && <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />}
      </AnimatePresence>
    </div>
  );
}
