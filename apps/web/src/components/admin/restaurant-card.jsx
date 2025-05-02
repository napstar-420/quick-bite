import { Badge } from "../ui/badge";
import { StatusBadge } from "./restaurant-status-badge";
import { Star, Coffee, Store, Wallet, ExternalLink } from "lucide-react";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import config from "../../config";
import { Link } from "react-router-dom";
export function RestaurantCard({ restaurant, showFeaturedToggle = false }) {
  return (
    <Card className="overflow-hidden py-0">
      <div className="relative h-48">
        <img
          src={restaurant.logo || config.PLACEHOLDER_LOGO}
          alt={restaurant.name}
          className="object-cover w-full h-full"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <StatusBadge status={restaurant.status} />
        </div>
        {restaurant.featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-brand-accent text-brand-secondary">
              Featured
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold">{restaurant.name}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
            <span>{restaurant.rating || 0}</span>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-500">
          <div className="flex items-start mb-1">
            <Coffee className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span className="capitalize">{restaurant.categories.join(', ')}</span>
          </div>
          <div className="flex items-start mb-1">
            <Store className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{restaurant.branchesCount} branches</span>
          </div>
          <div className="flex items-start">
            <Wallet className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{restaurant.priceRange}</span>
          </div>
        </div>

        {showFeaturedToggle && (
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <Label
              htmlFor={`featured-${restaurant._id}`}
              className="font-medium"
            >
              Featured Status
            </Label>
            <Switch
              id={`featured-${restaurant._id}`}
              checked={restaurant.featured}
            />
          </div>
        )}

        <div className="flex-1"></div>

        <div className="flex justify-between gap-2 mt-2">
          <Button asChild variant="outline" className="flex-1">
            <Link to={config.ROUTES.ADMIN_RESTAURANT(restaurant._id)}>
              <ExternalLink className="w-4 h-4 mr-2" /> Open
            </Link>
          </Button>
          {restaurant.status === "approved" ? (
            <Button
              variant="outline"
              className="flex-1 text-amber-600 border-amber-200 hover:bg-amber-50"
            >
              Suspend
            </Button>
          ) : (
            <Button
              variant="outline"
              className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
            >
              Activate
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
