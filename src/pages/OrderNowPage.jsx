import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import OrderNow from "../sections/OrderNow";
import Footer from "../sections/Footer";

export default function OrderNowPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      <Navbar />
      <div className="pt-20">
        <OrderNow />
      </div>
      <Footer />
    </div>
  );
}
