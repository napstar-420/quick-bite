import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  Menu as MenuIcon,
  UtensilsCrossed,
  DollarSign,
  Store,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  RefreshCcw,
  X,
  Search,
  Filter,
  ChevronLeft,
  Image
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import axios from "../../services/axios";
import { API_ROUTES } from "../../lib/constants";

export default function RestaurantMenuManagement({ restaurantId }) {
  const [menus, setMenus] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [view, setView] = useState("menus"); // "menus" or "items"

  useEffect(() => {
    fetchMenus();
  }, [restaurantId]);

  useEffect(() => {
    if (activeMenu) {
      fetchMenuItems(activeMenu._id);
    }
  }, [activeMenu]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ROUTES.ADMIN.RESTAURANT(restaurantId)}/menus`);
      setMenus(response.data);

      // Set first menu as active if available
      if (response.data.length > 0 && !activeMenu) {
        setActiveMenu(response.data[0]);
      }
    } catch (err) {
      console.error("Error fetching menus:", err);
      setError("Failed to load restaurant menus");
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async (menuId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ROUTES.ADMIN.RESTAURANT(restaurantId)}/menus/${menuId}/items`);
      setMenuItems(response.data);
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setError("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuSelect = (menu) => {
    setActiveMenu(menu);
    setView("items");
  };

  const handleToggleMenuAvailability = async (menuId, currentStatus) => {
    try {
      // Toggle the menu availability
      await axios.patch(`${API_ROUTES.ADMIN.RESTAURANT(restaurantId)}/menus/${menuId}`, {
        isAvailable: !currentStatus
      });

      // Update local state
      setMenus(menus.map(menu =>
        menu._id === menuId ? { ...menu, isAvailable: !currentStatus } : menu
      ));
    } catch (err) {
      console.error("Error toggling menu availability:", err);
    }
  };

  const handleToggleItemAvailability = async (itemId, currentStatus) => {
    if (!activeMenu) return;

    try {
      await axios.patch(`${API_ROUTES.ADMIN.RESTAURANT(restaurantId)}/menus/${activeMenu._id}/items/${itemId}`, {
        isAvailable: !currentStatus
      });

      // Update local state
      setMenuItems(menuItems.map(item =>
        item._id === itemId ? { ...item, isAvailable: !currentStatus } : item
      ));
    } catch (err) {
      console.error("Error toggling item availability:", err);
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    if (!activeMenu) return;

    try {
      await axios.delete(`${API_ROUTES.ADMIN.RESTAURANT(restaurantId)}/menus/${activeMenu._id}/items/${itemId}`);
      // Update local state
      setMenuItems(menuItems.filter(item => item._id !== itemId));
    } catch (err) {
      console.error("Error deleting menu item:", err);
    }
  };

  // Filter menu items based on search query and availability filter
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (availabilityFilter === "all") return matchesSearch;
    if (availabilityFilter === "available") return matchesSearch && item.isAvailable;
    if (availabilityFilter === "unavailable") return matchesSearch && !item.isAvailable;

    return matchesSearch;
  });

  if (loading && menus.length === 0) {
    return (
      <div className="flex items-center justify-center p-6">
        <RefreshCcw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error && menus.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <X className="h-8 w-8 text-destructive mb-2" />
        <p className="text-lg font-medium">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Menu Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">
            {view === "menus"
              ? "Restaurant Menus"
              : `Menu Items - ${activeMenu?.name || ""}`
            }
          </h2>
          {view === "items" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("menus")}
              className="flex items-center gap-1 ml-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Menus
            </Button>
          )}
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {view === "menus" ? "Add Menu" : "Add Item"}
        </Button>
      </div>

      {/* Menu List View */}
      {view === "menus" && (
        <>
          {menus.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <MenuIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Menus Yet</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  This restaurant doesn't have any menus yet.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Menu
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menus.map((menu) => (
                <Card key={menu._id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium">{menu.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleMenuSelect(menu)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Menu Items
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Menu
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Menu
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription className="flex items-center gap-1 pt-1">
                      {menu.branches?.length > 0 ? (
                        <>
                          <Store className="h-3.5 w-3.5" />
                          <span>Available in {menu.branches.length} {menu.branches.length === 1 ? 'branch' : 'branches'}</span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Not assigned to any branch</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {menu.menuItems?.length || 0} {menu.menuItems?.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {menu.isAvailable ? 'Available' : 'Hidden'}
                        </span>
                        <Switch
                          checked={menu.isAvailable}
                          onCheckedChange={() => handleToggleMenuAvailability(menu._id, menu.isAvailable)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-1 flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleMenuSelect(menu)}
                    >
                      <UtensilsCrossed className="h-4 w-4 mr-2" />
                      Manage Items
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Menu Items View */}
      {view === "items" && activeMenu && (
        <>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="w-40">
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Filter" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Menu Items Found</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  {searchQuery || availabilityFilter !== "all"
                    ? "No items match your current filters."
                    : "This menu doesn't have any items yet."}
                </p>
                {searchQuery || availabilityFilter !== "all" ? (
                  <Button variant="outline" onClick={() => {
                    setSearchQuery("");
                    setAvailabilityFilter("all");
                  }}>
                    Clear Filters
                  </Button>
                ) : (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Item
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <Card key={item._id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative w-full h-40 bg-muted">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Item
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMenuItem(item._id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Item
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{item.price.toFixed(2)}</span>
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm text-muted-foreground">
                        {item.isAvailable ? 'Available' : 'Hidden'}
                      </span>
                      <Switch
                        checked={item.isAvailable}
                        onCheckedChange={() => handleToggleItemAvailability(item._id, item.isAvailable)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
