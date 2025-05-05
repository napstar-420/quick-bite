import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartItemDetails,
  selectCartTotal,
  selectIsCartLoading,
  fetchCartItemDetails,
  updateQuantity,
  removeItem
} from "../../features/cart/cartSlice";
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { LoadingSpinner } from "../loading-spinner";
import config from "../../config";
import { Link } from "react-router-dom";

export function CartSidebar() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const itemDetails = useSelector(selectCartItemDetails);
  const cartTotal = useSelector(selectCartTotal);
  const isLoading = useSelector(selectIsCartLoading);

  // Fetch item details when cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      const itemIds = cartItems.map(item => item.itemId);
      dispatch(fetchCartItemDetails(itemIds));
    }
  }, [cartItems, dispatch]);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    dispatch(updateQuantity({ itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <Card className="overflow-hidden pt-0">
        <CardHeader className="bg-brand-primary/5 py-4">
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center flex-col gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-brand-primary" />
            </div>
            <p className="text-gray-500 text-sm text-center">
              Add items to your cart to place an order
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden pt-0">
      <CardHeader className="bg-brand-primary/5 py-4">
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Your Cart {cartItems.length > 0 && `(${cartItems.length})`}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {cartItems.length > 0 ? (
              cartItems.map((item) => {
                const details = itemDetails[item.itemId];

                // Fallback in case details aren't loaded yet
                if (!details) {
                  return (
                    <div key={item.itemId} className="p-4 border-b last:border-0">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">Loading item...</h4>
                          <p className="text-brand-primary font-medium">Quantity: {item.quantity}</p>
                        </div>
                        <LoadingSpinner size="sm" />
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={item.itemId} className="p-4 border-b last:border-0">
                    <div className="flex justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{details.name}</h4>
                        <p className="text-brand-primary font-medium">Rs. {details.price}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleUpdateQuantity(item.itemId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-4 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => handleUpdateQuantity(item.itemId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveItem(item.itemId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-gray-500">No items in cart</div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-4 p-4 bg-muted/30">
        <div className="w-full flex justify-between font-medium">
          <span>Subtotal</span>
          <span>Rs. {cartTotal.toFixed(2)}</span>
        </div>
        <div className="w-full flex justify-between text-sm text-muted-foreground">
          <span>Delivery Fee</span>
          <span>Rs. 50.00</span>
        </div>
        <Separator />
        <div className="w-full flex justify-between font-bold">
          <span>Total</span>
          <span>Rs. {(cartTotal + 50).toFixed(2)}</span>
        </div>
        <Button asChild className="w-full bg-brand-primary hover:bg-brand-primary/90 mt-2">
          <Link to={config.ROUTES.CHECKOUT}>
            Proceed to Checkout
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
