import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, MoreVertical, Trash, Edit, ImagePlus } from "lucide-react";
import axios from "../../services/axios";
import { usePartner } from "../../hooks/usePartner";
import { CreateMenuDialog } from "../../components/partner/create-menu-dialog";
import { API_ROUTES } from "../../lib/constants";

export default function PartnerMenuManagement() {
  const { restaurant, branches } = usePartner();

  const [loading, setLoading] = useState(true);
  const [menus, setMenus] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const [openNewMenuDialog, setOpenNewMenuDialog] = useState(false);
  const [openNewItemDialog, setOpenNewItemDialog] = useState(false);
  const [openEditMenuDialog, setOpenEditMenuDialog] = useState(false);
  const [openEditItemDialog, setOpenEditItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const branchesOptions = branches.map(({ name, _id }) => {
    return {
      label: name, value: _id
    }
  })

  // Form states
  const [menuForm, setMenuForm] = useState({
    name: "",
    isAvailable: true,
  });

  const [menuItemForm, setMenuItemForm] = useState({
    name: "",
    description: "",
    price: "",
    isAvailable: true,
    image: "",
  });

  // Fetch menus
  useEffect(() => {
    const fetchMenus = async () => {
      if (!restaurant) return;

      try {
        const response = await axios.get(API_ROUTES.PARTNER.MENUS);

        setMenus(response.data);
        if (response.data.length > 0) {
          setActiveMenu(response.data[0]._id);
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
      if (!activeMenu) return;

      try {
        const response = await axios.get(
          `/api/partner/menus/${activeMenu}/items`,
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
  }, [activeMenu]);

  // Create new menu
  const handleCreateMenu = async (data) => {
    try {
      await axios.post(
        API_ROUTES.PARTNER.MENUS,
        data
      );

      setOpenNewMenuDialog(false);

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

  // Create new menu item
  const handleCreateMenuItem = async () => {
    try {
      const response = await axios.post(
        `/api/partner/menus/${activeMenu}/items`,
        {
          name: menuItemForm.name,
          description: menuItemForm.description,
          price: parseFloat(menuItemForm.price),
          isAvailable: menuItemForm.isAvailable,
          image: menuItemForm.image,
          restaurant: restaurant._id,
        },
      );

      setMenuItems([...menuItems, response.data]);
      setOpenNewItemDialog(false);
      setMenuItemForm({
        name: "",
        description: "",
        price: "",
        isAvailable: true,
        image: "",
      });

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

  // Handle menu deletion
  const handleDeleteMenu = async (menuId) => {
    try {
      await axios.delete(`/api/partner/menus/${menuId}`);
      setMenus(menus.filter((menu) => menu._id !== menuId));

      if (activeMenu === menuId) {
        setActiveMenu(menus.length > 1 ? menus[0]._id : null);
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
      await axios.delete(`/api/partner/items/${itemId}`);
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
        <Button onClick={() => setOpenNewMenuDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Menu
        </Button>
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
            <Button onClick={() => setOpenNewMenuDialog(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Menu
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Tabs value={activeMenu} onValueChange={setActiveMenu}>
          <div className="flex justify-between items-center mb-4">
            <TabsList
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${menus.length}, minmax(0, 1fr))`,
              }}
            >
              {menus.map((menu) => (
                <TabsTrigger key={menu._id} value={menu._id}>
                  {menu.name} {!menu.isAvailable && "(Hidden)"}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {menus.map((menu) => (
            <TabsContent key={menu._id} value={menu._id}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{menu.name}</h2>
                <div className="flex space-x-2">
                  <Button onClick={() => setOpenNewItemDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Menu Item
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Menu Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setMenuForm({
                            name: menu.name,
                            isAvailable: menu.isAvailable,
                          });
                          setSelectedItem(menu);
                          setOpenEditMenuDialog(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit Menu
                      </DropdownMenuItem>
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
                    <Button onClick={() => setOpenNewItemDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Menu Item
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map((item) => (
                    <Card key={item._id}>
                      <div className="relative">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-40 object-cover rounded-t-lg"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-t-lg">
                            <ImagePlus className="h-10 w-10 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="secondary" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>
                                Item Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setMenuItemForm({
                                    name: item.name,
                                    description: item.description || "",
                                    price: item.price.toString(),
                                    isAvailable: item.isAvailable,
                                    image: item.image || "",
                                  });
                                  setSelectedItem(item);
                                  setOpenEditItemDialog(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit Item
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteMenuItem(item._id)}
                              >
                                <Trash className="mr-2 h-4 w-4" /> Delete Item
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{item.name}</CardTitle>
                          <div className="text-xl font-bold">
                            ${item.price.toFixed(2)}
                          </div>
                        </div>
                        {!item.isAvailable && (
                          <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                            Not Available
                          </span>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-2">
                          {item.description || "No description provided"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Create Menu Dialog */}
      <CreateMenuDialog
        open={openNewMenuDialog}
        setOpen={setOpenNewMenuDialog}
        handleSubmit={handleCreateMenu}
        options={branchesOptions}
      />

      {/* Create Menu Item Dialog */}
      <Dialog open={openNewItemDialog} onOpenChange={setOpenNewItemDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
            <DialogDescription>Add a new item to your menu</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="item-name">Item Name</Label>
              <Input
                id="item-name"
                value={menuItemForm.name}
                onChange={(e) =>
                  setMenuItemForm({ ...menuItemForm, name: e.target.value })
                }
                placeholder="e.g., Chicken Burger"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-description">Description</Label>
              <Textarea
                id="item-description"
                value={menuItemForm.description}
                onChange={(e) =>
                  setMenuItemForm({
                    ...menuItemForm,
                    description: e.target.value,
                  })
                }
                placeholder="Describe your menu item"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-price">Price ($)</Label>
              <Input
                id="item-price"
                type="number"
                min="0"
                step="0.01"
                value={menuItemForm.price}
                onChange={(e) =>
                  setMenuItemForm({ ...menuItemForm, price: e.target.value })
                }
                placeholder="9.99"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="item-image">Image URL</Label>
              <Input
                id="item-image"
                value={menuItemForm.image}
                onChange={(e) =>
                  setMenuItemForm({ ...menuItemForm, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="item-available"
                checked={menuItemForm.isAvailable}
                onCheckedChange={(checked) =>
                  setMenuItemForm({ ...menuItemForm, isAvailable: checked })
                }
              />
              <Label htmlFor="item-available">Available</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenNewItemDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateMenuItem}
              disabled={!menuItemForm.name.trim() || !menuItemForm.price}
            >
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Menu Dialog */}
      <Dialog open={openEditMenuDialog} onOpenChange={setOpenEditMenuDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu</DialogTitle>
            <DialogDescription>Update your menu details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-menu-name">Menu Name</Label>
              <Input
                id="edit-menu-name"
                value={menuForm.name}
                onChange={(e) =>
                  setMenuForm({ ...menuForm, name: e.target.value })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-menu-available"
                checked={menuForm.isAvailable}
                onCheckedChange={(checked) =>
                  setMenuForm({ ...menuForm, isAvailable: checked })
                }
              />
              <Label htmlFor="edit-menu-available">Available</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenEditMenuDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Update menu logic here
                setOpenEditMenuDialog(false);
              }}
              disabled={!menuForm.name.trim()}
            >
              Update Menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Menu Item Dialog */}
      <Dialog open={openEditItemDialog} onOpenChange={setOpenEditItemDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>Update your menu item details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-item-name">Item Name</Label>
              <Input
                id="edit-item-name"
                value={menuItemForm.name}
                onChange={(e) =>
                  setMenuItemForm({ ...menuItemForm, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-item-description">Description</Label>
              <Textarea
                id="edit-item-description"
                value={menuItemForm.description}
                onChange={(e) =>
                  setMenuItemForm({
                    ...menuItemForm,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-item-price">Price ($)</Label>
              <Input
                id="edit-item-price"
                type="number"
                min="0"
                step="0.01"
                value={menuItemForm.price}
                onChange={(e) =>
                  setMenuItemForm({ ...menuItemForm, price: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-item-image">Image URL</Label>
              <Input
                id="edit-item-image"
                value={menuItemForm.image}
                onChange={(e) =>
                  setMenuItemForm({ ...menuItemForm, image: e.target.value })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-item-available"
                checked={menuItemForm.isAvailable}
                onCheckedChange={(checked) =>
                  setMenuItemForm({ ...menuItemForm, isAvailable: checked })
                }
              />
              <Label htmlFor="edit-item-available">Available</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenEditItemDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // Update item logic here
                setOpenEditItemDialog(false);
              }}
              disabled={!menuItemForm.name.trim() || !menuItemForm.price}
            >
              Update Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
