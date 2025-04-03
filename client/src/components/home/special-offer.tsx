import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SpecialOffer() {
  return (
    <section className="py-12 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="w-full md:w-1/2 mb-8 md:mb-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Special Offer</h2>
            <p className="text-lg opacity-90 mb-6">Get 20% off on all slippers. Limited time offer.</p>
            <motion.ul 
              className="space-y-3 mb-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
            >
              {[
                "Premium quality materials",
                "Ultra comfortable design",
                "Available in multiple colors",
                "Free shipping on orders over $50"
              ].map((item, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-center"
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                  }}
                >
                  <Check className="text-accent mr-2 h-5 w-5" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
            <Link href="/category/slippers">
              <Button className="bg-accent hover:bg-opacity-90 text-white font-medium py-3 px-8 rounded-md transition-all transform hover:translate-y-[-2px]">
                Shop Now
              </Button>
            </Link>
          </motion.div>
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Special offer slippers" 
                className="rounded-lg"
              />
              <motion.div 
                className="absolute -top-4 -right-4 bg-accent text-white rounded-full w-24 h-24 flex flex-col items-center justify-center font-heading font-bold"
                initial={{ rotate: -10, scale: 0.8 }}
                whileInView={{ rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <span className="text-sm">Save</span>
                <span className="text-2xl">20%</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
