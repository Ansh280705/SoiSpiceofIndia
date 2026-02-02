import React from "react";
import { motion } from "framer-motion";
import { FaLinkedinIn, FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa6";

const socials = [
  {
    Icon: FaFacebookF,
    label: "Facebook",
    href: "#",
  },
  {
    Icon: FaInstagram,
    label: "Instagram",
    href: "#",
  },
  {
    Icon: FaYoutube,
    label: "YouTube",
    href: "#",
  },
  {
    Icon: FaLinkedinIn,
    label: "LinkedIn",
    href: "#",
  },
];

const Footer = () => {
  return (
    <footer className="bg-brand-text text-white relative overflow-hidden">
      {/* Subtle background texture or overlay */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-bold mb-6 text-brand-secondary">
              SOI <span className="text-white">Spice of India</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              Bringing authentic flavors to your kitchen for over 10 years. Purity, taste, and tradition in every pinch.
            </p>
            <div className="flex gap-4">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-primary transition-colors duration-300"
                  aria-label={label}
                >
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 uppercase tracking-widest text-brand-primary">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="#recipes" className="hover:text-white transition-colors">Recipes</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-bold mb-6 uppercase tracking-widest text-brand-primary">Categories</h4>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Pure Spices</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blended Spices</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Exotic Herbs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Aromatic Seeds</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 uppercase tracking-widest text-brand-primary">Contact Us</h4>
            <ul className="space-y-4 text-gray-400 font-medium text-sm">
              <li className="flex gap-3 text-gray-400">
                <span className="text-brand-primary">📍</span>
                SOI Spice of India House, <br />Indore Pithampur 454775
              </li>
              <li className="flex gap-3 text-gray-400">
                <span className="text-brand-primary">📞</span>
                +91 7772880295
              </li>
              <li className="flex gap-3 text-gray-400">
                <span className="text-brand-primary">✉️</span>
                soiofficial@gmail.com
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 font-medium">
          <p>© {new Date().getFullYear()} SOI Spice of India. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white ">Privacy Policy</a>
            <a href="#" className="hover:text-white ">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
