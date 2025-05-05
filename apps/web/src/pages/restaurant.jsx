import { useParams } from "react-router-dom";
import axios from "../services/axios";
import { API_ROUTES } from "../lib/constants";
import { LoadingSpinner } from "../components/loading-spinner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import config from "../config";
import { RestaurantHeader } from "../components/restaurant/restaurant-header";
import { MenuTabs } from "../components/restaurant/menu-tabs";
import { MenuSection } from "../components/restaurant/menu-section";
import { Card } from "../components/ui/card";
import { ChevronLeft, ShoppingBag } from "lucide-react";
import { Separator } from "../components/ui/separator";
import { Button } from "../components/ui/button";

export default function RestaurantPage() {
  const { id } = useParams();
  const [restaurantBranch, setRestaurantBranch] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const navigate = useNavigate();

  const restaurant = restaurantBranch?.restaurant;

  useEffect(() => {
    const abortController = new AbortController();
    const fetchRestaurantBranch = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ROUTES.RESTAURANT_BRANCH(id), {
          signal: abortController.signal,
        });
        setRestaurantBranch(response.data.branch);
        setMenus(response.data.menus);

        // Set initial active menu
        if (response.data.menus.length > 0) {
          setActiveMenuId(response.data.menus[0]._id);
        }
      } catch (error) {
        console.error(error);

        if (error.response?.status === 404) {
          navigate(config.ROUTES.HOME);
        } else {
          toast.error(error.response?.data?.message || "Error loading restaurant");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantBranch();

    return () => abortController.abort();
  }, [id, navigate]);

  if (loading || !restaurantBranch) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="leading-7 [&:not(:first-child)]:mt-6">Loading...</p>
      </div>
    );
  }

  // Find the active menu
  const activeMenu = menus.find((menu) => menu._id === activeMenuId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">

          <div className="mb-2 pl-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>

          <RestaurantHeader restaurant={restaurant} branch={restaurantBranch} />

          <Separator />

          {menus.length > 0 ? (
            <>
              <MenuTabs
                menus={menus}
                onTabChange={(menuId) => setActiveMenuId(menuId)}
              />

              <div className="mt-6">
                {activeMenu ? (
                  <MenuSection menu={activeMenu} />
                ) : (
                  <p>Select a menu to view items</p>
                )}
              </div>
            </>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-gray-500">No menus available for this restaurant</p>
            </Card>
          )}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-6">
            <Card className="p-6">
              <div className="flex items-center justify-center flex-col gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-brand-primary" />
                </div>
                <h3 className="font-semibold text-lg">Your Cart</h3>
                <p className="text-gray-500 text-sm text-center">
                  Add items to your cart to place an order
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
