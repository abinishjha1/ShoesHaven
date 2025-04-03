import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const slides = [
  {
    id: 1,
    title: "Step Into Comfort & Style",
    subtitle: "Discover our new collection of premium footwear for the whole family.",
    cta: "Shop Now",
    ctaLink: "#featured",
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    accent: "Comfort",
    badge: "New Arrivals",
  },
  {
    id: 2,
    title: "Summer Collection 2025",
    subtitle: "Light and breathable shoes for the hottest days. Premium materials for maximum comfort.",
    cta: "View Collection",
    ctaLink: "#summer-collection",
    image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    accent: "Collection",
    badge: "Limited Edition",
  },
  {
    id: 3,
    title: "Kid's Footwear",
    subtitle: "Comfortable and durable shoes designed specifically for your little ones.",
    cta: "Shop Kid's",
    ctaLink: "#kids",
    image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    accent: "Footwear",
    badge: "Best Sellers",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="relative overflow-hidden bg-primary text-neutral-100">
      <div className="hero-carousel relative h-[70vh] md:h-[80vh]">
        <AnimatePresence initial={false} mode="wait">
          {slides.map((slide, index) => (
            index === currentSlide && (
              <motion.div
                key={slide.id}
                className="hero-slide absolute inset-0 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <div className="container mx-auto px-4 md:px-8 z-10">
                  <Badge 
                    className="mb-4 md:mb-6 bg-accent/90 hover:bg-accent text-white py-1 px-3 text-sm font-medium animate-slide-in-right">
                    <Star className="h-3.5 w-3.5 mr-1" /> {slide.badge}
                  </Badge>
                  
                  <motion.div 
                    className="w-full md:w-1/2 space-y-4 md:space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration:.5 }}
                  >
                    <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight">
                      {slide.title.split(slide.accent).map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <span className="text-accent relative">
                              {slide.accent}
                              <span className="absolute -bottom-1 left-0 w-full h-1 bg-accent/30 rounded"></span>
                            </span>
                          )}
                        </span>
                      ))}
                    </h1>
                    <p className="text-lg md:text-xl opacity-90">{slide.subtitle}</p>
                    <div className="pt-4 md:pt-6 flex flex-col sm:flex-row gap-3">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        <Link href={slide.ctaLink}>
                          <Button 
                            className="bg-accent hover:bg-accent/90 text-white font-medium py-3 px-8 rounded-md transition-all transform hover:translate-y-[-2px] shadow-lg hover:shadow-xl"
                          >
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            {slide.cta}
                          </Button>
                        </Link>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      >
                        <Button 
                          variant="outline"
                          className="bg-white/10 backdrop-blur-sm border-white/20 text-white font-medium py-3 px-8 rounded-md transition-all hover:bg-white/20"
                        >
                          Learn More
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent z-0"></div>
                <img 
                  src={slide.image} 
                  alt={`Hero image - ${slide.title}`} 
                  className="absolute inset-0 object-cover w-full h-full -z-10"
                  loading="eager"
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>
        
        {/* Carousel Controls */}
        <Button 
          variant="outline" 
          size="icon" 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full text-white z-20 backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 p-2 rounded-full text-white z-20 backdrop-blur-sm"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full bg-white ${
                index === currentSlide ? "opacity-100" : "opacity-50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
