import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartItemDetails,
  selectCartTotal,
  // Commented out since it's not currently used but might be needed later
  // selectActiveBranchId,
} from "../features/cart/cartSlice";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { toast } from "sonner";
import { ArrowLeft, MapPin } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import config from "../config";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import axios from '../services/axios'
import { cityCoordinates } from "../lib/city-coordinates";
import { setAddress } from "../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { UpdatePersonalDetails } from "../components/update-personal-details";

// Set Mapbox access token
mapboxgl.accessToken = config.MAPBOX_TOKEN;

// Address schema without strict validation for development
const addressSchema = z.object({
  street: z.string().min(1, { message: "Street is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.array(z.number()).length(2, { message: "Location is required" }),
  }),
  floor: z.string().optional(),
  note: z.string().optional(),
  addressLabel: z.string().optional(),
});

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const itemDetails = useSelector(selectCartItemDetails);
  const cartTotal = useSelector(selectCartTotal);
  const { user } = useAuth();
  // const activeBranchId = useSelector(selectActiveBranchId);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [activeBranchDetails] = useState({
    restaurant: { name: "Broadway Pizza" },
    name: "MM Alam Road",
  });

  const [addressLabel, setAddressLabel] = useState(user?.address?.label || "home");
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);

  // Map refs
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const markerRef = useRef(null);
  const [isLocating, setIsLocating] = useState(false);

  // Default coordinates for Lahore
  const [coordinates, setCoordinates] = useState(user?.address?.location?.coordinates || []);

  // Setup form with React Hook Form
  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: user?.address?.street || "",
      city: user?.address?.city || "Lahore",
      state: user?.address?.state || "Punjab",
      country: user?.address?.country || "Pakistan",
      floor: user?.address?.floor || "",
      note: user?.address?.note || "",
      addressLabel,
      location: { type: "Point", coordinates: user?.address?.location?.coordinates || [] },
    },
  });
  const [riderTip, setRiderTip] = useState(0);

  // Dummy delivery fee and service fee
  const deliveryFee = 119;
  const serviceFee = 12.87;

  const updateLocationInForm = (longitude, latitude) => {
    setCoordinates([longitude, latitude]);
    form.setValue("location", { type: "Point", coordinates: [longitude, latitude] });
  };

  const updateMarker = (lngLat) => {
    if (markerRef.current) {
      markerRef.current.setLngLat(lngLat);
    } else if (mapRef.current) {
      markerRef.current = new mapboxgl.Marker({
        color: "red",
        draggable: true,
      })
        .setLngLat(lngLat)
        .addTo(mapRef.current);
    }
  };

  const fetchAddressFromCoordinates = async (longitude, latitude) => {
    try {
      // Using Mapbox Geocoding API
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${config.MAPBOX_TOKEN}`,
      );

      const data = response.data;

      if (data.features && data.features.length > 0) {
        // Extract address components
        let street = data.features[0].place_name?.split(",")[0] || "";

        // Update form fields
        form.setValue("street", street);
      }
    } catch (error) {
      console.error("Error fetching address data:", error);
    }
  };

  const locateMe = () => {
    setIsLocating(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;

          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [longitude, latitude],
              zoom: 15,
              essential: true,
            });

            updateMarker([longitude, latitude]);
            updateLocationInForm(longitude, latitude);

            // Reverse geocode to fill address fields
            fetchAddressFromCoordinates(longitude, latitude);
          }

          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
          toast.error("Could not get your location. Please try again.");
        },
        { enableHighAccuracy: true },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLocating(false);
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = config.MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: coordinates || cityCoordinates.lahore,
      zoom: 9.86,
    });

    mapRef.current.on("load", () => {
      // Add initial marker
      if (coordinates.length > 0) {
        updateMarker(coordinates);
      }

      // Add click handler to update location
      mapRef.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        updateMarker([lng, lat]);
        updateLocationInForm(lng, lat);

        // Reverse geocode to fill address fields
        fetchAddressFromCoordinates(lng, lat);
      });

      // Add navigation controls
      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-left");
    });

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }

      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  // Check if cart is empty and redirect to cart page
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const handleSubmitOrder = () => {
    const street = form.getValues("street");
    if (!street || !street.trim()) {
      toast.error("Please enter your street address");
      return;
    }

    setIsPlacingOrder(true);

    // Simulate order placement
    setTimeout(() => {
      toast.success("Order placed successfully!");
      navigate("/order-confirmation");
      setIsPlacingOrder(false);
    }, 2000);
  };

  const handleTipSelection = (amount) => {
    setRiderTip(amount);
  };

  const handleUpdateAddress = async (data) => {
    setIsUpdatingAddress(true);
    try {
      // Make sure we have a user ID
      if (!user || !user.id) {
        toast.error("User information is missing");
        return;
      }

      // Send only the address data to update
      const response = await axios.put(`/user/${user._id}`, {
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          country: data.country,
          floor: data.floor || "",
          note: data.note || "",
          label: data.addressLabel || addressLabel,
          location: data.location
        }
      });

      if (response.status === 200) {
        toast.success("Delivery address updated successfully");
        dispatch(setAddress(response.data.address));
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error(error.response?.data?.message || "Failed to update delivery address");
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  // If cart is empty, don't render anything while redirecting
  if (cartItems.length === 0) {
    return null;
  }

  const addressLabels = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "work", icon: "💼", label: "Work" },
    { id: "partner", icon: "👥", label: "Partner" },
    { id: "other", icon: "➕", label: "Other" },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/cart">
            <ArrowLeft className="h-4 w-4" /> Back to cart
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Delivery Address, Options, Personal Details, Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-semibold">Delivery address</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={locateMe}
                disabled={isLocating}
                className="gap-1"
              >
                <MapPin className="h-4 w-4" /> Locate me
              </Button>
            </CardHeader>
            <CardContent>
              {/* Mapbox Map */}
              <div
                ref={mapContainerRef}
                className="w-full h-[250px] rounded-md mb-4 relative"
              />

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleUpdateAddress)}>
                  <div className="space-y-4">
                    <p className="text-sm text-red-500 mb-2">
                      Currently we only deliver to Lahore
                    </p>
                    <div>
                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 Main St"
                                className="h-10 rounded-md"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Lahore"
                              className="h-10 rounded-md"
                              {...field}
                              disabled
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="floor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Floor</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="1"
                              className="h-10 rounded-md"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="note"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Note</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Note to rider - e.g. building, landmark"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <p className="text-sm mb-2">Add a label</p>
                      <div className="flex gap-3">
                        {addressLabels.map((item) => (
                          <Button
                            key={item.id}
                            type="button"
                            variant={
                              addressLabel === item.id
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => {
                              setAddressLabel(item.id);
                              form.setValue("addressLabel", item.id);
                            }}
                            className="rounded-full"
                          >
                            <span className="mr-1">{item.icon}</span>{" "}
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <p className="text-red-500 text-sm">{form.formState.errors.location?.coordinates?.message}</p>

                    <Button
                      type="submit"
                      className="w-full bg-brand-primary hover:bg-brand-primary/90"
                      disabled={isUpdatingAddress || form.formState.isSubmitting}
                    >
                      {isUpdatingAddress ? "Updating..." : "Update address"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Personal Details */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <h2 className="text-xl font-semibold">Personal details</h2>
              <UpdatePersonalDetails>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </UpdatePersonalDetails>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">{user?.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <h2 className="text-xl font-semibold">Payment</h2>
            </CardHeader>
            <CardContent className="pt-0">
              <RadioGroup defaultValue="cash">
                {/* <div className="flex items-center justify-between py-2 px-3 rounded-md mb-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" disabled />
                    <Label htmlFor="card" className="flex items-center gap-2">
                      <span className="text-xs border border-gray-200 px-2 py-1 rounded">VISA</span>
                      <span className="text-xs">**** **** **** 9065</span>
                    </Label>
                  </div>
                </div> */}

                <div className="flex items-center justify-between py-2 px-3 rounded-md bg-gray-50 border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2">
                      <span className="text-xs border border-gray-200 px-2 py-1 rounded">
                        💵
                      </span>
                      <span>Cash on Delivery</span>
                    </Label>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Primary
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Simply pay the driver when he delivers the food to your
                  doorstep.
                </p>
              </RadioGroup>

              {/* <div className="mt-6 border-t pt-4">
                <Button variant="outline" className="w-full flex gap-2 items-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 6H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 14H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 18H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Apply a voucher
                </Button>
              </div> */}
            </CardContent>
          </Card>

          {/* Rider Tip */}
          <Card>
            <CardHeader className="border-b pb-4">
              <h2 className="text-xl font-semibold">Tip your rider</h2>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-600 mb-4">
                Your rider receives 100% of the tip
              </p>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <Button
                  type="button"
                  variant={riderTip === 0 ? "default" : "outline"}
                  onClick={() => handleTipSelection(0)}
                >
                  No tip
                </Button>
                <Button
                  type="button"
                  variant={riderTip === 50 ? "default" : "outline"}
                  onClick={() => handleTipSelection(50)}
                >
                  Rs. 50.00
                </Button>
                <Button
                  type="button"
                  variant={riderTip === 100 ? "default" : "outline"}
                  onClick={() => handleTipSelection(100)}
                >
                  Rs. 100.00
                </Button>
                <Button
                  type="button"
                  variant={riderTip === 200 ? "default" : "outline"}
                  onClick={() => handleTipSelection(200)}
                >
                  Rs. 200.00
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center mb-4">
                Most common
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader className="border-b pb-4">
              <h2 className="text-xl font-semibold">Your order from</h2>
              <p className="font-medium text-brand-primary">
                {activeBranchDetails.restaurant.name} -{" "}
                {activeBranchDetails.name}
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => {
                  const details = itemDetails[item.itemId];
                  if (!details) return null;

                  return (
                    <div key={item.itemId} className="flex justify-between">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span>{item.quantity} ×</span>
                          <span className="font-medium">{details.name}</span>
                        </div>
                        {details.options &&
                          details.options.map((option, index) => (
                            <div
                              key={index}
                              className="text-sm text-gray-600 ml-5"
                            >
                              + {option}
                            </div>
                          ))}
                        {/* Example options based on the image */}
                        <div className="text-sm text-gray-600 ml-5">
                          + Thin Crust
                        </div>
                        <div className="text-sm text-gray-600 ml-5">
                          + Chicken Supreme
                        </div>
                        <div className="text-sm text-gray-600 ml-5">
                          + Top - 345ml
                        </div>
                        <div className="text-sm text-gray-600 ml-5">
                          + Mirinda - 345 ml
                        </div>
                      </div>
                      <div className="text-right">
                        <span>
                          Rs. {(details.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>Rs. {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Standard delivery</span>
                  <span>Rs. {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span>Rs. {serviceFee.toFixed(2)}</span>
                </div>
                {riderTip > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rider tip</span>
                    <span>Rs. {riderTip.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>
                    Rs.{" "}
                    {(cartTotal + deliveryFee + serviceFee + riderTip).toFixed(
                      2,
                    )}
                  </span>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  (incl. taxes and tips)
                </div>
              </div>

              <Button
                type="button"
                className="w-full mt-6 bg-brand-primary hover:bg-brand-primary/90"
                size="lg"
                onClick={handleSubmitOrder}
                disabled={isPlacingOrder || !form.getValues("street").trim()}
              >
                {isPlacingOrder ? "Processing..." : "Place order"}
              </Button>

              <p className="text-xs text-gray-500 mt-4">
                By making this purchase you agree to our terms and conditions.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                I agree that placing the order places no obligation to make a
                payment in accordance with the General Terms and Conditions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
