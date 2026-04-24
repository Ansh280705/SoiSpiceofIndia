import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheckCircle, FiInfo, FiAlertTriangle, FiX } from "react-icons/fi";
import { useApp } from "../context/AppContext";

const icons = {
  success: <FiCheckCircle className="text-emerald-400 text-xl flex-shrink-0" />,
  error: <FiAlertTriangle className="text-red-400 text-xl flex-shrink-0" />,
  info: <FiInfo className="text-blue-400 text-xl flex-shrink-0" />,
};

const bars = {
  success: "bg-emerald-400",
  error: "bg-red-400",
  info: "bg-blue-400",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="pointer-events-auto relative bg-[#1a1a1a] text-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden min-w-[280px] max-w-[340px]"
          >
            {/* Progress bar */}
            <motion.div
              className={`absolute top-0 left-0 h-[3px] ${bars[toast.type] || bars.success}`}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 3.5, ease: "linear" }}
            />
            <div className="flex items-start gap-3 p-4">
              {icons[toast.type] || icons.success}
              <p className="flex-1 text-sm font-medium leading-snug pt-0.5">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-white/40 hover:text-white transition-colors ml-1 flex-shrink-0"
              >
                <FiX />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
