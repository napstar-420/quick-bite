import { Minus, Plus, Check } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, selectActiveBranchId, selectItemInCart } from "../features/cart/cartSlice";
import { toast } from "sonner";

export function MenuItemDialog({ menuItem, children, branchId, openDialog, setOpenDialog }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const dispatch = useDispatch();
  const activeBranchId = useSelector(selectActiveBranchId);
  const itemInCart = useSelector((state) => selectItemInCart(state, menuItem._id));

  const handleAddToCart = () => {
    setIsAdding(true);

    try {
      // Check if item is from a different branch
      if (activeBranchId && branchId !== activeBranchId) {
        const confirmed = window.confirm(
          "Adding items from a different restaurant will clear your current cart. Continue?"
        );

        if (!confirmed) {
          setIsAdding(false);
          return;
        }
      }

      dispatch(
        addItem({
          itemId: menuItem._id,
          quantity,
          branchId,
        })
      );

      toast.success(`${quantity} ${menuItem.name} added to cart`);

      // Close dialog after a brief delay to show success state
      setTimeout(() => {
        setOpenDialog(false);
        setQuantity(1);
        setIsAdding(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setIsAdding(false);
      toast.error("Failed to add item to cart");
    }
  };

  // Function to handle dialog close attempts
  const handleOpenChange = (open) => {
    // If dialog is being closed and item is currently being added, prevent closing
    if (!open && isAdding) {
      return;
    }

    // Otherwise allow the state change
    setOpenDialog(open);

    // Reset quantity if dialog is closed
    if (!open) {
      setQuantity(1);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="pt-0 px-0 border-0 w-lg overflow-hidden">
        <div className="w-full aspect-video overflow-hidden">
          <img
            src={menuItem.image?.split("?")[0]}
            alt={menuItem.name}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="p-4 pb-0 bg-background">
          <DialogHeader>
            <DialogTitle className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0">
              {menuItem.name} -&nbsp;
              <span className="text-brand-primary">Rs {menuItem.price}</span>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-muted-foreground">
            {menuItem.description}
          </DialogDescription>

          {itemInCart && (
            <div className="mt-4 bg-brand-primary/10 text-brand-primary p-2 rounded-md flex items-center">
              <Check className="mr-2 h-4 w-4" />
              <span>{itemInCart.quantity} in cart</span>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 gap-4 pb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setQuantity(quantity - 1)}
                disabled={quantity === 1 || isAdding}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setQuantity(quantity + 1)}
                disabled={isAdding}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              variant="default"
              className="flex-1 bg-brand-primary font-semibold hover:bg-brand-primary/80"
              onClick={handleAddToCart}
              disabled={isAdding}
            >
              {isAdding ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                `Add to cart - Rs ${menuItem.price * quantity}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
