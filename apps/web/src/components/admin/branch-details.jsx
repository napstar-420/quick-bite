import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, User, Users, Globe, Clock } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import config from "../../config";

// You should replace this with your actual MapBox access token
// Better to store this in environment variables
mapboxgl.accessToken = config.MAPBOX_TOKEN;

export default function BranchDetails({ branch }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!branch || !branch.address || !branch.address.location) return;

    // Extract coordinates from branch data
    const { coordinates } = branch.address.location;

    // Only initialize the map once
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: coordinates, // [longitude, latitude]
        zoom: 15
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Add event listener for when map is fully loaded
      map.current.on("load", () => {
        setMapLoaded(true);
      });
    } else {
      // If map is already initialized, just update the center
      map.current.setCenter(coordinates);
    }

    // Add marker when map is fully loaded
    if (mapLoaded && map.current) {
      // Create a new marker
      new mapboxgl.Marker({ color: "#FF0000" })
        .setLngLat(coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${branch.name}</h3>
            <p>${branch.address.street}, ${branch.address.city}</p>`
          )
        )
        .addTo(map.current);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        // Remove the map instance when component unmounts
        map.current.remove();
        map.current = null;
      }
    };
  }, [branch, mapLoaded]);

  if (!branch) return null;

  // Format opening hours for display
  const formatOpeningHours = (openingHours) => {
    if (!openingHours || !openingHours.length) return "No opening hours provided";

    return openingHours.map((hours, index) => (
      <div key={index} className="flex gap-1 text-sm">
        <span className="font-medium capitalize">{hours.days.join(", ")}:</span>
        <span>{hours.from} - {hours.to}</span>
      </div>
    ));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Branch Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Address</h3>
                <p className="text-sm">
                  {branch.address?.street}, {branch.address?.city}, {branch.address?.state}, {branch.address?.zipCode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Contact</h3>
                <p className="text-sm">{branch.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Manager</h3>
                <p className="text-sm">{branch.manager || "Not assigned"}</p>
              </div>
            </div>

            {branch.staff && branch.staff.length > 0 && (
              <div className="flex items-start gap-2">
                <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Staff</h3>
                  <p className="text-sm">{branch.staff.length} staff members</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium">Opening Hours</h3>
                <div className="mt-1">
                  {formatOpeningHours(branch.openingHours)}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Status</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant={
                  branch.status === "approved" ? "success" :
                  branch.status === "pending" ? "warning" :
                  branch.status === "rejected" ? "destructive" :
                  branch.status === "closed" ? "secondary" :
                  branch.status === "suspended" ? "outline" :
                  "secondary"
                }>
                  {branch.status}
                </Badge>
                {branch.isActive !== undefined && (
                  <Badge variant={branch.isActive ? "success" : "secondary"}>
                    {branch.isActive ? "Active" : "Inactive"}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* MapBox container */}
          <div className="mt-4 border rounded-md overflow-hidden">
            <div
              ref={mapContainer}
              className="h-72 w-full"
            />
            <div className="text-xs text-muted-foreground p-2 border-t">
              {branch.address?.location?.coordinates ? (
                <p>Coordinates: {branch.address.location.coordinates[1]}, {branch.address.location.coordinates[0]}</p>
              ) : (
                <p>No coordinates available for this branch</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
