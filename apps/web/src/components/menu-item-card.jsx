import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Store, ImagePlus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import PropTypes from "prop-types";
import { useState } from "react";
import { MenuItemDialog } from "./menu-item-dialog";

export function MenuItemCard({ menuItem, branchId }) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleCardClick = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        className="overflow-hidden h-full flex flex-col justify-between py-0 px-2 pb-2 bg-secondary hover:bg-brand-primary/10 cursor-pointer hover:scale-105 transition-all duration-300 text-left"
        data-item-id={menuItem._id}
      >
        <div className="flex pt-2 justify-between items-start relative">
          <div className="w-28 aspect-square mr-4">
            {menuItem.image ? (
              <div className="relative rounded-md overflow-hidden">
                <img
                  src={menuItem.image}
                  alt={menuItem.name}
                  className="w-full h-full object-cover rounded-md"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md">
                <ImagePlus className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col h-full">
            <h3 className="font-semibold text-lg mb-1">{menuItem.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-rose-600 font-medium">
                Rs. {menuItem.price}
              </span>
              {menuItem.originalPrice && (
                <span className="text-gray-500 text-sm line-through">
                  Rs. {menuItem.originalPrice}
                </span>
              )}
            </div>
            {menuItem.description && (
              <p className="text-sm text-gray-500 my-2 line-clamp-2">
                {menuItem.description}
              </p>
            )}

            {menuItem.restaurant && (
              <Badge variant="outline" className="mt-auto bg-white">
                <Store className="mr-1" />
                {menuItem.restaurant}
              </Badge>
            )}
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-0 rounded-full bg-brand-primary hover:bg-brand-primary/80 text-white"
            title="Add to cart"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              setOpenDialog(true);
            }}
          >
            <Plus />
          </Button>
        </div>
      </Card>

      {/* Dialog component outside the card to avoid click bubbling issues */}
      <MenuItemDialog
        menuItem={menuItem}
        branchId={branchId}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </>
  );
}

MenuItemCard.propTypes = {
  menuItem: PropTypes.object.isRequired,
  branchId: PropTypes.string
};
