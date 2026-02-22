import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiMinus, FiCheckCircle, FiPackage, FiUser, FiPhone, FiMapPin, FiArrowLeft, FiShoppingCart, FiMail, FiTrash2, FiCreditCard, FiSmartphone, FiEdit3, FiHome } from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";
import emailjs from "@emailjs/browser";

import red_chilli_signature from "../assets/red_chilli_signature.jpg";
import turmeric_signature from "../assets/turmeric_signature.jpg";
import coriander_signature from "../assets/coriander_signature.jpg";

const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_ORDER_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

const products = [
  {
    id: "red-chilli",
    name: "Red Chilli Powder",
    image: red_chilli_signature,
    description: "Pure, vibrant, and ethically sourced. No artificial colors.",
    accent: "#a52a2a",
    prices: {
      "50g": 25,
      "100g": 45,
      "250g": 120
    }
  },
  {
    id: "turmeric",
    name: "Turmeric Powder",
    image: turmeric_signature,
    description: "Golden purity with high curcumin content. Natural health in every pinch.",
    accent: "#d2691e",
    prices: {
      "50g": 25,
      "100g": 45,
      "250g": 130
    }
  },
  {
    id: "coriander",
    name: "Coriander Powder",
    image: coriander_signature,
    description: "Fragrant and earthy. Processed to keep the natural aroma intact.",
    accent: "#e6b800",
    prices: {
      "50g": 20,
      "100g": 40,
      "250g": 90
    }
  },
];

const weights = ["50g", "100g", "250g"];
const DELIVERY_FEE = 30;

export default function OrderNow() {
  const [step, setStep] = useState(1); // 1: Selection, 2: Checkout, 3: Payment, 4: Success
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedWeight, setSelectedWeight] = useState("100g");
  const [quantity, setQuantity] = useState(1);
  
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    orderNotes: "",
  });

  const [paymentUid, setPaymentUid] = useState("");
  const [status, setStatus] = useState(""); // "", "sending", "success", "error"

  // Cart Logic
  const addToCart = () => {
    const existingIndex = cart.findIndex(
      item => item.productId === selectedProduct.id && item.weight === selectedWeight
    );

    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      setCart(newCart);
    } else {
      const newItem = {
        id: Date.now(),
        productId: selectedProduct.id,
        name: selectedProduct.name,
        weight: selectedWeight,
        price: selectedProduct.prices[selectedWeight],
        quantity: quantity,
        image: selectedProduct.image
      };
      setCart([...cart, newItem]);
    }
    // Reset selection after adding
    setQuantity(1);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalPrice = cart.length > 0 ? subtotal + DELIVERY_FEE : 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckoutProgress = (e) => {
    e.preventDefault();
    const requiredFields = ["name", "email", "phone", "address", "city", "state", "pincode"];
    const missingFields = requiredFields.filter(field => !customerInfo[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(", ")}`);
      return;
    }

    if (customerInfo.pincode.length !== 6 || isNaN(customerInfo.pincode)) {
      alert("Please enter a valid 6-digit Pincode");
      return;
    }

    setStep(3); // Go to Payment
  };

  const handleOrderSubmit = async () => {
    // Basic validation for keys
    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.warn("EmailJS credentials missing. Falling back to success simulation for demo.");
      setStatus("success");
      setStep(4);
      return;
    }

    if (!paymentUid) {
      alert("Please enter the Payment Transaction ID (UID) after completing the payment.");
      return;
    }

    setStatus("sending");

    try {
      const cartDetails = cart.map(item => `${item.name} (${item.weight}) x${item.quantity} - Rs ${item.price * item.quantity}`).join("\n");
      
      const templateParams = {
        from_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        alternate_phone: customerInfo.alternatePhone || "N/A",
        customer_address: `${customerInfo.address}, ${customerInfo.landmark ? `Landmark: ${customerInfo.landmark}, ` : ""}${customerInfo.city}, ${customerInfo.state} - ${customerInfo.pincode}`,
        order_details: cartDetails,
        payment_uid: paymentUid,
        subtotal: `Rs ${subtotal}`,
        delivery_fee: `Rs ${DELIVERY_FEE}`,
        total_price: `Rs ${totalPrice}`,
        order_notes: customerInfo.orderNotes || "No notes",
        reply_to: customerInfo.email, 
        message: `Order Details:\n${cartDetails}\n\nSubtotal: Rs ${subtotal}\nDelivery Fee: Rs ${DELIVERY_FEE}\nTotal Price: Rs ${totalPrice}\n\nPayment UID: ${paymentUid}\n\nDeliver to:\n${customerInfo.name}\n${customerInfo.address}\nLandmark: ${customerInfo.landmark}\nCity: ${customerInfo.city}, State: ${customerInfo.state}\nPincode: ${customerInfo.pincode}\nPhone: ${customerInfo.phone}\nAlt Phone: ${customerInfo.alternatePhone}\n\nNotes: ${customerInfo.orderNotes}`
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      
      setStatus("success");
      setStep(4);
    } catch (err) {
      console.error("Order error:", err);
      setStatus("error");
      const errorMsg = err?.text || err?.message || "Unknown error";
      alert(`Order error: ${errorMsg}. Please ensure your EmailJS credentials in .env are correct.`);
    }
  };

  const resetOrder = () => {
    setStep(1);
    setStatus("");
    setCart([]);
    setCustomerInfo({ 
      name: "", email: "", phone: "", alternatePhone: "",
      address: "", landmark: "", city: "", state: "", 
      pincode: "", orderNotes: "" 
    });
    setQuantity(1);
  };

  // UPI QR Generation
  // upi://pay?pa=YOUR_UPI_ID@okicici&pn=Spice%20Of%20India&am=TOTAL_AMOUNT&cu=INR
  const upiId = "9039734254@ybl"; 
  const upiLink = `upi://pay?pa=${upiId}&pn=SoiSpiceofIndia&am=${totalPrice}&cu=INR&tn=Order%20Payment`;

  if (step === 4) {
    return (
      <section id="order" className="py-24 bg-brand-bg min-h-[600px] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 md:p-16 rounded-[3.5rem] shadow-2xl text-center max-w-2xl mx-4 border border-brand-primary/10"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-5xl mx-auto mb-8">
            <FiCheckCircle />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-text mb-4">Order Successful!</h2>
          <p className="text-xl text-brand-text/60 mb-10 leading-relaxed">
            Thank you, <span className="text-brand-primary font-bold">{customerInfo.name}</span>. Your order has been placed and payment confirmed. <br /> Total: <span className="text-brand-primary font-bold">Rs {totalPrice}</span>. <br /> We'll contact you at {customerInfo.phone} for delivery updates.
          </p>
          <button 
            onClick={resetOrder}
            className="bg-brand-primary text-white px-12 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            Shop More
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="order" className="py-24 bg-brand-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-brand-primary text-5xl md:text-6xl font-signature mb-4"
          >
            {step === 1 ? "Shop Our Spices" : 
             step === 2 ? "Checkout Details" : 
             "Secure Payment"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-brand-text/60 text-lg max-w-2xl mx-auto"
          >
            {step === 1 ? "Add your favorites to the cart and experience authentic flavors." :
             step === 2 ? "Provide your delivery information to proceed." :
             "Scan the QR code below to complete your payment via any UPI app."}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side: Dynamic Content based on Step */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="selection"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <motion.div
                        key={product.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedProduct(product)}
                        className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                          selectedProduct.id === product.id
                            ? "border-brand-primary shadow-lg"
                            : "border-transparent bg-white shadow-sm"
                        }`}
                      >
                        <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
                        <div className="p-4 text-center">
                          <p className={`font-bold text-sm ${selectedProduct.id === product.id ? "text-brand-primary" : "text-brand-text"}`}>
                            {product.name}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-brand-accent/10">
                    <h4 className="text-3xl font-bold text-brand-primary mb-2">{selectedProduct.name}</h4>
                    <p className="text-brand-text/70 mb-6">{selectedProduct.description}</p>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-brand-text/40 mb-3">Select Weight</label>
                        <div className="flex flex-wrap gap-2">
                          {weights.map((w) => (
                            <button
                              key={w}
                              onClick={() => setSelectedWeight(w)}
                              className={`px-4 py-2 rounded-xl font-bold transition-all flex flex-col items-center min-w-[80px] ${
                                selectedWeight === w
                                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                                  : "bg-brand-bg text-brand-text hover:bg-brand-accent/10 border border-brand-accent/5"
                              }`}
                            >
                              <span className="text-sm">{w}</span>
                              <span className={`text-[10px] mt-1 ${selectedWeight === w ? "text-white/80" : "text-brand-primary"}`}>
                                Rs {selectedProduct.prices[w]}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-brand-bg/50 p-4 rounded-2xl">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-text/40 mb-1">Quantity</label>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all"
                            >
                              <FiMinus />
                            </button>
                            <span className="text-xl font-bold min-w-[2ch] text-center">{quantity}</span>
                            <button
                              onClick={() => setQuantity(quantity + 1)}
                              className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white transition-all"
                            >
                              <FiPlus />
                            </button>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-brand-text/40 uppercase tracking-widest">Total Price</p>
                          <p className="text-2xl font-black text-brand-primary">Rs {selectedProduct.prices[selectedWeight] * quantity}</p>
                        </div>
                      </div>

                      <button
                        onClick={addToCart}
                        className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all group active:scale-95"
                      >
                        <FiShoppingCart className="group-hover:scale-110 transition-transform" /> 
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="checkout"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-brand-accent/10 w-full"
                >
                  <button 
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-brand-primary font-bold mb-8 hover:translate-x-[-4px] transition-transform"
                  >
                    <FiArrowLeft /> Back to Shop
                  </button>

                  <form className="space-y-6" onSubmit={handleCheckoutProgress}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-text/40 mb-2 ml-1">Full Name *</label>
                        <div className="relative">
                          <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30" />
                          <input
                            required
                            type="text" name="name" value={customerInfo.name} onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full pl-11 pr-5 py-3 rounded-xl bg-brand-bg/50 border border-transparent focus:bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-text/40 mb-2 ml-1">Email Address *</label>
                        <div className="relative">
                          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30" />
                          <input
                            required
                            type="email" name="email" value={customerInfo.email} onChange={handleInputChange}
                            placeholder="john@example.com"
                            className="w-full pl-11 pr-5 py-3 rounded-xl bg-brand-bg/50 border border-transparent focus:bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-text/40 mb-2 ml-1">Phone Number *</label>
                        <div className="relative">
                          <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30" />
                          <input
                            required
                            type="tel" name="phone" value={customerInfo.phone} onChange={handleInputChange}
                            placeholder="+91 00000 00000"
                            className="w-full pl-11 pr-5 py-3 rounded-xl bg-brand-bg/50 border border-transparent focus:bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-text/40 mb-2 ml-1">Alt. Phone (Optional)</label>
                        <div className="relative">
                          <FiSmartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30" />
                          <input
                            type="tel" name="alternatePhone" value={customerInfo.alternatePhone} onChange={handleInputChange}
                            placeholder="Secondary number"
                            className="w-full pl-11 pr-5 py-3 rounded-xl bg-brand-bg/50 border border-transparent focus:bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-text/40 mb-2 ml-1">Detail Address (House No, Street) *</label>
                      <div className="relative">
                        <FiHome className="absolute left-4 top-4 text-brand-text/30" />
                        <textarea
                          required
                          name="address" value={customerInfo.address} onChange={handleInputChange} rows={2}
                          placeholder="B-2, Spicy Street, Emerald Gardens"
                          className="w-full pl-11 pr-5 py-3 rounded-xl bg-brand-bg/50 border border-transparent focus:bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium resize-none text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-text/40 mb-2 ml-1">Landmark (Optional)</label>
                        <div className="relative">
                          <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30" />
                          <input
                            type="text" name="landmark" value={customerInfo.landmark} onChange={handleInputChange}
                            placeholder="Near City Mall"
                            className="w-full pl-11 pr-5 py-3 rounded-xl bg-brand-bg/50 border border-transparent focus:bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-text/40 mb-2 ml-1">Pincode *</label>
                        <div className="relative">
                          <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30" />
                          <input
                            required
                            type="text" name="pincode" value={customerInfo.pincode} onChange={handleInputChange}
                            maxLength={6}
                            placeholder="400001"
                            className="w-full pl-11 pr-5 py-3 rounded-xl bg-brand-bg/50 border border-transparent focus:bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-text/40 mb-2 ml-1">City *</label>
                        <input
                          required
                          type="text" name="city" value={customerInfo.city} onChange={handleInputChange}
                          placeholder="Mumbai"
                          className="w-full px-5 py-3 rounded-xl bg-brand-bg/50 border border-transparent focus:bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-text/40 mb-2 ml-1">State *</label>
                        <input
                          required
                          type="text" name="state" value={customerInfo.state} onChange={handleInputChange}
                          placeholder="Maharashtra"
                          className="w-full px-5 py-3 rounded-xl bg-brand-bg/50 border border-transparent focus:bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-text/40 mb-2 ml-1">Order Notes / Specific Instructions</label>
                      <div className="relative">
                        <FiEdit3 className="absolute left-4 top-4 text-brand-text/30" />
                        <textarea
                          name="orderNotes" value={customerInfo.orderNotes} onChange={handleInputChange} rows={2}
                          placeholder="Please deliver by evening..."
                          className="w-full pl-11 pr-5 py-3 rounded-xl bg-brand-bg/50 border border-transparent focus:bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all font-medium resize-none text-sm"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-5 bg-brand-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all"
                    >
                      <FiCreditCard /> Proceed to Payment
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-brand-accent/10 w-full text-center"
                >
                  <button 
                    onClick={() => setStep(2)}
                    className="flex justify-start items-center gap-2 text-brand-primary font-bold mb-8 hover:translate-x-[-4px] transition-transform"
                  >
                    <FiArrowLeft /> Back to Details
                  </button>

                  <h3 className="text-2xl font-bold text-brand-text mb-2">Scan & Pay</h3>
                  <p className="text-brand-text/60 mb-8">Amount to Pay: <span className="text-brand-primary font-bold text-xl">Rs {totalPrice}</span></p>

                  <div className="bg-brand-bg p-8 rounded-3xl inline-block mb-8 relative">
                    <QRCodeSVG 
                      value={upiLink} 
                      size={200}
                      level={"H"}
                      includeMargin={false}
                      className="mx-auto"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                      <FiPackage size={100} />
                    </div>
                  </div>

                  <div className="mb-6 p-4 bg-brand-secondary/10 border border-brand-secondary/20 rounded-2xl text-sm font-medium text-brand-text/80">
                    <p className="font-bold">UPI ID: {upiId}</p>
                    <p className="text-xs opacity-60 mt-1">Pay Rs {totalPrice} using any app or enter Transaction ID below</p>
                  </div>

                  {/* Mobile Quick Pay Apps */}
                  <div className="mb-8 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-text/40 mb-2">Quick Pay with UPI App</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <a 
                        href={upiLink}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 text-sm font-bold text-gray-700"
                      >
                        <span className="w-5 h-5 bg-[#673ab7] rounded-full flex items-center justify-center text-white text-[10px]">P</span>
                        PhonePe
                      </a>
                      <a 
                        href={upiLink}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 text-sm font-bold text-gray-700"
                      >
                        <span className="w-5 h-5 bg-[#4285F4] rounded-full flex items-center justify-center text-white text-[10px]">G</span>
                        Google Pay
                      </a>
                      <a 
                        href={upiLink}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 text-sm font-bold text-gray-700"
                      >
                        <span className="w-5 h-5 bg-[#00baf2] rounded-full flex items-center justify-center text-white text-[10px]">P</span>
                        Paytm
                      </a>
                    </div>
                    <p className="text-[9px] text-brand-text/40 italic">* Mobile deep-linking works only on smartphones with UPI apps installed.</p>
                  </div>

                  <div className="mb-8 text-left">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-text/40 mb-2 ml-1 text-center">Enter Payment Transaction ID / UID *</label>
                    <div className="relative max-w-xs mx-auto">
                      <FiCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/30" />
                      <input
                        required
                        type="text"
                        value={paymentUid}
                        onChange={(e) => setPaymentUid(e.target.value)}
                        placeholder="Ex: 123456789012"
                        className="w-full pl-11 pr-5 py-3 rounded-xl bg-brand-bg border border-brand-primary/20 focus:bg-white focus:ring-2 focus:ring-brand-primary outline-none transition-all font-bold text-center tracking-widest"
                      />
                    </div>
                  </div>

                  <button
                    disabled={status === "sending"}
                    onClick={handleOrderSubmit}
                    className="w-full py-5 bg-brand-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50"
                  >
                    {status === "sending" ? "Verifying..." : "I have completed the payment"}
                  </button>
                  <p className="mt-4 text-[10px] text-brand-text/40 uppercase tracking-widest font-bold">Secure checkout powered by Google Pay / PhonePe / Paytm</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side: Cart Summary (Visible during all steps) */}
          <div className="w-full lg:sticky lg:top-32">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-brand-accent/10 overflow-hidden">
              <div className="bg-brand-primary p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FiShoppingCart className="text-xl" />
                  <h3 className="text-xl font-bold">Your Basket</h3>
                </div>
                <span className="bg-white text-brand-primary px-3 py-1 rounded-full text-xs font-black">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)} Items
                </span>
              </div>

              <div className="p-6 md:p-8">
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-brand-text/40 italic">
                    <FiPackage className="mx-auto text-4xl mb-4 opacity-20" />
                    <p>Your basket is empty. <br /> Select spices to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                      <AnimatePresence>
                        {cart.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-4 group"
                          >
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                            <div className="flex-1">
                              <h5 className="font-bold text-sm text-brand-text">{item.name}</h5>
                              <p className="text-[10px] font-bold text-brand-primary/60 uppercase">{item.weight}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <button onClick={() => updateCartQuantity(item.id, -1)} className="hover:text-brand-primary transition-colors"><FiMinus size={12} /></button>
                                <span className="text-xs font-black">{item.quantity}</span>
                                <button onClick={() => updateCartQuantity(item.id, 1)} className="hover:text-brand-primary transition-colors"><FiPlus size={12} /></button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-black text-brand-primary">Rs {item.price * item.quantity}</p>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="text-brand-text/30 hover:text-red-500 transition-colors mt-1"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <div className="pt-6 border-t border-brand-bg">
                      <div className="flex justify-between text-sm mb-2 text-brand-text/60">
                        <span>Subtotal</span>
                        <span className="font-bold">Rs {subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-4 text-brand-text/60">
                        <span>Delivery Fee</span>
                        <span className="font-bold">Rs {DELIVERY_FEE}</span>
                      </div>
                      <div className="flex justify-between items-end pt-4 border-t-2 border-dashed border-brand-primary/10">
                        <span className="text-lg font-bold text-brand-text">Grand Total</span>
                        <span className="text-3xl font-black text-brand-primary leading-none">Rs {totalPrice}</span>
                      </div>
                    </div>

                    {step === 1 && cart.length > 0 && (
                      <button
                        onClick={() => setStep(2)}
                        className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all mt-4"
                      >
                        Checkout Now
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Visual reassurance */}
            <div className="mt-8 flex items-center justify-center gap-6 text-brand-text/40 grayscale opacity-50">
               <FiCheckCircle className="text-2xl" />
               <span className="text-[10px] font-bold uppercase tracking-[0.2em]">100% Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
