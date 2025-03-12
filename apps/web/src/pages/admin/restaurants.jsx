import React, { useState } from "react";
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
  Filter,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  MapPin,
  Star,
  Clock,
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
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";

// Sample data for restaurants
const restaurantData = {
  restaurants: [
    {
      id: "R001",
      name: "Taste of Italy",
      image: "/api/placeholder/400/200",
      cuisine: "Italian",
      address: "123 Pasta Lane, Marinara City",
      owner: "Marco Rossi",
      contact: "+1 (555) 123-4567",
      joinDate: "2024-12-15",
      status: "Active",
      rating: 4.7,
      totalOrders: 1245,
      avgDeliveryTime: 32,
      featured: true
    },
    {
      id: "R002",
      name: "Spice Garden",
      image: "/api/placeholder/400/200",
      cuisine: "Indian",
      address: "45 Curry Road, Spiceville",
      owner: "Priya Sharma",
      contact: "+1 (555) 765-4321",
      joinDate: "2025-01-22",
      status: "Pending",
      rating: 4.2,
      totalOrders: 578,
      avgDeliveryTime: 38,
      featured: false
    },
    {
      id: "R003",
      name: "Burger Boulevard",
      image: "/api/placeholder/400/200",
      cuisine: "American",
      address: "78 Patty Street, Burgertown",
      owner: "James Smith",
      contact: "+1 (555) 987-6543",
      joinDate: "2024-11-05",
      status: "Active",
      rating: 4.5,
      totalOrders: 2134,
      avgDeliveryTime: 25,
      featured: true
    },
    {
      id: "R004",
      name: "Sushi Express",
      image: "/api/placeholder/400/200",
      cuisine: "Japanese",
      address: "90 Roll Avenue, Wasabi Heights",
      owner: "Kenji Tanaka",
      contact: "+1 (555) 246-8102",
      joinDate: "2025-01-10",
      status: "Active",
      rating: 4.8,
      totalOrders: 967,
      avgDeliveryTime: 35,
      featured: true
    },
    {
      id: "R005",
      name: "Green Leaf",
      image: "/api/placeholder/400/200",
      cuisine: "Vegetarian",
      address: "12 Veggie Boulevard, Greenville",
      owner: "Emma Wilson",
      contact: "+1 (555) 135-7924",
      joinDate: "2025-02-18",
      status: "Under Review",
      rating: 4.1,
      totalOrders: 325,
      avgDeliveryTime: 30,
      featured: false
    },
    {
      id: "R006",
      name: "Taco Fiesta",
      image: "/api/placeholder/400/200",
      cuisine: "Mexican",
      address: "567 Salsa Street, Jalapeño Junction",
      owner: "Carlos Rodriguez",
      contact: "+1 (555) 975-3108",
      joinDate: "2025-01-05",
      status: "Active",
      rating: 4.4,
      totalOrders: 856,
      avgDeliveryTime: 28,
      featured: false
    },
    {
      id: "R007",
      name: "Noodle House",
      image: "/api/placeholder/400/200",
      cuisine: "Chinese",
      address: "34 Dumpling Road, Wonton City",
      owner: "Li Wei",
      contact: "+1 (555) 753-9512",
      joinDate: "2024-12-28",
      status: "Inactive",
      rating: 4.0,
      totalOrders: 652,
      avgDeliveryTime: 40,
      featured: false
    },
  ],
  pendingApplications: [
    {
      id: "RA001",
      name: "Mediterranean Delights",
      cuisine: "Mediterranean",
      owner: "Elena Christos",
      contact: "+1 (555) 852-7410",
      applicationDate: "2025-03-05",
      status: "Pending Review"
    },
    {
      id: "RA002",
      name: "Thai Spice",
      cuisine: "Thai",
      owner: "Somchai Patel",
      contact: "+1 (555) 741-9630",
      applicationDate: "2025-03-08",
      status: "Pending Review"
    },
    {
      id: "RA003",
      name: "BBQ Pit",
      cuisine: "Barbecue",
      owner: "Robert Johnson",
      contact: "+1 (555) 963-0258",
      applicationDate: "2025-03-10",
      status: "Document Verification"
    }
  ]
};

// Restaurant Status Badge Component
const StatusBadge = ({ status }) => {
  let color = "";

  switch (status) {
    case "Active":
      color = "bg-green-100 text-green-800";
      break;
    case "Pending":
      color = "bg-yellow-100 text-yellow-800";
      break;
    case "Under Review":
      color = "bg-blue-100 text-blue-800";
      break;
    case "Inactive":
      color = "bg-red-100 text-red-800";
      break;
    case "Pending Review":
      color = "bg-purple-100 text-purple-800";
      break;
    case "Document Verification":
      color = "bg-indigo-100 text-indigo-800";
      break;
    default:
      color = "bg-gray-100 text-gray-800";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      {status}
    </span>
  );
};

export default function RestaurantsManagement() {
  const [view, setView] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Filter restaurants based on search term and filters
  const filteredRestaurants = restaurantData.restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCuisine = cuisineFilter === "" || restaurant.cuisine === cuisineFilter;
    const matchesStatus = statusFilter === "" || restaurant.status === statusFilter;

    return matchesSearch && matchesCuisine && matchesStatus;
  });

  // Get unique cuisines for filter dropdown
  const cuisines = [...new Set(restaurantData.restaurants.map(r => r.cuisine))];
  const statuses = [...new Set(restaurantData.restaurants.map(r => r.status))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Restaurant Management</h1>
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
              <CardDescription>Manage all restaurants on the platform</CardDescription>

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
                  <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cuisines</SelectItem>
                      {cuisines.map(cuisine => (
                        <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-s">All Statuses</SelectItem>
                      {statuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2 border rounded-md px-3">
                    <button
                      className={`p-1 rounded ${view === 'grid' ? 'bg-gray-200' : ''}`}
                      onClick={() => setView('grid')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                    </button>
                    <button
                      className={`p-1 rounded ${view === 'list' ? 'bg-gray-200' : ''}`}
                      onClick={() => setView('list')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {view === 'grid' ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredRestaurants.map(restaurant => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Restaurant</th>
                        <th className="px-4 py-2 text-left">Cuisine</th>
                        <th className="px-4 py-2 text-left">Owner</th>
                        <th className="px-4 py-2 text-left">Rating</th>
                        <th className="px-4 py-2 text-center">Status</th>
                        <th className="px-4 py-2 text-center">Featured</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRestaurants.map(restaurant => (
                        <tr key={restaurant.id} className="border-b">
                          <td className="px-4 py-3 text-sm">{restaurant.id}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 overflow-hidden rounded-md">
                                <img src={restaurant.image} alt={restaurant.name} className="object-cover w-full h-full" />
                              </div>
                              <span className="font-medium">{restaurant.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">{restaurant.cuisine}</td>
                          <td className="px-4 py-3 text-sm">{restaurant.owner}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                              {restaurant.rating}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-center">
                            <StatusBadge status={restaurant.status} />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Switch checked={restaurant.featured} />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {filteredRestaurants.length === 0 && (
                <div className="py-8 text-center">
                  <Coffee className="inline-block w-12 h-12 mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium">No restaurants found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search term</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>New Restaurant Applications</CardTitle>
              <CardDescription>Review and process new restaurant requests</CardDescription>
            </CardHeader>
            <CardContent>
              {restaurantData.pendingApplications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Application ID</th>
                        <th className="px-4 py-2 text-left">Restaurant Name</th>
                        <th className="px-4 py-2 text-left">Cuisine</th>
                        <th className="px-4 py-2 text-left">Owner</th>
                        <th className="px-4 py-2 text-left">Contact</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-center">Status</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {restaurantData.pendingApplications.map(application => (
                        <tr key={application.id} className="border-b">
                          <td className="px-4 py-3 text-sm">{application.id}</td>
                          <td className="px-4 py-3 font-medium">{application.name}</td>
                          <td className="px-4 py-3 text-sm">{application.cuisine}</td>
                          <td className="px-4 py-3 text-sm">{application.owner}</td>
                          <td className="px-4 py-3 text-sm">{application.contact}</td>
                          <td className="px-4 py-3 text-sm">{application.applicationDate}</td>
                          <td className="px-4 py-3 text-sm text-center">
                            <StatusBadge status={application.status} />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <Check className="w-4 h-4 mr-1" /> Approve
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                                <X className="w-4 h-4 mr-1" /> Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Coffee className="inline-block w-12 h-12 mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium">No pending applications</h3>
                  <p className="text-gray-500">All restaurant applications have been processed</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured">
          <Card>
            <CardHeader>
              <CardTitle>Featured Restaurants</CardTitle>
              <CardDescription>Manage restaurants that appear in featured sections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {restaurantData.restaurants
                  .filter(r => r.featured)
                  .map(restaurant => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      showFeaturedToggle={true}
                    />
                  ))}
              </div>

              {restaurantData.restaurants.filter(r => r.featured).length === 0 && (
                <div className="py-8 text-center">
                  <Coffee className="inline-block w-12 h-12 mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium">No featured restaurants</h3>
                  <p className="text-gray-500">Add restaurants to the featured section</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Restaurant Card Component
const RestaurantCard = ({ restaurant, showFeaturedToggle = false }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2">
          <StatusBadge status={restaurant.status} />
        </div>
        {restaurant.featured && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-brand-accent text-brand-secondary">Featured</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold">{restaurant.name}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
            <span>{restaurant.rating}</span>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-500">
          <div className="flex items-start mb-1">
            <Coffee className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{restaurant.cuisine}</span>
          </div>
          <div className="flex items-start mb-1">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{restaurant.address}</span>
          </div>
          <div className="flex items-start">
            <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>Avg. delivery: {restaurant.avgDeliveryTime} min</span>
          </div>
        </div>

        {showFeaturedToggle && (
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <Label htmlFor={`featured-${restaurant.id}`} className="font-medium">Featured Status</Label>
            <Switch id={`featured-${restaurant.id}`} checked={restaurant.featured} />
          </div>
        )}

        <div className="flex justify-between gap-2 mt-2">
          <Button variant="outline" className="flex-1">
            <Edit className="w-4 h-4 mr-2" /> Edit
          </Button>
          {restaurant.status === "Active" ? (
            <Button variant="outline" className="flex-1 text-amber-600 border-amber-200 hover:bg-amber-50">
              Suspend
            </Button>
          ) : (
            <Button variant="outline" className="flex-1 text-green-600 border-green-200 hover:bg-green-50">
              Activate
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
