import { useEffect, useRef, useState } from "react";
import OverlayMenu from "./OverlayMenu";
import LogoImg from "../assets/Logo.png";
import BrandLogo from "./BrandLogo";
import { FiMenu } from "react-icons/fi";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [forcevisible, setForcevisible] = useState(false);

  const lastscrollY = useRef(0);
  const timerid = useRef(null);

  useEffect(() => {
    const homeSection = document.querySelector("#home");

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

    if (homeSection) observer.observe(homeSection);

    return () => {
      if (homeSection) observer.unobserve(homeSection);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (forcevisible) {
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
  }, [forcevisible]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-12 z-50 transition-all duration-500 ${
          !forcevisible
            ? "py-3 bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] border-b border-brand-bg"
            : "py-6 bg-transparent"
        } ${visible ? "translate-y-0" : "-translate-y-full"}`}
      >
        {/* Logo Section */}
        <div className="flex items-center group cursor-pointer">
          <BrandLogo className="w-12 h-12 md:w-16 md:h-16" />
          <div className="ml-2 flex flex-col">
            <div className="font-playfair font-black text-2xl md:text-3xl tracking-tight text-brand-primary group-hover:scale-105 transition-transform duration-300 leading-none">
              SOI
            </div>
            <div className="font-sans font-bold tracking-[0.2em] text-[8px] md:text-[10px] uppercase opacity-80 text-brand-secondary leading-none mt-1">
              Spice of India
            </div>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-8">
          {[
            { name: "About Us", href: "#about" },
            { name: "Products", href: "#products" },
            { name: "Recipes", href: "#recipes" },
            { name: "Quality", href: "#quality" },
            { name: "Contact", href: "#contact" },
          ].map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-bold uppercase tracking-widest hover:text-brand-secondary transition-colors duration-300"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-brand-primary text-white px-7 py-2.5 rounded-full font-bold text-sm uppercase tracking-widest shadow-xl hover:bg-[#A50000] hover:-translate-y-0.5 transition-all duration-300"
          >
            Inquiry
          </a>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="text-3xl focus:outline-none hover:scale-110 transition-transform p-2"
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
