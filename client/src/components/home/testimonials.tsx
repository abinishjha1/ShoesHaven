import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Testimonial {
  text: string;
  author: string;
  rating: number;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    text: "The quality of these shoes exceeded my expectations. Very comfortable and stylish. I will definitely be purchasing more from this store!",
    author: "Sarah Johnson",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    text: "I purchased the slippers for my husband and he loves them! Great quality, fast shipping, and excellent customer service. Will buy again.",
    author: "Michael Rodriguez",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
  },
  {
    text: "The baby shoes I ordered were adorable and durable. My little one seems very comfortable in them. The sizing guide was very helpful!",
    author: "Emily Thompson",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <h2 className="font-montserrat font-bold text-3xl mb-12 text-center">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

const TestimonialCard = ({ testimonial, index }: TestimonialCardProps) => {
  const { text, author, rating, image } = testimonial;
  
  // Generate stars based on rating
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <div className="flex text-yellow-400 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < fullStars
                ? "fill-yellow-400"
                : i === fullStars && hasHalfStar
                ? "fill-yellow-400 stroke-yellow-400"
                : "stroke-yellow-400 fill-transparent"
            }`}
          />
        ))}
      </div>
      <p className="text-primary mb-4">{text}</p>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-neutral-200 rounded-full overflow-hidden mr-3">
          <img
            src={image}
            alt={author}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-medium">{author}</h4>
          <p className="text-sm text-secondary">Verified Buyer</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Testimonials;
