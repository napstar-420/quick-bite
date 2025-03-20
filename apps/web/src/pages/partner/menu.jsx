import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Tabs, TabsContent } from "../../components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { Plus, MoreVertical, Trash, Edit } from "lucide-react";
import axios from "../../services/axios";
import { usePartner } from "../../hooks/usePartner";
import { MenuDialog } from "../../components/partner/menu-dialog";
import { MenuItemDialog } from "../../components/partner/menu-item-dialog";
import { MenuItemCard } from "../../components/partner/menu-item-card";
import { MenuTabsList } from "../../components/partner/menu-tabs-list";
import { API_ROUTES } from "../../lib/constants";

export default function PartnerMenuManagement() {
  const { restaurant, branches } = usePartner();

  // States
  const [menus, setMenus] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Computed
  const activeMenu = menus.find((menu) => menu._id === activeMenuId);
  const branchesOptions = branches.map(({ name, _id }) => {
    return {
      label: name,
      value: _id,
    };
  });

  // Fetch menus
  useEffect(() => {
    const fetchMenus = async () => {
      if (!restaurant) return;

      try {
        const response = await axios.get(API_ROUTES.PARTNER.MENUS);

        setMenus(response.data);
        if (response.data.length > 0) {
          setActiveMenuId(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching menus:", error);
        toast.error("Error", {
          description: "Failed to load menus",
        });
      }
    };

    fetchMenus();
  }, [restaurant]);

  // Fetch menu items when active menu changes
  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!activeMenuId) return;

      try {
        const response = await axios.get(
          API_ROUTES.PARTNER.MENU_ITEMS(activeMenuId),
        );
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        toast.error("Error", {
          description: "Failed to load menu items",
        });
      }
    };

    fetchMenuItems();
  }, [activeMenuId]);

  const updateMenu = (updatedMenu) => {
    setMenus(
      menus.map((menu) => (menu._id === updatedMenu._id ? updatedMenu : menu)),
    );
  };

  const updateMenuItem = (updatedMenuItem) => {
    setMenuItems(
      menuItems.map((item) =>
        item._id === updatedMenuItem._id ? updatedMenuItem : item,
      ),
    );
  };

  // Create new menu
  const handleCreateMenu = async (data) => {
    try {
      const response = await axios.post(API_ROUTES.PARTNER.MENUS, data);
      setMenus([...menus, response.data]);
      setActiveMenuId(response.data._id);
      toast.success("Success", {
        description: "Menu created successfully",
      });
    } catch (error) {
      console.error("Error creating menu:", error);
      toast.error("Error", {
        description: "Failed to create menu",
      });
    }
  };

  // Update menu
  const handleUpdateMenu = async (data) => {
    try {
      const response = await axios.put(
        API_ROUTES.PARTNER.MENU(activeMenuId),
        data,
      );

      updateMenu(response.data);
      toast.success("Success", {
        description: "Menu updated successfully",
      });
    } catch (error) {
      console.error("Error update menu:", error);
      toast.error("Error", {
        description: "Failed to update menu",
      });
    }
  };

  // Create new menu item
  const handleCreateMenuItem = async (data) => {
    try {
      const response = await axios.post(
        API_ROUTES.PARTNER.MENU_ITEMS(activeMenuId),
        data,
      );

      setMenuItems([...menuItems, response.data]);
      toast.success("Success", {
        description: "Menu item created successfully",
      });
    } catch (error) {
      console.error("Error creating menu item:", error);
      toast.error("Error", {
        description: "Failed to create menu item",
      });
    }
  };

  // Handle update menu item
  const handleUpdateMenuItem = async (id, data) => {
    try {
      const response = await axios.put(
        API_ROUTES.PARTNER.MENU_ITEM(activeMenuId, id),
        data,
      );
      updateMenuItem(response.data);
      toast.success("Success", {
        description: "Menu updated successfully",
      });
    } catch (error) {
      console.error("Error update menu:", error);
      toast.error("Error", {
        description: "Failed to update menu",
      });
    }
  };

  // Handle menu deletion
  const handleDeleteMenu = async (menuId) => {
    try {
      await axios.delete(API_ROUTES.PARTNER.MENU(menuId));
      setMenus(menus.filter((menu) => menu._id !== menuId));

      if (activeMenuId === menuId) {
        setActiveMenuId(menus.length > 1 ? menus[0]._id : null);
      }

      toast.success("Success", {
        description: "Menu deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting menu:", error);
      toast.error("Error", {
        description: "Failed to delete menu",
      });
    }
  };

  // Handle menu item deletion
  const handleDeleteMenuItem = async (itemId) => {
    try {
      await axios.delete(API_ROUTES.PARTNER.MENU_ITEM(activeMenuId, itemId));
      setMenuItems(menuItems.filter((item) => item._id !== itemId));

      toast.success("Success", {
        description: "Menu item deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast.error("Error", {
        description: "Failed to delete menu item",
      });
    }
  };

  if (!restaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">No Restaurant Found</h1>
        <p className="mb-4">
          You need to create a restaurant first before managing menus.
        </p>
        <Button asChild>
          <a href="/partner/new">Create Restaurant</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Menu Management</h1>
          <p className="text-muted-foreground">
            Manage your restaurant menus and items
          </p>
        </div>
        <MenuDialog
          handleSubmit={handleCreateMenu}
          options={branchesOptions}
          type="create"
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Menu
          </Button>
        </MenuDialog>
      </div>

      {menus.length === 0 ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>No Menus Found</CardTitle>
            <CardDescription>
              Create your first menu to start adding items
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <MenuDialog
              handleSubmit={handleCreateMenu}
              options={branchesOptions}
              type="create"
            >
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Menu
              </Button>
            </MenuDialog>
          </CardFooter>
        </Card>
      ) : (
        <Tabs value={activeMenuId} onValueChange={setActiveMenuId}>
          <MenuTabsList menus={menus} />

          {menus.map((menu) => (
            <TabsContent key={menu._id} value={menu._id}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{menu.name}</h2>
                <div className="flex space-x-2">
                  <MenuItemDialog
                    handleSubmit={handleCreateMenuItem}
                    type="create"
                  >
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Add Menu Item
                    </Button>
                  </MenuItemDialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="grid grid-cols-1"
                    >
                      <DropdownMenuLabel>Menu Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {activeMenu && activeMenuId && (
                        <MenuDialog
                          handleSubmit={handleUpdateMenu}
                          options={branchesOptions}
                          type="update"
                          defaultValues={{
                            name: activeMenu.name,
                            isAvailable: activeMenu.isAvailable,
                            branches: activeMenu.branches,
                          }}
                        >
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit Menu
                          </DropdownMenuItem>
                        </MenuDialog>
                      )}
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteMenu(menu._id)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete Menu
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {menuItems.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Items Found</CardTitle>
                    <CardDescription>
                      Add items to this menu to make them available to customers
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <MenuItemDialog
                      handleSubmit={handleCreateMenuItem}
                      type="create"
                    >
                      <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Menu Item
                      </Button>
                    </MenuItemDialog>
                  </CardFooter>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map((item) => (
                    <MenuItemCard
                      key={item._id}
                      item={item}
                      actions={{ handleUpdateMenuItem, handleDeleteMenuItem }}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
