import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";

const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_INQUIRY_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validateForm = () => {
    const required = ["name", "email", "type", "message"];
    const newErrors = {};
    required.forEach((f) => !formData[f].trim() && (newErrors[f] = "Required"));
    setErrors(newErrors);
    return !Object.keys(newErrors).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStatus("sending");
    try {
      await emailjs.send(
        SERVICE_ID, TEMPLATE_ID,
        { ...formData, from_name: formData.name, reply_to: formData.email },
        PUBLIC_KEY
      );
      setStatus("success");
      setFormData({ name: "", email: "", type: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-32 bg-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-bg/50 transform skew-x-12 translate-x-32 hidden lg:block"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Left Side: Brand Message & Info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-6 py-2 bg-brand-bg rounded-full border border-brand-accent/20 mb-8">
            <span className="text-brand-primary font-bold text-sm uppercase tracking-[0.3em]">Direct Connection</span>
          </div>
          <h3 className="text-5xl md:text-6xl font-bold mb-10 text-brand-text leading-tight">
            For Business <br />
            <span className="text-brand-primary italic">& Personal</span> Inquiries
          </h3>
          <p className="text-xl text-brand-text/70 mb-14 font-medium leading-relaxed max-w-xl">
            Whether you're looking for distribution opportunities or just want to share your favorite recipe with us, our team is ready to assist you.
          </p>
          
          <div className="space-y-10">
            <div className="flex items-center gap-8 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-brand-accent/10 text-brand-primary transition-transform group-hover:scale-110">
                <FiMapPin />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-text/50 uppercase tracking-widest mb-1">Our Headquarters</p>
                <p className="text-xl font-bold text-brand-text">SOI Spice of India House, Indore Pithampur 454775</p>
              </div>
            </div>
            <div className="flex items-center gap-8 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-brand-accent/10 text-brand-primary transition-transform group-hover:scale-110">
                <FiPhone />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-text/50 uppercase tracking-widest mb-1">Call Our Team</p>
                <p className="text-xl font-bold text-brand-text">+91 7772880295</p>
              </div>
            </div>
            <div className="flex items-center gap-8 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-brand-accent/10 text-brand-primary transition-transform group-hover:scale-110">
                <FiMail />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-text/50 uppercase tracking-widest mb-1">Email Support</p>
                <p className="text-xl font-bold text-brand-text">soiofficial@gmail.com</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Contact Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="bg-brand-bg/40 backdrop-blur-xl p-10 md:p-14 rounded-[3.5rem] shadow-[0_48px_100px_-20px_rgba(45,45,45,0.1)] border border-white/60"
        >
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative group">
                <label className="block text-xs font-bold uppercase tracking-widest text-brand-text/40 mb-3 ml-1">Full Name</label>
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full p-5 rounded-2xl bg-white border border-transparent shadow-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all placeholder:text-brand-text/20 font-medium"
                />
              </div>
              <div className="relative group">
                <label className="block text-xs font-bold uppercase tracking-widest text-brand-text/40 mb-3 ml-1">Email Address</label>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  placeholder="john@example.com"
                  className="w-full p-5 rounded-2xl bg-white border border-transparent shadow-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all placeholder:text-brand-text/20 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-text/40 mb-3 ml-1">Inquiry Type</label>
              <div className="relative">
                <select
                  name="type" value={formData.type} onChange={handleChange}
                  className="w-full p-5 rounded-2xl bg-white border border-transparent shadow-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all appearance-none font-medium text-brand-text/70"
                >
                  <option value="">Select an option</option>
                  <option value="distributor">Distributorship Inquiry</option>
                  <option value="feedback">Product Feedback</option>
                  <option value="career">Career Opportunities</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-brand-text/30">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-brand-text/40 mb-3 ml-1">Message</label>
              <textarea
                name="message" value={formData.message} onChange={handleChange} rows={5}
                placeholder="How can we help you today?"
                className="w-full p-5 rounded-2xl bg-white border border-transparent shadow-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-none placeholder:text-brand-text/20 font-medium"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#8B0000" }}
              whileTap={{ scale: 0.98 }}
              disabled={status === "sending"}
              type="submit"
              className="w-full py-6 bg-brand-primary text-white rounded-2xl font-black text-sm uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(165,42,42,0.3)] transition-all flex items-center justify-center gap-4"
            >
              {status === "sending" ? "Processing..." : (
                <>
                  Submit Inquiry <FiSend className="text-xl" />
                </>
              )}
            </motion.button>

            {status && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center font-bold flex items-center justify-center gap-2 ${status === "success" ? "text-green-600" : "text-red-600"}`}
              >
                {status === "success" ? "✨ Your inquiry has been sent!" : "System error. Please try again later."}
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
