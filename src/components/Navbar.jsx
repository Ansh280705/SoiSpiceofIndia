import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import OverlayMenu from "./OverlayMenu";
import LogoImg from "../assets/Logo.png";
import BrandLogo from "./BrandLogo";
import { FiMenu, FiLock, FiShoppingCart } from "react-icons/fi";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [forcevisible, setForcevisible] = useState(false);
  const location = useLocation();
  const { cart } = useApp();

  const lastscrollY = useRef(0);
  const timerid = useRef(null);

  useEffect(() => {
    const homeSection = document.querySelector("#home");
    if (!homeSection) {
       setForcevisible(false);
       return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setForcevisible(true);
          setVisible(true);
        } else {
          setForcevisible(false);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(homeSection);

    return () => {
      observer.unobserve(homeSection);
    };
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (forcevisible && location.pathname === "/") {
        setVisible(true);
        return;
      }

      const currentScrollY = window.scrollY;

      if (currentScrollY > lastscrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);

        if (timerid.current) {
          clearTimeout(timerid.current);
        }

        timerid.current = setTimeout(() => {
          setVisible(false);
        }, 3000);
      }

      lastscrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timerid.current) clearTimeout(timerid.current);
    };
  }, [forcevisible, location]);

  const navLinks = [
    { name: "About Us", href: "/#about", type: "hash" },
    { name: "Products", href: "/#products", type: "hash" },
    { name: "Order Now", href: "/order", type: "link" },
    { name: "Quality", href: "/#quality", type: "hash" },
    { name: "Contact", href: "/#contact", type: "hash" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-12 z-50 transition-all duration-500 ${
          forcevisible && location.pathname === "/"
            ? "py-6 bg-transparent"
            : "py-3 bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] border-b border-brand-bg"
        } ${visible ? "translate-y-0" : "-translate-y-full"}`}
      >
        {/* Logo Section */}
        <Link to="/" className="flex items-center group cursor-pointer">
          <BrandLogo className="w-12 h-12 md:w-16 md:h-16" />
          <div className="ml-2 flex flex-col">
            <div className="font-playfair font-black text-2xl md:text-3xl tracking-tight text-brand-primary group-hover:scale-105 transition-transform duration-300 leading-none">
              SOI
            </div>
            <div className="font-sans font-bold tracking-[0.2em] text-[8px] md:text-[10px] uppercase opacity-80 text-brand-secondary leading-none mt-1">
              Spice of India
            </div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            link.type === "link" ? (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm font-bold uppercase tracking-widest hover:text-brand-secondary transition-colors duration-300 text-brand-text"
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-bold uppercase tracking-widest hover:text-brand-secondary transition-colors duration-300 text-brand-text"
              >
                {link.name}
              </a>
            )
          ))}
          
          <Link
            to="/cart"
            className="relative p-2.5 rounded-full border border-brand-text/10 text-brand-text/60 hover:text-brand-primary hover:border-brand-primary/30 transition-all duration-300"
          >
            <FiShoppingCart className="text-xl" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </Link>

          <a
            href="/#contact"
            className="bg-brand-primary text-white px-7 py-2.5 rounded-full font-bold text-sm uppercase tracking-widest shadow-xl hover:bg-[#A50000] hover:-translate-y-0.5 transition-all duration-300"
          >
            Inquiry
          </a>
          
          <Link
            to="/admin"
            title="Admin Panel"
            className="p-2.5 rounded-full border border-brand-text/10 text-brand-text/30 hover:text-brand-primary hover:border-brand-primary/30 transition-all duration-300"
          >
            <FiLock className="text-sm" />
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="lg:hidden flex items-center gap-4">
          <Link
            to="/cart"
            className="relative p-2.5 rounded-full border border-brand-text/10 text-brand-text/60"
          >
            <FiShoppingCart className="text-xl" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMenuOpen(true)}
            className="text-3xl focus:outline-none hover:scale-110 transition-transform p-2 text-brand-text"
            aria-label="open Menu"
          >
            <FiMenu />
          </button>
        </div>
      </nav>

      <OverlayMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
