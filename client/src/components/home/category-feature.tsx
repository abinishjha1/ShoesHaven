import { Link } from "wouter";
import { motion } from "framer-motion";

interface Category {
  title: string;
  link: string;
  image: string;
}

const categories: Category[] = [
  {
    title: "Men's Shoes",
    link: "/products/category/men",
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
  },
  {
    title: "Women's Shoes",
    link: "/products/category/women",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
  },
  {
    title: "Children's Shoes",
    link: "/products/category/children",
    image: "https://images.unsplash.com/photo-1608571423902-ced127d14abe",
  },
  {
    title: "Baby Shoes",
    link: "/products/category/baby",
    image: "https://images.unsplash.com/photo-1576566265240-9aa3e84eace9",
  },
  {
    title: "Slippers",
    link: "/products/category/slippers",
    image: "https://images.unsplash.com/photo-1586798133310-c43f3b66e5b6",
  },
];

const CategoryFeature = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-montserrat font-bold text-3xl mb-12 text-center">
          Shop By Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              category={category}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface CategoryCardProps {
  category: Category;
  index: number;
}

const CategoryCard = ({ category, index }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={category.link} className="relative rounded-lg overflow-hidden group h-64 block">
        <motion.img
          src={category.image}
          alt={category.title}
          className="w-full h-full object-cover transition duration-500"
          whileHover={{ scale: 1.1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-white font-montserrat font-semibold text-xl">
            {category.title}
          </h3>
          <p className="text-white text-sm opacity-90">Explore Collection</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryFeature;
