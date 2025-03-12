import React from "react";
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
  TrendingUp,
  TrendingDown,
  Users,
  Coffee,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { Progress } from "../../components/ui/progress";

// Sample data
const dummyData = {
  stats: {
    totalUsers: 12568,
    totalRestaurants: 357,
    totalDeliveryPersonnel: 845,
    totalOrders: 38452,
    revenue: 245780,
    userGrowth: 12.5,
    restaurantGrowth: 8.3,
    deliveryGrowth: 15.7,
    orderGrowth: 21.2,
    revenueGrowth: 18.4,
  },
  recentUsers: [
    {
      id: "U001",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      joinDate: "2025-03-10",
      orders: 14,
    },
    {
      id: "U002",
      name: "James Wilson",
      email: "james.w@email.com",
      joinDate: "2025-03-09",
      orders: 0,
    },
    {
      id: "U003",
      name: "Emily Davis",
      email: "emily.d@email.com",
      joinDate: "2025-03-09",
      orders: 3,
    },
    {
      id: "U004",
      name: "Michael Smith",
      email: "michael.s@email.com",
      joinDate: "2025-03-08",
      orders: 5,
    },
    {
      id: "U005",
      name: "Jessica Brown",
      email: "jessica.b@email.com",
      joinDate: "2025-03-07",
      orders: 2,
    },
  ],
  recentRestaurants: [
    {
      id: "R001",
      name: "Taste of Italy",
      cuisine: "Italian",
      joinDate: "2025-03-11",
      status: "Active",
    },
    {
      id: "R002",
      name: "Spice Garden",
      cuisine: "Indian",
      joinDate: "2025-03-10",
      status: "Pending",
    },
    {
      id: "R003",
      name: "Burger Boulevard",
      cuisine: "American",
      joinDate: "2025-03-09",
      status: "Active",
    },
    {
      id: "R004",
      name: "Sushi Express",
      cuisine: "Japanese",
      joinDate: "2025-03-09",
      status: "Active",
    },
    {
      id: "R005",
      name: "Green Leaf",
      cuisine: "Vegetarian",
      joinDate: "2025-03-08",
      status: "Under Review",
    },
  ],
  recentOrders: [
    {
      id: "O001",
      user: "Emily Davis",
      restaurant: "Burger Boulevard",
      amount: 42.5,
      status: "Delivered",
    },
    {
      id: "O002",
      user: "Michael Smith",
      restaurant: "Taste of Italy",
      amount: 68.75,
      status: "In Transit",
    },
    {
      id: "O003",
      user: "James Wilson",
      restaurant: "Sushi Express",
      amount: 32.2,
      status: "Preparing",
    },
    {
      id: "O004",
      user: "Sarah Johnson",
      restaurant: "Spice Garden",
      amount: 54.3,
      status: "Delivered",
    },
    {
      id: "O005",
      user: "Jessica Brown",
      restaurant: "Burger Boulevard",
      amount: 28.95,
      status: "Delivered",
    },
  ],
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>

      {/* Overview stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={dummyData.stats.totalUsers.toLocaleString()}
          icon={<Users className="w-8 h-8 text-blue-600" />}
          change={dummyData.stats.userGrowth}
          changeText="from last month"
        />
        <StatCard
          title="Total Restaurants"
          value={dummyData.stats.totalRestaurants.toLocaleString()}
          icon={<Coffee className="w-8 h-8 text-green-600" />}
          change={dummyData.stats.restaurantGrowth}
          changeText="from last month"
        />
        <StatCard
          title="Delivery Personnel"
          value={dummyData.stats.totalDeliveryPersonnel.toLocaleString()}
          icon={<Truck className="w-8 h-8 text-purple-600" />}
          change={dummyData.stats.deliveryGrowth}
          changeText="from last month"
        />
        <StatCard
          title="Total Orders"
          value={dummyData.stats.totalOrders.toLocaleString()}
          icon={<ShoppingBag className="w-8 h-8 text-orange-600" />}
          change={dummyData.stats.orderGrowth}
          changeText="from last month"
        />
      </div>

      {/* Revenue Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Total revenue and growth trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col space-y-2">
              <span className="text-sm text-gray-500">Total Revenue</span>
              <span className="text-3xl font-bold">
                ${dummyData.stats.revenue.toLocaleString()}
              </span>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>{dummyData.stats.revenueGrowth}% increase</span>
              </div>
            </div>

            <div className="col-span-2">
              <div className="space-y-4">
                <RevenueMetric
                  label="New Users Revenue"
                  value={65780}
                  percentage={26.8}
                  color="bg-blue-600"
                />
                <RevenueMetric
                  label="Returning Users Revenue"
                  value={180000}
                  percentage={73.2}
                  color="bg-purple-600"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Tabs */}
      <Tabs defaultValue="orders">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="users">New Users</TabsTrigger>
          <TabsTrigger value="restaurants">New Restaurants</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest transactions across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Order ID</th>
                      <th className="px-4 py-2 text-left">Customer</th>
                      <th className="px-4 py-2 text-left">Restaurant</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      <th className="px-4 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyData.recentOrders.map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="px-4 py-3 text-sm">{order.id}</td>
                        <td className="px-4 py-3 text-sm">{order.user}</td>
                        <td className="px-4 py-3 text-sm">
                          {order.restaurant}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          ${order.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>New Users</CardTitle>
              <CardDescription>Recently registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">User ID</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Join Date</th>
                      <th className="px-4 py-2 text-center">Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyData.recentUsers.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="px-4 py-3 text-sm">{user.id}</td>
                        <td className="px-4 py-3 text-sm">{user.name}</td>
                        <td className="px-4 py-3 text-sm">{user.email}</td>
                        <td className="px-4 py-3 text-sm">{user.joinDate}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          {user.orders}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="restaurants">
          <Card>
            <CardHeader>
              <CardTitle>New Restaurants</CardTitle>
              <CardDescription>Recently onboarded restaurants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Restaurant ID</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Cuisine</th>
                      <th className="px-4 py-2 text-left">Join Date</th>
                      <th className="px-4 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyData.recentRestaurants.map((restaurant) => (
                      <tr key={restaurant.id} className="border-b">
                        <td className="px-4 py-3 text-sm">{restaurant.id}</td>
                        <td className="px-4 py-3 text-sm">{restaurant.name}</td>
                        <td className="px-4 py-3 text-sm">
                          {restaurant.cuisine}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {restaurant.joinDate}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <RestaurantStatusBadge status={restaurant.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper components
const StatCard = ({ title, value, icon, change, changeText }) => {
  const isPositive = change >= 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
        </div>
        <div className="flex items-center mt-4 text-sm">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
          )}
          <span className={isPositive ? "text-green-600" : "text-red-600"}>
            {isPositive ? "+" : ""}
            {change}%
          </span>
          <span className="ml-1 text-gray-500">{changeText}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const RevenueMetric = ({ label, value, percentage, color }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-medium">${value.toLocaleString()}</span>
      </div>
      <Progress value={percentage} className={color} />
      <span className="text-xs text-gray-500">
        {percentage}% of total revenue
      </span>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  let color = "";

  switch (status) {
    case "Delivered":
      color = "bg-green-100 text-green-800";
      break;
    case "In Transit":
      color = "bg-blue-100 text-blue-800";
      break;
    case "Preparing":
      color = "bg-yellow-100 text-yellow-800";
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

const RestaurantStatusBadge = ({ status }) => {
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
