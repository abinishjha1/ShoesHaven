import { Link } from "wouter";
import { motion } from "framer-motion";

const categories = [
  {
    id: "men",
    name: "Men's",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "women",
    name: "Women's",
    image: "https://images.unsplash.com/photo-1581101767113-1677fc2beaa8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "children",
    name: "Children's",
    image: "https://images.unsplash.com/photo-1599751449128-eb7249c3d6b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "baby",
    name: "Baby",
    image: "https://images.unsplash.com/photo-1515889704942-6cda9efe57b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "slippers",
    name: "Slippers",
    image: "https://images.unsplash.com/photo-1607083681678-52733140f93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  },
];

export function CategorySection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };
  
  return (
    <section className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-3xl font-heading font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Shop By Category
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={item}>
              <Link href={`/category/${category.id}`}>
                <div className="group relative rounded-lg overflow-hidden shadow-md h-60">
                  <img 
                    src={category.image} 
                    alt={`${category.name} shoes`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-medium">{category.name}</h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
