import {
  Search,
  Menu,
  MapPin,
  ChevronDown,
  ShoppingBag,
  Ticket,
  HelpCircle,
  LogOut,
  UserRound,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Link } from "react-router-dom";
import config from "../config";
import { useAuth } from "../hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import React, { useState } from "react";

// TODO: add Address book, Order history, Favorites, Loyalty points
const userDropDownItems = [
  {
    Icon: UserRound,
    label: "Account",
    href: config.ROUTES.ACCOUNT,
  },
  {
    Icon: Ticket,
    label: "Vouchers",
    href: "",
    separator: true,
  },
  {
    Icon: HelpCircle,
    label: "Help",
    href: "",
  },
  {
    Icon: LogOut,
    label: "Logout",
    href: config.ROUTES.LOGOUT,
  },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const [selectedCity, setSelectedCity] = useState("lahore");

  const handleItemClick = () => {
    setOpen(false);
  };

  return (
    <header className="py-3 border-b-2 border-border">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={config.ROUTES.HOME} className="font-bold text-xl">
            {config.APP_NAME}
          </Link>

          <div className="flex items-center gap-1 ml-4">
            <MapPin className="h-5 w-5" />
            <Select
              value={selectedCity}
              onValueChange={(value) => setSelectedCity(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lahore">
                  Lahore
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to={config.ROUTES.CART} className="relative">
            <ShoppingBag className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-green-600 text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </Link>

          {isAuthenticated ? (
            // TODO: refactor
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <Button asChild variant="outline">
                <DropdownMenuTrigger>
                  <UserRound />
                  {user.name.split(" ")[0]}
                </DropdownMenuTrigger>
              </Button>
              <DropdownMenuContent>
                {userDropDownItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <DropdownMenuItem className="p-0" onClick={handleItemClick}>
                      <Link
                        to={item.href}
                        className="flex items-center gap-2 w-full px-2 py-1.5"
                      >
                        <item.Icon /> {item.label}
                      </Link>
                    </DropdownMenuItem>
                    {item.separator && <DropdownMenuSeparator />}
                  </React.Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                asChild
                variant="link"
                className="hover:no-underline font-medium rounded-full"
              >
                <Link to={config.ROUTES.AUTH}>Log in</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="font-medium rounded-full"
              >
                <Link to={config.ROUTES.AUTH}>Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
