import { Edit, ImagePlus, MoreVertical, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MenuItemDialog } from "./menu-item-dialog";
import { Button } from "../ui/button";

export function MenuItemCard({ item, actions }) {
  return (
    <Card key={item._id} className="pt-0 pb-4">
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
              <DropdownMenuLabel>Item Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <MenuItemDialog
                handleSubmit={(data) =>
                  actions.handleUpdateMenuItem(item._id, data)
                }
                type="update"
                defaultValues={{
                  name: item.name,
                  description: item.description,
                  price: String(item.price),
                  image: item.image,
                  isAvailable: item.isAvailable,
                }}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4" /> Edit Item
                </DropdownMenuItem>
              </MenuItemDialog>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => actions.handleDeleteMenuItem(item._id)}
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
          <div className="text-xl font-bold">${item.price.toFixed(2)}</div>
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
  );
}
