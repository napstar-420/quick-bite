import { Star, Clock, MapPin, Info } from "lucide-react";
import { Badge } from "../ui/badge";
import config from "../../config";

export function RestaurantHeader({ restaurant, branch }) {
  return (
    <div className="rounded-lg p-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-40 aspect-square rounded-2xl overflow-hidden border">
          <img
            src={restaurant?.logo || config.RESTAURANT_PLACEHOLDER_IMAGE}
            alt={restaurant?.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1">
          <span className="capitalize text-muted-foreground inline-block mb-2">
            {restaurant?.categories?.map((c) => c.name).join(", ")}
          </span>
          <div className="flex justify-between items-start">
            <h1 className="scroll-m-20 pb-2 text-3xl font-bold tracking-tight first:mt-0">
              {restaurant?.name} - {branch?.name}
            </h1>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
              Open
            </Badge>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500 mr-1" />
              <span>{branch?.rating || 4.6}</span>
              <span className="text-gray-500 text-sm ml-1">
                ({branch?.reviewCount || "2000+"})
              </span>
            </div>
            <span className="text-gray-500">•</span>
            <span className="capitalize text-muted-foreground">
              {branch?.address?.street}
            </span>
          </div>

          <div className="flex items-center gap-3 mt-1 text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{branch?.deliveryTime || "10-25"} min</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>Rs.{branch?.deliveryFee || 49}</span>
            </div>
            <div className="flex items-center gap-1">
              <Info className="h-3.5 w-3.5" />
              <span>{restaurant?.priceRange}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
