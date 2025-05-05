import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { CheckCircle, Clock, MapPin, ClipboardList } from "lucide-react";

export default function OrderConfirmationPage() {
  // Generate a random order number
  const orderNumber = `QB${Math.floor(10000 + Math.random() * 90000)}`;

  // Estimated delivery time (30-45 minutes from now)
  const now = new Date();
  const deliveryStart = new Date(now.getTime() + 30 * 60000);
  const deliveryEnd = new Date(now.getTime() + 45 * 60000);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <Card className="border-none shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl md:text-3xl">Order Confirmed!</CardTitle>
          <p className="text-gray-500 mt-2">
            Your order has been placed successfully
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-500">Order Number</div>
              <div className="font-semibold">{orderNumber}</div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 py-2">
              <div className="flex-1 flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <p className="font-medium">
                    {formatTime(deliveryStart)} - {formatTime(deliveryEnd)}
                  </p>
                </div>
              </div>

              <div className="flex-1 flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="font-medium">Lahore</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <ClipboardList className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Order Details</p>
                <p className="font-medium mt-1">Broadway Pizza - MM Alam Road</p>
                <div className="mt-2">
                  <div className="text-sm">1 × Pepsi Strong Deal 1</div>
                  <div className="text-sm ml-4 text-gray-500">+ Thin Crust</div>
                  <div className="text-sm ml-4 text-gray-500">+ Chicken Supreme</div>
                  <div className="text-sm ml-4 text-gray-500">+ Top - 345ml</div>
                  <div className="text-sm ml-4 text-gray-500">+ Mirinda - 345 ml</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          <Button asChild className="w-full bg-brand-primary hover:bg-brand-primary/90">
            <Link to="/">
              Continue Shopping
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link to="/orders">
              View Order Status
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
