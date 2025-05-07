import { Star, Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Link } from "react-router-dom";
import config from "../config";

export function RestaurantCard({ branch }) {
  return (
    <Link to={config.ROUTES.RESTAURANT(branch._id)}>
      <Card className="overflow-hidden py-0 hover:bg-brand-primary/20 transition-all duration-300 hover:cursor-pointer">
        <div className="relative">
          {branch?.discount && (
            <Badge className="absolute top-2 left-2 bg-rose-600 hover:bg-rose-700 text-white font-medium">
              {branch.discount}% off
            </Badge>
          )}
          <img
            src={branch?.restaurant?.logo || config.RESTAURANT_PLACEHOLDER_IMAGE}
            alt={branch.restaurant.name}
            className="w-full h-52 object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-3 pt-0">
          <h3 className="scroll-m-20 text-lg mb-4 font-semibold tracking-tight flex items-center gap-2 justify-between">
            {`${branch.restaurant.name} - ${branch.name}`}{" "}
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span className="text-sm font-medium">
                {branch.rating || 4.5}
                  <span className="text-gray-500 font-normal">
                    ({branch.reviewCount || 500})
                  </span>
              </span>
            </div>
          </h3>

          <div className="flex items-center text-gray-500 text-xs mt-1">
            <span>${branch.restaurant.priceRange}</span>
            <span className="mx-1">•</span>
            <span className="capitalize">
              {branch.restaurant.categories
                .map((category) => category.name)
                .join(", ")}
            </span>
          </div>

          <div className="flex items-center text-gray-500 text-xs mt-1">
            <Clock className="h-3 w-3 mr-1" />
            <span className="mr-1">{branch?.deliveryTime || '30 - 45'} mins</span>
            <span className="mx-1">•</span>
            <span className="flex items-center">
              Rs.{branch?.deliveryFee || 100}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
