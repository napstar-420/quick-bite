import { useState } from "react";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";

export function FiltersSidebar() {
  const [sortBy, setSortBy] = useState("recommended");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  return (
    <div className="border border-border rounded-lg w-3xs p-4 px-6">
      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">
        Filters
      </h2>

      <div className="space-y-6">
        {/* Sort By */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Sort By</h3>
          <RadioGroup value={sortBy} onValueChange={setSortBy} className="gap-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="recommended" id="recommended" />
              <Label htmlFor="recommended">Recommended</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price-low-to-high" id="price-low-to-high" />
              <Label htmlFor="price-low-to-high">Price: Low to High</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price-high-to-low" id="price-high-to-low" />
              <Label htmlFor="price-high-to-low">Price: High to Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="newest" id="newest" />
              <Label htmlFor="newest">Newest</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Categories */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Categories</h3>
          <RadioGroup value={category} onValueChange={setCategory} className="gap-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all-categories" />
              <Label htmlFor="all-categories">All Categories</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="popular" id="popular" />
              <Label htmlFor="popular">Popular</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="breakfast" id="breakfast" />
              <Label htmlFor="breakfast">Breakfast</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lunch" id="lunch" />
              <Label htmlFor="lunch">Lunch</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dinner" id="dinner" />
              <Label htmlFor="dinner">Dinner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rice-menu" id="rice-menu" />
              <Label htmlFor="rice-menu">Rice Menu</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        {/* Price Range */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Price Range</h3>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under-200">Under ₨200</SelectItem>
              <SelectItem value="200-400">₨200 - ₨400</SelectItem>
              <SelectItem value="400-600">₨400 - ₨600</SelectItem>
              <SelectItem value="over-600">Over ₨600</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
