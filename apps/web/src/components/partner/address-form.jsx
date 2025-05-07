import { useEffect, useState, useRef } from "react";
import { Locate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import mapboxgl from "mapbox-gl";
import "../../css/mapbox-gl.css";
import config from "../../config";
import { cn } from "@/lib/utils";

// TODO: use this component when creating new restaurant
export function AddressForm({ form, className }) {
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const markerRef = useRef(null);
  const [isLocating, setIsLocating] = useState(false);
  const initialPosition = [74.31467, 31.51364]; // [longitude, latitude]

  const updateLocationInForm = (longitude, latitude) => {
    form.setValue("address.location", {
      type: "Point",
      coordinates: [longitude, latitude],
    });
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
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${config.MAPBOX_TOKEN}`,
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const addressComponents = data.features[0].context || [];

        // Extract address components
        let street = data.features[0].place_name?.split(",")[0] || "";
        let city = "";
        let state = "";
        let zipCode = "";

        addressComponents.forEach((component) => {
          if (component.id.includes("place")) {
            city = component.text;
          } else if (component.id.includes("region")) {
            state = component.text;
          } else if (component.id.includes("postcode")) {
            zipCode = component.text;
          }
        });

        // Update form fields
        form.setValue("address.street", street);
        form.setValue("address.city", city);
        form.setValue("address.state", state);
        form.setValue("address.zipCode", zipCode);
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

            // Optionally: Reverse geocode to fill address fields
            fetchAddressFromCoordinates(longitude, latitude);
          }

          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
          // Add error handling UI here
        },
        { enableHighAccuracy: true },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setIsLocating(false);
      // Add error handling UI here
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = config.MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: initialPosition,
      zoom: 9.86,
    });

    mapRef.current.on("load", () => {
      // Add initial marker
      updateMarker(initialPosition);

      // Add click handler to update location
      mapRef.current.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        updateMarker([lng, lat]);
        updateLocationInForm(lng, lat);

        // Optionally: Reverse geocode to fill address fields
        fetchAddressFromCoordinates(lng, lat);
      });

      // Add navigation controls
      mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-left");
    });

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }

      mapRef.current.remove();
    };
  }, []);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Map container */}
      <div className="relative">
        <div
          ref={mapContainerRef}
          className="w-full h-[300px] rounded-md border border-gray-300 bg-gray-100"
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
          name="address.street"
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
            name="address.city"
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
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address.state"
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
          name="address.zipCode"
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
          name="address.location"
          render={() => <div className="hidden"></div>}
        />
      </div>
    </div>
  );
}
