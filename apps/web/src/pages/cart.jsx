import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectCartItems,
  selectCartItemDetails,
  selectCartTotal,
  selectActiveBranchId,
  selectIsCartLoading,
  fetchCartItemDetails,
  updateQuantity,
  removeItem,
  clearCart,
} from "../features/cart/cartSlice";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ShoppingCart } from "lucide-react";
import { LoadingSpinner } from "../components/loading-spinner";
import { toast } from "sonner";

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const itemDetails = useSelector(selectCartItemDetails);
  const cartTotal = useSelector(selectCartTotal);
  const activeBranchId = useSelector(selectActiveBranchId);
  const isLoading = useSelector(selectIsCartLoading);
  const [activeBranchDetails, setActiveBranchDetails] = useState(null);

  // Fetch item details and active branch details when cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      const itemIds = cartItems.map(item => item.itemId);
      dispatch(fetchCartItemDetails(itemIds));
    }
  }, [cartItems, dispatch]);

  // Fetch branch details
  useEffect(() => {
    const fetchBranchDetails = async () => {
      if (activeBranchId) {
        try {
          // You would replace this with your actual API call
          const response = await fetch(`/restaurant/branch/${activeBranchId}`);
          if (response.ok) {
            const data = await response.json();
            setActiveBranchDetails(data);
          }
        } catch (error) {
          console.error("Error fetching branch details:", error);
        }
      }
    };

    fetchBranchDetails();
  }, [activeBranchId]);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    dispatch(updateQuantity({ itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeItem(itemId));
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      dispatch(clearCart());
      toast.success("Cart cleared");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <p className="text-muted-foreground max-w-md">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild className="mt-4">
              <Link to="/">Browse Restaurants</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b pb-4">
              <div className="flex justify-between items-center">
                <CardTitle>Items ({cartItems.length})</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-red-500 hover:text-red-700 border-red-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Cart
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <LoadingSpinner />
                </div>
              ) : (
                <div>
                  {cartItems.map((item) => {
                    const details = itemDetails[item.itemId];
                    if (!details) return null;

                    return (
                      <div
                        key={item.itemId}
                        className="p-4 border-b last:border-0 flex flex-col sm:flex-row gap-4 items-center"
                      >
                        <div className="w-24 h-24 rounded-md overflow-hidden bg-muted shrink-0">
                          {details.image ? (
                            <img
                              src={details.image}
                              alt={details.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{details.name}</h3>
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                            {details.description}
                          </p>
                          <div className="text-brand-primary font-medium">
                            Rs. {details.price}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleUpdateQuantity(item.itemId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleUpdateQuantity(item.itemId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
                            onClick={() => handleRemoveItem(item.itemId)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader className="border-b">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {activeBranchDetails && (
                <div className="mb-4 pb-4 border-b">
                  <h3 className="font-medium mb-2">Delivery from:</h3>
                  <p className="text-brand-primary font-medium">
                    {activeBranchDetails.restaurant?.name || "Restaurant"} - {activeBranchDetails.name || "Branch"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activeBranchDetails.address?.street || "Address not available"}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rs. {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>Rs. 50.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span>Rs. 10.00</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col border-t pt-6">
              <div className="flex justify-between w-full mb-6">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-semibold text-lg">
                  Rs. {(cartTotal + 60).toFixed(2)}
                </span>
              </div>
              <Button
                className="w-full bg-brand-primary hover:bg-brand-primary/90"
                size="lg"
                asChild
                disabled={isLoading}
              >
                <Link to="/checkout">
                  Proceed to Checkout
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
