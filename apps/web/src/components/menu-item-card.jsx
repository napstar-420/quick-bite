import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Store, ImagePlus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import PropTypes from "prop-types";

export function MenuItemCard({ menuItem }) {
  return (
    <Card className="overflow-hidden h-full flex flex-col py-0 bg-secondary">
      <div className="flex py-2 pl-4 pr-2 justify-between items-start">
        <div className="flex-1 flex flex-col h-full">
          <h3 className="font-semibold text-lg mb-1">{menuItem.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-rose-600 font-medium">
              Rs. {menuItem.price}
            </span>
            {menuItem.originalPrice && (
              <span className="text-gray-500 text-sm line-through">
                Rs. {menuItem.originalPrice}
              </span>
            )}
          </div>
          {menuItem.description && (
            <p className="text-sm text-gray-500 my-2">{menuItem.description}</p>
          )}

          <Badge variant="outline" className="mt-auto bg-white">
            <Store className="mr-1" />
            {menuItem.restaurant}
          </Badge>
        </div>
        <div className="relative h-full aspect-square ml-4">
          {menuItem.image ? (
            <div className="relative rounded-md overflow-hidden">
              <img
                src={menuItem.image}
                alt={menuItem.name}
                className="w-full h-full object-cover rounded-md"
                loading="lazy"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-2 right-2 rounded-full hover:scale-120 transition-all duration-300 bg-brand-primary hover:bg-brand-primary/80"
                title="Add to cart"
              >
                <Plus />
              </Button>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
              <ImagePlus className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

MenuItemCard.propTypes = {
  menuItem: PropTypes.object.isRequired,
};
