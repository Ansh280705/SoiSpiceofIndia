import Navbar from "./components/Navbar";
import Home from "./sections/Home";
import OriginStory from "./sections/OriginStory";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import CustomCursor from "./components/CustomCursor";
import React from "react";

export default function App() {
  return (
    <div className="relative bg-brand-bg text-brand-text min-h-screen selection:bg-brand-primary selection:text-white">
      <CustomCursor />
      <Navbar />
      <Home />
      <OriginStory />
      <Projects />
      <Testimonials />
      <Experience />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
