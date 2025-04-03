import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface Slide {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  image: string;
}

const slides: Slide[] = [
  {
    title: "Step into Comfort and Style",
    subtitle: "Discover our new collection of premium shoes for the whole family",
    buttonText: "Shop Now",
    buttonLink: "/products/category/men",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
  },
  {
    title: "Summer Collection 2023",
    subtitle: "Lightweight and breathable shoes for the warm season",
    buttonText: "Explore Collection",
    buttonLink: "/products/category/women",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
  },
  {
    title: "Cozy Slippers Collection",
    subtitle: "Premium comfort for your home relaxation",
    buttonText: "Shop Slippers",
    buttonLink: "/products/category/slippers",
    image: "https://images.unsplash.com/photo-1548687694-de40ec409350",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToNextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  useEffect(() => {
    // Auto-rotate slides
    const startTimer = () => {
      timeoutRef.current = setTimeout(() => {
        goToNextSlide();
      }, 5000);
    };

    startTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentSlide]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <section className="relative bg-primary overflow-hidden" style={{ height: "500px" }}>
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="w-full md:w-1/2 text-white z-10">
              <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-4">
                {slides[currentSlide].title}
              </h1>
              <p className="text-lg mb-8">{slides[currentSlide].subtitle}</p>
              <Link href={slides[currentSlide].buttonLink}>
                <Button className="bg-accent hover:bg-opacity-90 text-white font-semibold py-3 px-8 rounded-full">
                  {slides[currentSlide].buttonText}
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute inset-0 bg-primary opacity-60"></div>
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Carousel controls */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 z-20"
        onClick={goToPrevSlide}
      >
        <ChevronLeft className="text-white h-5 w-5" />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 z-20"
        onClick={goToNextSlide}
      >
        <ChevronRight className="text-white h-5 w-5" />
      </button>

      {/* Carousel indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-8 rounded-full bg-white transition-opacity duration-300 ${
              index === currentSlide ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
