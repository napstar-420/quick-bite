import React, { useState } from "react";
import {
  Bell,
  ChevronDown,
  Menu as MenuIcon,
  Search,
  Home,
  Users,
  Coffee,
  TrendingUp,
  Settings,
  LogOut,
  Truck,
  PieChart,
  MessageSquare,
  Tag,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // TODO: update path from config
  const menuItems = [
    { icon: <Home size={20} />, name: "Dashboard", path: "/admin" },
    {
      icon: <Users size={20} />,
      name: "User Management",
      path: "/admin/users",
    },
    {
      icon: <Coffee size={20} />,
      name: "Restaurant Management",
      path: "/admin/restaurants",
    },
    {
      icon: <Truck size={20} />,
      name: "Delivery Personnel",
      path: "/admin/delivery",
    },
    {
      icon: <TrendingUp size={20} />,
      name: "Analytics",
      path: "/admin/analytics",
    },
    { icon: <Tag size={20} />, name: "Promotions", path: "/admin/promotions" },
    {
      icon: <MessageSquare size={20} />,
      name: "Support",
      path: "/admin/support",
    },
    { icon: <Settings size={20} />, name: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-10 hidden transform bg-[#1A535C] text-white md:flex md:flex-col md:w-64 transition-transform duration-200 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#1A535C]/20">
          <div className="flex items-center gap-2">
            <PieChart className="w-8 h-8 text-[#FF6B35]" />
            <span className="text-xl font-bold">QuickBite Admin</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-white"
          >
            <MenuIcon className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-[#1A535C]/80 group"
              >
                <span className="mr-3 text-[#FFD166]">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-[#1A535C]/20">
            <a
              href="/admin/logout"
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-[#1A535C]/80 group"
            >
              <span className="mr-3 text-red-400">
                <LogOut size={20} />
              </span>
              Sign Out
            </a>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <MenuIcon className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-[#1A535C] text-white p-0 w-64">
          <div className="flex items-center h-16 px-4 border-b border-[#1A535C]/20">
            <div className="flex items-center gap-2">
              <PieChart className="w-8 h-8 text-[#FF6B35]" />
              <span className="text-xl font-bold">QuickBite Admin</span>
            </div>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-[#1A535C]/80 group"
                >
                  <span className="mr-3 text-[#FFD166]">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-[#1A535C]/20">
              <a
                href="/admin/logout"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-[#1A535C]/80 group"
              >
                <span className="mr-3 text-red-400">
                  <LogOut size={20} />
                </span>
                Sign Out
              </a>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 ${isSidebarOpen ? "md:ml-64" : ""}`}
      >
        {/* Top navbar */}
        <header className="z-10 flex items-center h-16 px-4 bg-white shadow-sm">
          {/* For desktop, show/hide sidebar toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-4 md:hidden"
          >
            <MenuIcon className="w-5 h-5" />
          </Button>

          {/* Search bar */}
          <div className="flex items-center w-full max-w-md">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 rounded-md"
              />
            </div>
          </div>

          <div className="flex items-center ml-auto space-x-4">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="px-4 py-2 font-medium">Notifications</div>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                  {/* Sample notifications */}
                  <div className="px-4 py-3 hover:bg-gray-100">
                    <div className="text-sm font-medium">
                      New restaurant signup
                    </div>
                    <div className="text-xs text-gray-500">
                      Italiano Pizzeria just joined the platform
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      2 minutes ago
                    </div>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-100">
                    <div className="text-sm font-medium">
                      Customer complaint
                    </div>
                    <div className="text-xs text-gray-500">
                      User #4523 reported a delivery issue
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                      15 minutes ago
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="px-4 py-2 text-sm text-center text-blue-600">
                  View all notifications
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/admin-avatar.png" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">Admin User</span>
                  </div>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
