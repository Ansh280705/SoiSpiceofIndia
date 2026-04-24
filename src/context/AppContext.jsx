import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

// Fallback Assets (Shared between components)
import chilliImg from "../assets/red_chilli_signature.jpg";
import turmericImg from "../assets/turmeric_signature.jpg";
import corianderImg from "../assets/coriander_signature.jpg";

const ASSET_MAP = {
  red_chilli_signature: chilliImg,
  turmeric_signature: turmericImg,
  coriander_signature: corianderImg,
};

const getProductImage = (product) => {
  if (product.image) return product.image;
  if (product.imageKey && ASSET_MAP[product.imageKey]) return ASSET_MAP[product.imageKey];
  return "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800";
};

const API_URL = import.meta.env.VITE_API_URL || "/api";


const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Cart (persisted) ──────────────────────────────────────────────────────
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("soi_cart");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("soi_cart", JSON.stringify(cart));
  }, [cart]);

  // ── Fetch Initial Data ───────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes, reviewsRes] = await Promise.allSettled([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/orders`),
        axios.get(`${API_URL}/reviews`)
      ]);
      
      if (productsRes.status === 'fulfilled') setProducts(productsRes.value.data);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data);
      if (reviewsRes.status === 'fulfilled') setReviews(reviewsRes.value.data);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Toast Notifications ───────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Product CRUD ──────────────────────────────────────────────────────────
  const addProduct = useCallback(async (productData) => {
    try {
      const res = await axios.post(`${API_URL}/products`, productData);
      setProducts(prev => [res.data, ...prev]);
      addToast(`"${productData.name}" added successfully!`, "success");
      return res.data;
    } catch (error) {
      addToast("Failed to add product", "error");
    }
  }, [addToast]);

  const updateProduct = useCallback(async (id, updates) => {
    try {
      const res = await axios.put(`${API_URL}/products/${id}`, updates);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...res.data } : p));
      addToast("Product updated successfully!", "success");
    } catch (error) {
      addToast("Failed to update product", "error");
    }
  }, [addToast]);

  const deleteProduct = useCallback(async (id) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      addToast("Product deleted.", "info");
    } catch (error) {
      addToast("Failed to delete product", "error");
    }
  }, [addToast]);

  // ── Review Management ──────────────────────────────────────────────────────
  const addReview = useCallback(async (productId, reviewData) => {
    try {
      const res = await axios.post(`${API_URL}/products/${productId}/reviews`, reviewData);
      setReviews(prev => [res.data, ...prev]);
      const prodRes = await axios.get(`${API_URL}/products`);
      setProducts(prodRes.data);
      addToast("Review submitted! Thank you.", "success");
      return res.data;
    } catch (error) {
      addToast("Failed to submit review", "error");
    }
  }, [addToast]);

  const replyToReview = useCallback(async (reviewId, adminReply) => {
    try {
      const res = await axios.patch(`${API_URL}/reviews/${reviewId}/reply`, { adminReply });
      setReviews(prev => prev.map(r => r.id === reviewId ? res.data : r));
      const prodRes = await axios.get(`${API_URL}/products`);
      setProducts(prodRes.data);
      addToast("Reply saved successfully!", "success");
      return res.data;
    } catch (error) {
      addToast("Failed to save reply", "error");
    }
  }, [addToast]);

  const deleteReview = useCallback(async (id) => {

    try {
      await axios.delete(`${API_URL}/reviews/${id}`);
      setReviews(prev => prev.filter(r => r.id !== id));
      const prodRes = await axios.get(`${API_URL}/products`);
      setProducts(prodRes.data);
      addToast("Review removed.", "info");
    } catch (error) {
      addToast("Failed to remove review", "error");
    }
  }, [addToast]);

  // ── Order Management ──────────────────────────────────────────────────────
  const addOrder = useCallback(async (orderData) => {
    try {
      const res = await axios.post(`${API_URL}/orders`, orderData);
      setOrders(prev => [res.data, ...prev]);
      const prodRes = await axios.get(`${API_URL}/products`);
      setProducts(prodRes.data);
      return res.data;
    } catch (error) {
      addToast("Failed to place order", "error");
    }
  }, [addToast]);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    try {
      const res = await axios.patch(`${API_URL}/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o.id === orderId ? res.data : o));
      addToast(`Order status updated to "${status}"`, "success");
    } catch (error) {
      addToast("Failed to update status", "error");
    }
  }, [addToast]);

  // ── Cart Actions ──────────────────────────────────────────────────────────
  const addToCart = useCallback((product, weight) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.productId === (product.id || product.productId) && item.weight === weight
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += 1;
        return newCart;
      } else {
        const newItem = {
          id: Date.now(),
          productId: product.id,
          name: product.name,
          weight: weight,
          price: product.prices[weight],
          quantity: 1,
          image: getProductImage(product) // Use robust image logic
        };
        return [...prev, newItem];
      }
    });
    addToast(`${product.name} (${weight}) added to cart!`, "success");
  }, [addToast]);

  const removeFromCart = useCallback((id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateCartQuantity = useCallback((id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return (
    <AppContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      orders, addOrder, updateOrderStatus,
      reviews, addReview, deleteReview, replyToReview,

      cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      toasts, addToast, removeToast,
      loading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
