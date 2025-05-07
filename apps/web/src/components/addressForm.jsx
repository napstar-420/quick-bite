import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { MapPin, Locate } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

// Import Leaflet CSS in your component or in a global CSS file
// You'll need to add these to your project:
// npm install leaflet react-leaflet

const addressSchema = z.object({
  street: z.string().min(3, { message: "Street is required" }),
  city: z.string().min(3, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(3, { message: "Zip code is required" }),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.array(z.number()).length(2),
  }),
});

export function AddressForm({ onSubmit }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  const form = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      location: {
        type: "Point",
        coordinates: [0, 0], // [longitude, latitude]
      },
    },
  });

  // Load Leaflet dynamically
  useEffect(() => {
    // Only load if not already loaded
    if (!window.L) {
      // Load Leaflet CSS
      const linkElement = document.createElement("link");
      linkElement.rel = "stylesheet";
      linkElement.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      linkElement.integrity =
        "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      linkElement.crossOrigin = "";
      document.head.appendChild(linkElement);

      // Load Leaflet JS
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
      script.crossOrigin = "";
      script.async = true;
      script.onload = () => {
        setLeafletLoaded(true);
      };
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(linkElement);
        document.head.removeChild(script);
      };
    } else {
      setLeafletLoaded(true);
    }
  }, []);

  // Initialize map when Leaflet is loaded
  useEffect(() => {
    if (leafletLoaded && mapRef.current && !map) {
      initializeMap();
    }
  }, [leafletLoaded, map]);

  const initializeMap = () => {
    if (!mapRef.current || !window.L) return;

    // Default to a central location (e.g., Lahore, Pakistan)
    const defaultLocation = [31.5204, 74.3587]; // [latitude, longitude]

    // Create map
    const mapInstance = window.L.map(mapRef.current).setView(
      defaultLocation,
      13,
    );

    // Add OpenStreetMap tile layer
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstance);

    // Create a marker
    const marker = window.L.marker(defaultLocation, {
      draggable: true,
    }).addTo(mapInstance);

    // Update form when marker is dragged
    marker.on("dragend", function () {
      const position = marker.getLatLng();
      updateLocationInForm(position.lng, position.lat);
      reverseGeocode(position.lat, position.lng);
    });

    // Update form when map is clicked
    mapInstance.on("click", function (e) {
      marker.setLatLng(e.latlng);
      updateLocationInForm(e.latlng.lng, e.latlng.lat);
      reverseGeocode(e.latlng.lat, e.latlng.lng);
    });

    setMap(mapInstance);
    markerRef.current = marker;

    // Initialize with default location
    updateLocationInForm(defaultLocation[1], defaultLocation[0]);
  };

  const updateLocationInForm = (longitude, latitude) => {
    form.setValue("location", {
      type: "Point",
      coordinates: [longitude, latitude],
    });
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      // Using Nominatim for reverse geocoding (OpenStreetMap's geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "AddressForm/1.0", // Nominatim requires a user agent
          },
        },
      );

      const data = await response.json();

      if (data && data.address) {
        const address = data.address;

        // Extract address components
        const street = [address.house_number || "", address.road || ""]
          .filter(Boolean)
          .join(" ");

        const city = address.city || address.town || address.village || "";
        const state = address.state || "";
        const zipCode = address.postcode || "";

        // Update form fields
        form.setValue("street", street);
        form.setValue("city", city);
        form.setValue("state", state);
        form.setValue("zipCode", zipCode);
      }
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
      toast.error("Could not retrieve address information");
    }
  };

  const locateMe = () => {
    setIsLocating(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Update map and marker
          if (map && markerRef.current) {
            map.setView([latitude, longitude], 16);
            markerRef.current.setLatLng([latitude, longitude]);

            // Update form
            updateLocationInForm(longitude, latitude);
            reverseGeocode(latitude, longitude);
          }

          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error(
            "Could not get your location. Please check your browser permissions.",
          );
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
      setIsLocating(false);
    }
  };

  const handleManualAddressChange = async () => {
    // Get address from form
    const street = form.getValues("street");
    const city = form.getValues("city");
    const state = form.getValues("state");
    const zipCode = form.getValues("zipCode");

    // Create address string
    const address = `${street}, ${city}, ${state} ${zipCode}`;

    try {
      // Using Nominatim for geocoding
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`,
        {
          headers: {
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "AddressForm/1.0", // Nominatim requires a user agent
          },
        },
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const location = data[0];
        const lat = parseFloat(location.lat);
        const lon = parseFloat(location.lon);

        // Update map and marker
        if (map && markerRef.current) {
          map.setView([lat, lon], 16);
          markerRef.current.setLatLng([lat, lon]);

          // Update form
          updateLocationInForm(lon, lat);
        }
      } else {
        toast.error("Could not find location for this address");
      }
    } catch (error) {
      console.error("Error in geocoding:", error);
      toast.error("Could not find location for this address");
    }
  };

  const handleSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className="container px-4 max-w-md">
      <Form {...form} className="w-full space-y-6">
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <h2 className="text-2xl font-medium text-center mb-6">
            Enter Branch Address
          </h2>

          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
            {/* Map container */}
            <div className="relative">
              <div
                ref={mapRef}
                className="w-full h-64 rounded-md border border-gray-300 bg-gray-100"
              ></div>

              <Button
                type="button"
                size="sm"
                onClick={locateMe}
                disabled={isLocating}
                className="absolute top-2 right-2 bg-white text-black hover:bg-gray-100 z-[1000]"
              >
                {isLocating ? (
                  <span className="flex items-center">
                    <Locate className="mr-1 h-4 w-4 animate-spin" /> Locating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Locate className="mr-1 h-4 w-4" /> Locate Me
                  </span>
                )}
              </Button>
            </div>

            <div className="space-y-4">
              {/* Street */}
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
                        onChange={(e) => {
                          field.onChange(e);
                          // Don't trigger geocoding on every keystroke
                        }}
                        onBlur={() => {
                          field.onBlur();
                          handleManualAddressChange();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City and State in one row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City"
                          className="h-10 rounded-md"
                          {...field}
                          onBlur={() => {
                            field.onBlur();
                            handleManualAddressChange();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="State"
                          className="h-10 rounded-md"
                          {...field}
                          onBlur={() => {
                            field.onBlur();
                            handleManualAddressChange();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Zip Code */}
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip/Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Zip Code"
                        className="h-10 rounded-md"
                        {...field}
                        onBlur={() => {
                          field.onBlur();
                          handleManualAddressChange();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Hidden location field */}
              <FormField
                control={form.control}
                name="location"
                render={() => <div className="hidden"></div>}
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md"
            >
              Save Address
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
