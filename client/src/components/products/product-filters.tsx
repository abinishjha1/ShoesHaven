import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  minPrice?: number;
  maxPrice?: number;
}

export interface FilterState {
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  categories: string[];
}

const initialColorOptions = [
  "Black",
  "White",
  "Brown",
  "Blue",
  "Red",
  "Grey",
  "Pink",
  "Green",
  "Yellow",
  "Purple",
  "Multi",
];

const initialSizeOptions = [
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "S",
  "M",
  "L",
  "XL",
];

const initialCategoryOptions = [
  "men",
  "women",
  "children",
  "baby",
  "slippers",
];

const ProductFilters = ({
  onFilterChange,
  minPrice = 0,
  maxPrice = 200,
}: ProductFiltersProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    onFilterChange({
      priceRange,
      colors: selectedColors,
      sizes: selectedSizes,
      categories: selectedCategories,
    });
  }, [priceRange, selectedColors, selectedSizes, selectedCategories, onFilterChange]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedCategories([]);
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={clearAllFilters}
        className="w-full mb-4"
      >
        Clear All Filters
      </Button>

      <Accordion type="single" collapsible className="w-full" defaultValue="price">
        {/* Price Range Filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-medium">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 pb-2">
              <Slider
                defaultValue={[minPrice, maxPrice]}
                value={[priceRange[0], priceRange[1]]}
                min={minPrice}
                max={maxPrice}
                step={5}
                onValueChange={handlePriceChange}
                className="mb-6"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  ${priceRange[0]}
                </span>
                <span className="text-sm text-muted-foreground">
                  ${priceRange[1]}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Colors Filter */}
        <AccordionItem value="colors">
          <AccordionTrigger className="text-base font-medium">Colors</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {initialColorOptions.map((color) => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color}`}
                    checked={selectedColors.includes(color)}
                    onCheckedChange={() => handleColorToggle(color)}
                  />
                  <Label
                    htmlFor={`color-${color}`}
                    className="text-sm cursor-pointer"
                  >
                    {color}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sizes Filter */}
        <AccordionItem value="sizes">
          <AccordionTrigger className="text-base font-medium">Sizes</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-3 gap-2 pt-2">
              {initialSizeOptions.map((size) => (
                <div key={size} className="flex items-center space-x-2">
                  <Checkbox
                    id={`size-${size}`}
                    checked={selectedSizes.includes(size)}
                    onCheckedChange={() => handleSizeToggle(size)}
                  />
                  <Label
                    htmlFor={`size-${size}`}
                    className="text-sm cursor-pointer"
                  >
                    {size}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Categories Filter */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-base font-medium">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-2 pt-2">
              {initialCategoryOptions.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label
                    htmlFor={`category-${category}`}
                    className="text-sm cursor-pointer capitalize"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductFilters;
