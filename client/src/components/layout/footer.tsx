import { Link } from "wouter";
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h3 className="font-montserrat font-bold text-xl mb-4">Footwear Fusion</h3>
            <p className="text-white text-opacity-80 mb-4">
              Premium quality shoes and slippers for the whole family.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-montserrat font-semibold text-xl mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/category/men" className="text-white text-opacity-80 hover:text-accent transition-colors">
                  Men's Shoes
                </Link>
              </li>
              <li>
                <Link href="/products/category/women" className="text-white text-opacity-80 hover:text-accent transition-colors">
                  Women's Shoes
                </Link>
              </li>
              <li>
                <Link href="/products/category/children" className="text-white text-opacity-80 hover:text-accent transition-colors">
                  Kids' Shoes
                </Link>
              </li>
              <li>
                <Link href="/products/category/baby" className="text-white text-opacity-80 hover:text-accent transition-colors">
                  Baby Shoes
                </Link>
              </li>
              <li>
                <Link href="/products/category/slippers" className="text-white text-opacity-80 hover:text-accent transition-colors">
                  Slippers
                </Link>
              </li>
              <li>
                <Link href="/" className="text-white text-opacity-80 hover:text-accent transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/" className="text-white text-opacity-80 hover:text-accent transition-colors">
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="font-montserrat font-semibold text-xl mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white text-opacity-80 hover:text-accent transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/" className="text-white text-opacity-80 hover:text-accent transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="text-white text-opacity-80 hover:text-accent transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/" className="text-white text-opacity-80 hover:text-accent transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/" className="text-white text-opacity-80 hover:text-accent transition-colors">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link href="/" className="text-white text-opacity-80 hover:text-accent transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-montserrat font-semibold text-xl mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-accent shrink-0 mt-1" />
                <span className="text-white text-opacity-80">
                  1234 Fashion Street, Suite 900
                  <br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-accent shrink-0" />
                <span className="text-white text-opacity-80">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-accent shrink-0" />
                <span className="text-white text-opacity-80">info@footwearfusion.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="pt-8 border-t border-white border-opacity-20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white text-opacity-60 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Footwear Fusion. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/" className="text-white text-opacity-60 hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/" className="text-white text-opacity-60 hover:text-accent transition-colors">
              Terms of Service
            </Link>
            <Link href="/" className="text-white text-opacity-60 hover:text-accent transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
