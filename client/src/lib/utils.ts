import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export const getStockStatus = (product: { inStock: boolean }): {
  text: string;
  color: string;
} => {
  if (product.inStock) {
    return {
      text: "In Stock",
      color: "text-green-600",
    };
  } else {
    return {
      text: "Out of Stock",
      color: "text-red-600",
    };
  }
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    men: "Men's Shoes",
    women: "Women's Shoes",
    children: "Children's Shoes",
    baby: "Baby Shoes",
    slippers: "Slippers",
  };
  
  return labels[category] || category;
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};
