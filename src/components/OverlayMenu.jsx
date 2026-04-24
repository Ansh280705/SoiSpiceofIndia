import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function OverlayMenu({ isOpen, onClose }) {
  const ismobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const origin = ismobile ? "95% 8%" : "50% 8%";

  const menuItems = [
    { name: "Home", href: "/", type: "link" },
    { name: "Products", href: "/#products", type: "hash" },
    { name: "Order Now", href: "/order", type: "link" },
    { name: "Quality", href: "/#quality", type: "hash" },
    { name: "About Us", href: "/#about", type: "hash" },
    { name: "Contact", href: "/#contact", type: "hash" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[100]"
          initial={{ clipPath: `circle(0% at ${origin})` }}
          animate={{ clipPath: `circle(150% at ${origin})` }}
          exit={{ clipPath: `circle(0% at ${origin})` }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ backgroundColor: "rgba(165, 42, 42, 0.98)" }} // Use brand-primary color for menu
        >
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-white text-4xl hover:rotate-90 transition-transform duration-300"
            aria-label="Close Menu"
          >
            <FiX />
          </button>
          
          <ul className="space-y-8 text-center">
            {menuItems.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              >
                {item.type === "link" ? (
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className="text-4xl md:text-6xl text-white font-black uppercase tracking-tighter hover:text-brand-secondary transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    onClick={onClose}
                    className="text-4xl md:text-6xl text-white font-black uppercase tracking-tighter hover:text-brand-secondary transition-colors duration-300"
                  >
                    {item.name}
                  </a>
                )}
              </motion.li>
            ))}
          </ul>

          <div className="absolute bottom-12 text-white/40 text-[10px] font-black uppercase tracking-[0.5em]">
             Authenticity in Every Grain
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
