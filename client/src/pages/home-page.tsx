import { Helmet } from "react-helmet";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroCarousel from "@/components/home/hero-carousel";
import CategoryFeature from "@/components/home/category-feature";
import FeaturedProducts from "@/components/home/featured-products";
import PromoSection from "@/components/home/promo-section";
import NewArrivals from "@/components/home/new-arrivals";
import Testimonials from "@/components/home/testimonials";
import Newsletter from "@/components/home/newsletter";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Footwear Fusion - Premium Shoes & Slippers</title>
        <meta
          name="description"
          content="Discover premium quality shoes and slippers for the whole family. Shop our collection of men's, women's, children's, and baby shoes."
        />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <HeroCarousel />
          <CategoryFeature />
          <FeaturedProducts />
          <PromoSection />
          <NewArrivals />
          <Testimonials />
          <Newsletter />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
