import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-4 py-3 space-y-1 bg-white border-t border-neutral-200">
            <Link
              href="/products/category/men"
              className="block py-2 font-medium"
              onClick={onClose}
            >
              Men
            </Link>
            <Link
              href="/products/category/women"
              className="block py-2 font-medium"
              onClick={onClose}
            >
              Women
            </Link>
            <Link
              href="/products/category/children"
              className="block py-2 font-medium"
              onClick={onClose}
            >
              Kids
            </Link>
            <Link
              href="/products/category/baby"
              className="block py-2 font-medium"
              onClick={onClose}
            >
              Baby
            </Link>
            <Link
              href="/products/category/slippers"
              className="block py-2 font-medium"
              onClick={onClose}
            >
              Slippers
            </Link>
            <Link href="/" className="block py-2 font-medium" onClick={onClose}>
              Sale
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
