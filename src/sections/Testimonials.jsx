import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";

const recipes = [
  {
    title: "Heat & Heart Paneer",
    desc: "A dance of heat and heart. Hand-ground red chilli meets soft, creamy paneer in this timeless favorite.",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=600&auto=format&fit=crop",
    time: "25 mins",
    ingredients: [
      "250g Paneer, cubed",
      "1 tbsp SOI Red Chilli Powder",
      "1/2 cup Yogurt",
      "1 tsp Ginger-Garlic paste",
      "Salt to taste",
      "Bell peppers and Onions"
    ],
    steps: [
      "Mix yogurt, chilli powder, ginger-garlic paste, and salt for marinade.",
      "Coat paneer cubes and veggies in the marinade; rest for 30 mins.",
      "Grill or pan-fry until golden brown.",
      "Serve hot with mint chutney."
    ]
  },
  {
    title: "Golden Soul Dal",
    desc: "Nature’s liquid gold. A nourishing bowl of dal that brings the healing warmth of our finest turmeric to your soul.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=600&auto=format&fit=crop",
    time: "30 mins",
    ingredients: [
      "1 cup Red Lentils (Masoor Dal)",
      "1 tsp SOI Turmeric Powder",
      "1 Onion, finely chopped",
      "2 Tomatoes, diced",
      "1 tsp Cumin seeds",
      "Fresh Coriander for garnish"
    ],
    steps: [
      "Pressure cook dal with water, turmeric, and salt until soft.",
      "In a pan, sauté cumin seeds and onions until golden.",
      "Add tomatoes and cook until mushy.",
      "Mix the cooked dal into the tempering and simmer.",
      "Garnish with coriander and serve with rice."
    ]
  },
  {
    title: "Heritage Chicken Curry",
    desc: "The scent of home. A classic curry where the earthy, fresh-ground aroma of coriander tells a story of tradition.",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=600&auto=format&fit=crop",
    time: "35 mins",
    ingredients: [
      "500g Chicken pieces",
      "2 tbsp SOI Coriander Powder",
      "2 large Onions, sliced",
      "1/2 cup Coconut milk",
      "Whole spices (Cinnamon, Cardamom)",
      "Green chillies"
    ],
    steps: [
      "Sauté whole spices and onions until dark brown.",
      "Add chicken and cook until seared.",
      "Stir in coriander powder and coconut milk; simmer on low heat.",
      "Cook until chicken is tender and gravy thickens.",
      "Serve with hot Naan or Paratha."
    ]
  },
];

export default function Testimonials() {
  const [selectedRecipe, setSelectedRecipe] = React.useState(null);

  React.useEffect(() => {
    if (selectedRecipe) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedRecipe]);

  return (
    <section id="recipes" className="py-24 bg-brand-bg relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-brand-primary text-4xl md:text-5xl font-signature mb-4">
            Spice Up Your Kitchen
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-brand-text">
            Featured <span className="text-brand-primary italic">Recipes</span>
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {recipes.map((recipe, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_-20px_rgba(165,42,42,0.2)] transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                   src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              <div className="p-8 text-left">
                <h4 className="text-2xl font-bold text-brand-text mb-4 group-hover:text-brand-primary transition-colors">
                  {recipe.title}
                </h4>
                <p className="text-brand-text/70 mb-8 leading-relaxed font-medium">
                  {recipe.desc}
                </p>
                <button 
                  onClick={() => setSelectedRecipe(recipe)}
                  className="text-brand-primary font-bold uppercase tracking-widest text-sm flex items-center gap-2 group/btn"
                >
                  View Full Recipe 
                  <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <a
            href="#all-recipes"
            className="inline-block border-2 border-brand-primary text-brand-primary px-10 py-4 rounded-full font-bold hover:bg-brand-primary hover:text-white transition-all shadow-xl"
          >
            Explore All Recipes
          </a>
        </motion.div>
      </div>

      {/* Recipe Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecipe(null)}
              className="absolute inset-0 bg-brand-text/60 backdrop-blur-md"
            />
            
            <motion.div
              layoutId={selectedRecipe.title}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-brand-text hover:text-brand-primary transition-colors"
              >
                <IoCloseOutline size={32} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-full">
                  <img src={selectedRecipe.image} className="w-full h-full object-cover" alt={selectedRecipe.title} />
                </div>
                <div className="p-8 md:p-12">
                  <h3 className="text-3xl md:text-4xl font-bold text-brand-text mb-6">
                    {selectedRecipe.title}
                  </h3>
                  
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-brand-primary mb-4">Ingredients</h4>
                    <ul className="space-y-2">
                      {selectedRecipe.ingredients.map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-brand-text/80 font-medium">
                          <span className="w-2 h-2 bg-brand-primary rounded-full"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-brand-primary mb-4">How to Prepare</h4>
                    <ol className="space-y-4">
                      {selectedRecipe.steps.map((step, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="flex-shrink-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold">
                            {i + 1}
                          </span>
                          <p className="text-brand-text/80 font-medium pt-1">
                            {step}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
