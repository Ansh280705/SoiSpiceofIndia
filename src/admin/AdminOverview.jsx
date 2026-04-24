import React from "react";
import { motion } from "framer-motion";
import { FiPackage, FiShoppingBag, FiTrendingUp, FiDollarSign, FiArrowRight, FiClock } from "react-icons/fi";
import { useApp } from "../context/AppContext";

const STATUS_COLORS = {
  Pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

function StatCard({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-[#161616] border border-white/5 rounded-2xl p-6 flex items-start gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="text-xl" />
      </div>
      <div>
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
        {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function AdminOverview({ setActive }) {
  const { products, orders } = useApp();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "Pending").length;
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-white font-playfair text-3xl font-bold mb-1">Welcome back, Admin 👋</h2>
        <p className="text-white/40 text-sm font-medium">Here's what's happening with SOI today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={FiPackage} label="Total Products" value={products.length} sub="In catalog" color="bg-brand-primary/20 text-brand-primary" delay={0} />
        <StatCard icon={FiShoppingBag} label="Total Orders" value={orders.length} sub="All time" color="bg-blue-500/20 text-blue-400" delay={0.05} />
        <StatCard icon={FiClock} label="Pending" value={pendingOrders} sub="Awaiting confirmation" color="bg-amber-500/20 text-amber-400" delay={0.1} />
        <StatCard icon={FiDollarSign} label="Revenue" value={`₹${totalRevenue.toLocaleString("en-IN")}`} sub="Total earned" color="bg-emerald-500/20 text-emerald-400" delay={0.15} />
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">Recent Orders</h3>
          <button onClick={() => setActive("orders")} className="text-brand-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View All <FiArrowRight />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-white/20">
            <FiShoppingBag className="mx-auto text-4xl mb-3" />
            <p className="font-medium">No orders yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div>
                  <p className="text-white font-semibold text-sm">{order.id}</p>
                  <p className="text-white/40 text-xs mt-0.5">{order.customerInfo?.name} · {new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white font-bold text-sm">₹{order.totalPrice}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[order.status] || STATUS_COLORS.Pending}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <button
          onClick={() => setActive("products")}
          className="bg-brand-primary/10 border border-brand-primary/20 rounded-2xl p-6 flex items-center gap-4 hover:bg-brand-primary/15 transition-all group text-left"
        >
          <div className="w-12 h-12 bg-brand-primary/20 rounded-xl flex items-center justify-center">
            <FiPackage className="text-brand-primary text-xl" />
          </div>
          <div>
            <p className="text-white font-bold">Manage Products</p>
            <p className="text-white/40 text-sm">Add, edit or delete spices</p>
          </div>
          <FiArrowRight className="ml-auto text-white/20 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={() => setActive("orders")}
          className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 flex items-center gap-4 hover:bg-blue-500/15 transition-all group text-left"
        >
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <FiShoppingBag className="text-blue-400 text-xl" />
          </div>
          <div>
            <p className="text-white font-bold">Manage Orders</p>
            <p className="text-white/40 text-sm">Update order statuses</p>
          </div>
          <FiArrowRight className="ml-auto text-white/20 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </button>
      </motion.div>
    </div>
  );
}
