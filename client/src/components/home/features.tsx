import { motion } from "framer-motion";
import { Truck, RefreshCw, Shield, Headphones, Clock } from "lucide-react";

const features = [
  {
    icon: <Truck className="h-6 w-6 text-accent" />,
    title: "Fast Delivery",
    description: "Free shipping on orders over $50",
  },
  {
    icon: <RefreshCw className="h-6 w-6 text-accent" />,
    title: "Easy Returns",
    description: "30-day hassle-free return policy",
  },
  {
    icon: <Shield className="h-6 w-6 text-accent" />,
    title: "Secure Payments",
    description: "Protected by industry-leading encryption",
  },
  {
    icon: <Headphones className="h-6 w-6 text-accent" />,
    title: "24/7 Customer Support",
    description: "Get expert help whenever you need it",
  },
];

export function Features() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };
  
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };
  
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="bg-primary/10 p-5 rounded-full mb-5 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center justify-center bg-primary/5 rounded-full px-5 py-2 mb-4">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            <span className="text-sm font-medium text-primary">Limited Time Offer</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Get 15% Off Your First Order</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Sign up for our newsletter and receive a special discount on your first purchase. 
            Don't miss out on exclusive deals, new arrivals, and style tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
