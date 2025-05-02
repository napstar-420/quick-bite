import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Coffee,
  Search,
  Plus,
  Grid2X2,
  List,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import axios from '../../services/axios';
import { API_ROUTES } from "../../lib/constants";
import { NoRestaurantsFound } from "../../components/admin/no-restaurants-found";
import { RestaurantsTable } from "../../components/admin/restaurants-table";
import { RestaurantCard } from "../../components/admin/restaurant-card";
import { RestaurantApplicationsTable } from "../../components/admin/restaurant-applications-table";
import { NoRestaurantsPendingApplications } from "../../components/admin/no-restaurants-pending-applications";

export default function RestaurantsManagement() {
  const [view, setView] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const fetchRestaurants = async () => {
      const response = await axios.get(API_ROUTES.ADMIN.RESTAURANTS, {
        signal: controller.signal,
      });
      setRestaurants(response.data);
    };

    fetchRestaurants();

    return () => controller.abort();
  }, []);

  // Filter restaurants based on search term and filters
  const filteredRestaurants = restaurants.filter(
    (restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCuisine =
        cuisineFilter === "" || restaurant.cuisine === cuisineFilter;
      const matchesStatus =
        statusFilter === "" || restaurant.status === statusFilter;

      return matchesSearch && matchesCuisine && matchesStatus;
    },
  );

  // Get unique cuisines for filter dropdown
  const cuisines = [...new Set(restaurants.map((r) => r.cuisine))];
  const statuses = [...new Set(restaurants.map((r) => r.status))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Restaurant Management
        </h1>
        <Button className="bg-brand-primary hover:bg-brand-primary/90">
          <Plus className="w-4 h-4 mr-2" /> Add New Restaurant
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Restaurants</TabsTrigger>
          <TabsTrigger value="applications">New Applications</TabsTrigger>
          <TabsTrigger value="featured">Featured Restaurants</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Restaurant Directory</CardTitle>
              <CardDescription>
                Manage all restaurants on the platform
              </CardDescription>

              <div className="flex flex-col gap-4 mt-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute w-4 h-4 text-gray-400 left-3 top-2.5" />
                  <Input
                    placeholder="Search restaurants..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Select
                    value={cuisineFilter}
                    onValueChange={setCuisineFilter}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cuisines</SelectItem>
                      {cuisines.map((cuisine) => (
                        <SelectItem key={cuisine} value={cuisine}>
                          {cuisine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-s">All Statuses</SelectItem>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2 border rounded-md px-3">
                    <Button
                      className={`p-1 rounded ${view === "grid" ? "bg-gray-200" : ""}`}
                      onClick={() => setView("grid")}
                      size="icon"
                    >
                      <Grid2X2 className="w-4 h-4" />
                    </Button>
                    <Button
                      className={`p-1 rounded ${view === "list" ? "bg-gray-200" : ""}`}
                      onClick={() => setView("list")}
                      size="icon"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {view === "grid" ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                    />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <RestaurantsTable restaurants={filteredRestaurants} />
                </div>
              )}

              {filteredRestaurants.length === 0 && <NoRestaurantsFound />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>New Restaurant Applications</CardTitle>
              <CardDescription>
                Review and process new restaurant requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {restaurants?.pendingApplications?.length > 0 ? (
                <div className="overflow-x-auto">
                  <RestaurantApplicationsTable applications={restaurants?.pendingApplications} />
                </div>
              ) : (
                <NoRestaurantsPendingApplications />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured">
          <Card>
            <CardHeader>
              <CardTitle>Featured Restaurants</CardTitle>
              <CardDescription>
                Manage restaurants that appear in featured sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {restaurants
                  .filter((r) => r.featured)
                  .map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      showFeaturedToggle={true}
                    />
                  ))}
              </div>

              {restaurants.filter((r) => r.featured).length === 0 && (
                <div className="py-8 text-center">
                  <Coffee className="inline-block w-12 h-12 mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium">
                    No featured restaurants
                  </h3>
                  <p className="text-gray-500">
                    Add restaurants to the featured section
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
