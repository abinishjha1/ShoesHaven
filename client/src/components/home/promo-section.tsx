import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const PromoSection = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl mb-4">
              Summer Collection Sale
            </h2>
            <p className="text-lg mb-6 text-neutral-100">
              Get up to 40% off on our summer collection. Limited time offer.
            </p>
            <ul className="mb-8 space-y-2">
              <li className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-accent mr-2" />
                <span>Free shipping on all orders</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-accent mr-2" />
                <span>Easy 30-day returns</span>
              </li>
              <li className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-accent mr-2" />
                <span>Special discounts for members</span>
              </li>
            </ul>
            <Link href="/products/category/all">
              <Button className="bg-accent hover:bg-opacity-90 text-white font-semibold py-3 px-8 rounded-full">
                Shop the Sale
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative h-80 md:h-96"
          >
            <img
              src="https://images.unsplash.com/photo-1520964439407-80d36296f116"
              alt="Summer collection shoes"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute top-4 right-4 bg-accent text-white font-bold text-xl rounded-full h-16 w-16 flex items-center justify-center">
              -40%
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
