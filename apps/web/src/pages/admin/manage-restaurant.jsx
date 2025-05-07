import { useParams } from "react-router-dom";
import axios from '../../services/axios';
import { useEffect, useState } from "react";
import { API_ROUTES } from "../../lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Store,
  Menu,
  UtensilsCrossed,
  Star,
  ArrowLeft,
  Edit,
  Check,
  X,
  RefreshCcw,
  Coffee
} from "lucide-react";
import { Button } from "@/components/ui/button";
import RestaurantDetails from "@/components/admin/restaurant-details";
import RestaurantBranches from "@/components/admin/restaurant-branches";
import RestaurantMenuManagement from "@/components/admin/restaurant-menu-management";
import RestaurantReviews from "@/components/admin/restaurant-reviews";

export default function ManageRestaurant() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_ROUTES.ADMIN.RESTAURANT(id), {
          signal: abortController.signal,
        });
        setRestaurant(res.data);
        setError(null);
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError("Failed to load restaurant details. Please try again.");
          console.error("Error fetching restaurant:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();

    return () => abortController.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2">
          <RefreshCcw className="animate-spin h-6 w-6" />
          <p className="text-sm text-muted-foreground">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2">
          <X className="h-10 w-10 text-destructive" />
          <p className="text-lg font-medium">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {restaurant?.name || "Restaurant Details"}
          </h1>
          <div className="ml-2 flex items-center gap-2">
            {restaurant?.status && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                restaurant.status === 'approved' ? 'bg-green-100 text-green-800' :
                restaurant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                restaurant.status === 'under-review' ? 'bg-blue-100 text-blue-800' :
                restaurant.status === 'rejected' ? 'bg-red-100 text-red-800' :
                restaurant.status === 'suspended' ? 'bg-gray-100 text-gray-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {restaurant.status}
              </span>
            )}
            {restaurant?.isActive !== undefined && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                restaurant.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {restaurant.isActive ? 'Active' : 'Inactive'}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          {restaurant?.status === 'pending' && (
            <>
              <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button variant="destructive" size="sm">
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          )}
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline-block">Details</span>
          </TabsTrigger>
          <TabsTrigger value="branches" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline-block">Branches</span>
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4" />
            <span className="hidden sm:inline-block">Menu Management</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline-block">Reviews</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          {restaurant && <RestaurantDetails restaurant={restaurant} />}
        </TabsContent>

        <TabsContent value="branches" className="space-y-4">
          {restaurant && <RestaurantBranches restaurantId={id} />}
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          {restaurant && <RestaurantMenuManagement restaurantId={id} />}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {restaurant && <RestaurantReviews restaurantId={id} />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
