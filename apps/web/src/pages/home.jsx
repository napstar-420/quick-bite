import { Plus, Search, Store } from "lucide-react";
import { FiltersSidebar } from "../components/filters-sidebar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useSelector } from "react-redux";
import { selectCoordinates, selectCity } from "../features/auth/authSlice";
import { useEffect, useState } from "react";
import { API_ROUTES } from "../lib/constants";
import { cityCoordinates } from "../lib/city-coordinates";
import { toast } from "sonner";
import axios from "../services/axios";
import { Card } from "../components/ui/card";
import { ImagePlus } from "lucide-react";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { LoadingSpinner } from "../components/loading-spinner";
import { MenuItemCard } from "../components/menu-item-card";
import { RestaurantCard } from "../components/restaurant-card";

export default function HomePage() {
  const coordinates = useSelector(selectCoordinates);
  const city = useSelector(selectCity);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restaurantBranches, setRestaurantBranches] = useState([]);
  useEffect(() => {
    const abortController = new AbortController();
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const c = coordinates || cityCoordinates[city];
        const response = await axios.get(API_ROUTES.MENU_ITEMS(c), {
          signal: abortController.signal,
        });

        setMenuItems(response.data.menuItems);
        setRestaurantBranches(response.data.restaurantBranches);
      } catch (error) {
        console.error(error);
        toast.error("Error fetching menu items");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <main className="flex-1 flex gap-4 w-full max-w-7xl mx-auto py-4">
      <FiltersSidebar />
      <div className="flex-1">
        <div className="relative">
          <Input
            placeholder="Search for restaurants, categories, dishes..."
            className="rounded-full inline-block p-6"
          />
          <Button
            variant="default"
            size="lg"
            className="rounded-full h-[80%] absolute right-2 top-1/2 -translate-y-1/2"
          >
            <Search /> Search
          </Button>
        </div>

        <Separator className="my-4" />

        {loading ? (
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">
              Restaurants
            </h3>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
              {restaurantBranches.map((branch) => (
                <RestaurantCard
                  key={branch._id}
                  branch={branch}
                />
              ))}
            </div>

            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight my-4">
              Menu Items
            </h3>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-4">
              {menuItems.map((menuItem) => (
                <MenuItemCard key={menuItem._id} menuItem={menuItem} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
